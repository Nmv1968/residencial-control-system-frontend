import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovementsService } from '../../services/movements.service';
import { HousingService } from '../../services/housing.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { PaginatorNavIntl } from '../../services/paginator-nav.service';

import { ConfirmDialogComponent } from '../../components/common/confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';
import { FinancialMovement } from '../../schemas/financial.schemas';
import { TableSkeletonComponent } from '../../components/common/table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatMenuModule,
    RouterLink,
    TableSkeletonComponent,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorNavIntl }],
  templateUrl: './movements.component.html',
})
export class MovementsComponent implements OnInit {
  private movementsService = inject(MovementsService);
  private housingService = inject(HousingService);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  movements = signal<FinancialMovement[]>([]);
  isLoading = signal(false);
  displayedColumns: string[] = [
    'date',
    'type',
    'concept',
    'amount',
    'housing',
    // 'reversed',
    'actions',
  ];

  // Pagination State
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  // Filter State
  showFilters = false;
  filters = {
    startDate: '',
    endDate: '',
    tipo: '',
    concepto: '',
    unitId: '',
    isReversed: undefined as boolean | undefined,
  };

  units: any[] = [];
  typeOptions = [
    { value: 'CARGO_MENSUAL', label: 'Cargo Mensual' },
    { value: 'PAGO', label: 'Pago' },
    { value: 'GASTO', label: 'Gasto' },
    { value: 'AJUSTE', label: 'Ajuste' },
  ];
  reversalOptions = [
    { value: true, label: 'Sí' },
    { value: false, label: 'No' },
  ];

  ngOnInit() {
    this.loadUnits();
    this.loadData();
  }

  loadUnits() {
    this.housingService.findAll(1, 1000).subscribe({
      next: (response) => {
        this.units = response.data;
      },
    });
  }

  loadData() {
    this.isLoading.set(true);
    const apiPage = this.pageIndex + 1;

    // Build active filters object
    const activeFilters: any = {};
    if (this.filters.startDate)
      activeFilters.startDate = this.filters.startDate;
    if (this.filters.endDate) activeFilters.endDate = this.filters.endDate;
    if (this.filters.tipo) activeFilters.tipo = this.filters.tipo;
    if (this.filters.concepto) activeFilters.concepto = this.filters.concepto;
    if (this.filters.unitId) activeFilters.unitId = this.filters.unitId;
    // Only add isReversed if it's explicitly true or false (not null/undefined)
    if (typeof this.filters.isReversed === 'boolean') {
      activeFilters.isReversed = this.filters.isReversed;
    }

    this.movementsService
      .findAll(
        apiPage,
        this.pageSize,
        Object.keys(activeFilters).length > 0 ? activeFilters : undefined,
      )
      .subscribe((response) => {
        this.movements.set(response.data);
        this.totalItems = response.total;
        this.isLoading.set(false);
      });
  }

  applyFilters() {
    this.pageIndex = 0;
    this.loadData();
  }

  clearFilters() {
    this.filters = {
      startDate: '',
      endDate: '',
      tipo: '',
      concepto: '',
      unitId: '',
      isReversed: undefined,
    };
    this.applyFilters();
  }

  // Computed totals
  get totalIncome(): number {
    return this.movements()
      .filter((m) => m.type === 'Income' && !m.isReversed)
      .reduce((sum, m) => sum + m.amount, 0);
  }

  get totalExpenses(): number {
    return this.movements()
      .filter((m) => m.type === 'Expense' && !m.isReversed)
      .reduce((sum, m) => sum + m.amount, 0);
  }

  get balance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadData();
  }

  reverseMovement(item: FinancialMovement) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `¿Estás seguro de que deseas REVERTIR este movimiento (${item.concept})? Esto creará un contra-movimiento.`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.movementsService
          .reverse(item._id, 'Solicitado por usuario')
          .subscribe(() => this.loadData());
      }
    });
  }
}

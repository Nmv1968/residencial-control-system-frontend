import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsService } from '../../services/movements.service';
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
    'reversed',
    'actions',
  ];

  // Pagination State
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    const apiPage = this.pageIndex + 1;
    this.movementsService
      .findAll(apiPage, this.pageSize)
      .subscribe((response) => {
        this.movements.set(response.data);
        this.totalItems = response.total;
        this.isLoading.set(false);
      });
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

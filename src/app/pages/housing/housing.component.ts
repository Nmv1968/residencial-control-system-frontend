import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HousingService } from '../../services/housing.service';
import { CategoriesService } from '../../services/categories.service';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';

import { ConfirmDialogComponent } from '../../components/common/confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';
import { PaginatorNavIntl } from '../../services/paginator-nav.service';
import { TableSkeletonComponent } from '../../components/common/table-skeleton/table-skeleton.component';
import { SweetAlertService } from '../../services/sweet-alert.service';

@Component({
  selector: 'app-housing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    RouterLink,
    TableSkeletonComponent,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorNavIntl }],
  templateUrl: './housing.component.html',
})
export class HousingComponent implements OnInit {
  private housingService = inject(HousingService);
  private categoriesService = inject(CategoriesService);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  housing = signal<any[]>([]);
  isLoading = signal(false);

  private sweetAlert = inject(SweetAlertService);

  // Pagination State
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  // Filter State
  showFilters = false;
  filters = {
    number: '',
    categoryId: '',
    status: '',
    hasPendingBalance: undefined as boolean | undefined,
  };

  categories: any[] = [];
  statusOptions = [
    { value: 'OCCUPIED', label: 'Ocupada' },
    { value: 'VACANT', label: 'Vacante' },
    { value: 'MAINTENANCE', label: 'Mantenimiento' },
  ];

  ngOnInit() {
    this.loadCategories();
    this.loadData();
  }

  loadCategories() {
    this.categoriesService.findAll().subscribe({
      next: (categories: any) => {
        this.categories = categories;
      },
      error: () => {
        console.error('Failed to load categories');
      },
    });
  }

  loadData() {
    this.isLoading.set(true);
    // API uses 1-based page index, Material uses 0-based
    const apiPage = this.pageIndex + 1;

    // Build active filters object (only include non-empty values)
    const activeFilters: any = {};
    if (this.filters.number) activeFilters.number = this.filters.number;
    if (this.filters.categoryId)
      activeFilters.categoryId = this.filters.categoryId;
    if (this.filters.status) activeFilters.status = this.filters.status;
    if (this.filters.hasPendingBalance !== undefined) {
      activeFilters.hasPendingBalance = this.filters.hasPendingBalance;
    }

    this.housingService
      .findAll(
        apiPage,
        this.pageSize,
        Object.keys(activeFilters).length > 0 ? activeFilters : undefined,
      )
      .subscribe({
        next: (response) => {
          this.housing.set(response.data);
          this.totalItems = response.total;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.sweetAlert.error('Error', 'No se pudieron cargar los datos.');
        },
      });
  }

  applyFilters() {
    this.pageIndex = 0; // Reset to first page when filtering
    this.loadData();
  }

  clearFilters() {
    this.filters = {
      number: '',
      categoryId: '',
      status: '',
      hasPendingBalance: undefined,
    };
    this.applyFilters();
  }

  handlePageEvent(e: any) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadData();
  }

  async delete(id: string) {
    const confirmed = await this.sweetAlert.confirm(
      '¿Estás seguro?',
      'Esta acción eliminará la vivienda y no se puede deshacer.',
      'Sí, eliminar',
    );

    if (confirmed) {
      this.housingService.delete(id).subscribe({
        next: () => {
          this.sweetAlert.success(
            'Eliminado',
            'La vivienda ha sido eliminada.',
          );
          this.loadData();
        },
        error: () => {
          this.sweetAlert.error('Error', 'No se pudo eliminar la vivienda.');
        },
      });
    }
  }
}

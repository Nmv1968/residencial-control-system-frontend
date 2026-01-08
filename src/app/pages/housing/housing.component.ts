import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingService } from '../../services/housing.service';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmDialogComponent } from '../../components/common/confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';
import { PaginatorNavIntl } from '../../services/paginator-nav.service';

@Component({
  selector: 'app-housing',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterLink,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorNavIntl }],
  templateUrl: './housing.component.html',
})
export class HousingComponent implements OnInit {
  private housingService = inject(HousingService);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  housing = signal<any[]>([]);
  isLoading = signal(false);

  // Pagination State
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    // API uses 1-based page index, Material uses 0-based
    const apiPage = this.pageIndex + 1;

    this.housingService.findAll(apiPage, this.pageSize).subscribe({
      next: (response) => {
        this.housing.set(response.data);
        this.totalItems = response.total;
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  handlePageEvent(e: any) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadData();
  }

  delete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Estás seguro de que deseas eliminar esta vivienda?' },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.housingService.delete(id).subscribe(() => this.loadData());
      }
    });
  }
}

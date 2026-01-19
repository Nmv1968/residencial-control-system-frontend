import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsService } from '../../services/movements.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { PaginatorNavIntl } from '../../services/paginator-nav.service';

import { ConfirmDialogComponent } from '../../components/common/confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';
import { FinancialMovement } from '../../schemas/financial.schemas';

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
    RouterLink,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorNavIntl }],
  templateUrl: './movements.component.html',
})
export class MovementsComponent implements OnInit {
  private movementsService = inject(MovementsService);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  movements = signal<FinancialMovement[]>([]);
  displayedColumns: string[] = [
    'date',
    'type',
    'concept',
    'amount',
    'housing',
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
    const apiPage = this.pageIndex + 1;
    this.movementsService
      .findAll(apiPage, this.pageSize)
      .subscribe((response) => {
        this.movements.set(response.data);
        this.totalItems = response.total;
      });
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

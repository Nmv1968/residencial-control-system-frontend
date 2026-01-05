import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsService } from '../../services/movements.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { ConfirmDialogComponent } from '../../components/common/confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';

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
    RouterLink,
  ],
  templateUrl: './movements.component.html',
})
export class MovementsComponent implements OnInit {
  private movementsService = inject(MovementsService);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  movements = signal<any[]>([]);
  displayedColumns: string[] = [
    'date',
    'type',
    'concept',
    'amount',
    'housing',
    'actions',
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.movementsService
      .findAll()
      .subscribe((data) => this.movements.set(data));
  }

  reverseMovement(item: any) {
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

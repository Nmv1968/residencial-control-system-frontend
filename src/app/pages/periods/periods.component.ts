import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodsService } from '../../services/periods.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { PeriodDialogComponent } from './period-dialog.component';
import { ConfirmDialogComponent } from '../../components/common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-periods',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
  ],
  templateUrl: './periods.component.html',
})
export class PeriodsComponent implements OnInit {
  private periodsService = inject(PeriodsService);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  periods = signal<any[]>([]);
  displayedColumns: string[] = ['year', 'month', 'status', 'actions'];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.periodsService.findAll().subscribe((data) => this.periods.set(data));
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(PeriodDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.periodsService.create(result).subscribe(() => this.loadData());
      }
    });
  }

  closePeriod(item: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `¿Estás seguro de que deseas CERRAR el periodo ${item.month}/${item.year}? Esto no se puede deshacer.`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.periodsService.close(item._id).subscribe(() => this.loadData());
      }
    });
  }
}

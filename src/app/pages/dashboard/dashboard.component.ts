import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingService } from '../../services/housing.service';
import { PeriodsService } from '../../services/periods.service';
import { MovementsService } from '../../services/movements.service';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private housingService = inject(HousingService);
  periodsService = inject(PeriodsService);
  movementsService = inject(MovementsService);

  totalHousing = 0;
  totalBalance = 0;
  recentMovements: any[] = [];
  loading = false;

  ngOnInit() {
    this.loading = true;
    forkJoin({
      housing: this.housingService.findAll(),
      movements: this.movementsService.findAll(),
    }).subscribe({
      next: ({ housing, movements }) => {
        this.totalHousing = housing.length;
        this.totalBalance = housing.reduce((acc, h) => acc + h.balance, 0);
        this.recentMovements = movements.slice(0, 5); // Mock recent
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}

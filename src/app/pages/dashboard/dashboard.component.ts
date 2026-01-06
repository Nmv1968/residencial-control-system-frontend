import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  // KPIs
  kpis = {
    cashBalance: 0,
    totalReceivable: 0,
    unitsInArrears: 0,
    collectionProgress: 0,
  };

  recentActivity: any[] = [];
  loading = true;

  // Bar Chart (Income vs Expense)
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingresos',
        backgroundColor: '#3B82F6',
        hoverBackgroundColor: '#2563EB',
      },
      {
        data: [],
        label: 'Gastos',
        backgroundColor: '#EF4444',
        hoverBackgroundColor: '#DC2626',
      },
    ],
  };

  // Doughnut Chart (Occupancy)
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
    },
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      { data: [], backgroundColor: ['#10B981', '#3B82F6', '#E2E8F0'] },
    ],
  };

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getSummary().subscribe((data) => {
      this.kpis = data;
    });

    this.dashboardService.getIncomeExpensesHistory().subscribe((data) => {
      this.barChartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.income,
            label: 'Ingresos',
            backgroundColor: '#3B82F6',
            borderRadius: 4,
          },
          {
            data: data.expenses,
            label: 'Gastos',
            backgroundColor: '#EF4444',
            borderRadius: 4,
          },
        ],
      };
    });

    this.dashboardService.getOccupancyStats().subscribe((data) => {
      this.doughnutChartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            backgroundColor: ['#10B981', '#3B82F6', '#CBD5E1'],
            hoverOffset: 4,
          },
        ],
      };
    });

    this.dashboardService.getRecentActivity().subscribe((data) => {
      this.recentActivity = data;
      this.loading = false;
    });
  }
}

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
    datasets: [{ data: [], backgroundColor: ['#10B981', '#E5E7EB'] }],
  };

  // Financial Status data
  debtorRate = 0;
  totalUnits = 0;
  debtorUnits = 0;
  solventUnits = 0;

  // Chart Date Range Filter
  selectedRange = 6;
  timeRanges = [
    { label: 'Últimos 3 Meses', value: 3 },
    { label: 'Últimos 6 Meses', value: 6 },
    { label: 'Último Año', value: 12 },
  ];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    let loadedCount = 0;
    const totalLoads = 4;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalLoads) {
        this.loading = false;
      }
    };

    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.kpis = data;
        checkAllLoaded();
      },
      error: () => checkAllLoaded(),
    });

    this.loadChartData(() => checkAllLoaded());

    this.dashboardService.getFinancialStats().subscribe({
      next: (data) => {
        this.debtorRate = data.debtorRate || 0;
        this.totalUnits = data.total || 0;
        this.debtorUnits = data.data[0] || 0;
        this.solventUnits = data.data[1] || 0;

        this.doughnutChartData = {
          labels: data.labels,
          datasets: [
            {
              data: data.data,
              backgroundColor: ['#EF4444', '#10B981'], // Red for Debtors, Green for Solvent
              hoverOffset: 4,
            },
          ],
        };
        checkAllLoaded();
      },
      error: () => checkAllLoaded(),
    });

    this.dashboardService.getRecentActivity().subscribe({
      next: (data) => {
        this.recentActivity = data;
        checkAllLoaded();
      },
      error: () => checkAllLoaded(),
    });
  }

  loadChartData(callback?: () => void) {
    this.dashboardService
      .getIncomeExpensesHistory(this.selectedRange)
      .subscribe({
        next: (data) => {
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
          if (callback) callback();
        },
        error: () => {
          if (callback) callback();
        },
      });
  }

  updateChartRange(months: number) {
    this.selectedRange = months;
    this.loadChartData();
  }
}

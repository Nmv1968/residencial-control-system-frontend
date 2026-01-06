import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  getSummary() {
    // Mock data matching the new design requirements
    return of({
      cashBalance: 15420.5,
      totalReceivable: 3200.0,
      unitsInArrears: 5,
      collectionProgress: 75, // Percentage
    });
  }

  getIncomeExpensesHistory() {
    return of({
      labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
      income: [4500, 4800, 4200, 5000, 5500, 3200],
      expenses: [3000, 3200, 4000, 3500, 6000, 2000],
    });
  }

  getOccupancyStats() {
    return of({
      labels: ['Propietarios', 'Inquilinos', 'Vacíos'],
      data: [65, 30, 5],
    });
  }

  getRecentActivity() {
    return of([
      {
        id: 1,
        type: 'PAGO',
        unit: 'A-101',
        amount: 150.0,
        date: new Date(),
        status: 'COMPLETED',
      },
      {
        id: 2,
        type: 'PAGO',
        unit: 'B-205',
        amount: 150.0,
        date: new Date(Date.now() - 3600000),
        status: 'COMPLETED',
      },
      {
        id: 3,
        type: 'CARGO',
        unit: 'ALL',
        amount: 50.0,
        date: new Date(Date.now() - 86400000),
        status: 'COMPLETED',
      },
      {
        id: 4,
        type: 'PAGO',
        unit: 'C-302',
        amount: 150.0,
        date: new Date(Date.now() - 172800000),
        status: 'PENDING',
      },
      {
        id: 5,
        type: 'GASTO',
        description: 'Mantenimiento Jardín',
        amount: 200.0,
        date: new Date(Date.now() - 259200000),
        status: 'COMPLETED',
      },
    ]);
  }
}

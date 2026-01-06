import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private transactionsUrl = 'http://localhost:3000/api/v1/transactions';
  private expensesUrl = 'http://localhost:3000/api/v1/expenses';
  private http = inject(HttpClient);

  findAll() {
    // Merge Transactions and Expenses into a single list
    return forkJoin({
      transactions: this.http.get<any[]>(this.transactionsUrl),
      expenses: this.http.get<any[]>(this.expensesUrl),
    }).pipe(
      map(({ transactions, expenses }) => {
        const transMapped = transactions.map((t) => ({
          ...t,
          type: t.tipo === 'PAGO' ? 'Income' : 'Expense', // Map PAGO/CARGO to Income/Expense
          concept: t.descripcion,
          amount: t.monto,
          date: t.fecha,
          housingId: t.unidad, // Keep reference if needed
          evidenceUrl: t.evidenciaUrl, // Map back
          source: 'Transaction',
        }));
        const expMapped = expenses.map((e) => ({
          ...e,
          type: 'Expense',
          concept: e.descripcion,
          amount: e.monto,
          date: e.fecha,
          housingId: null,
          evidenceUrl: e.facturaUrl, // Map back
          source: 'Expense',
        }));
        return [...transMapped, ...expMapped].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      })
    );
  }

  findOne(id: string) {
    // Try to find in Transactions first, if not found, try Expenses
    return this.http.get<any>(`${this.transactionsUrl}/${id}`).pipe(
      map((t) => ({
        ...t,
        type: t.tipo === 'PAGO' ? 'Income' : 'Expense',
        concept: t.descripcion,
        amount: t.monto,
        date: t.fecha,
        housingId: t.unidad, // Is object or ID? Depends on backend population
        evidenceUrl: t.evidenciaUrl,
        source: 'Transaction',
      })),
      catchError(() => {
        return this.http.get<any>(`${this.expensesUrl}/${id}`).pipe(
          map((e) => ({
            ...e,
            type: 'Expense',
            concept: e.descripcion,
            amount: e.monto,
            date: e.fecha,
            housingId: null,
            evidenceUrl: e.facturaUrl,
            source: 'Expense',
            provider: e.proveedor,
          }))
        );
      })
    );
  }

  create(data: any) {
    // Logic:
    // If Housing (Unit) is present -> Transaction
    // If Housing is NOT present -> Expense (Start with this assumption)

    if (data.housingId) {
      // It's a Transaction (likely PAGO or CARGO)
      const payload = {
        unidad: data.housingId,
        tipo: data.type === 'Income' ? 'PAGO' : 'CARGO_MENSUAL', // Simplification
        monto: data.amount,
        descripcion: data.concept,
        fecha: data.date,
        evidenciaUrl: data.evidenceUrl, // New Field
      };
      return this.http.post<any>(this.transactionsUrl, payload);
    } else {
      // It's an Expense
      if (data.type === 'Income') {
        return of(null); // Fail gracefully or stick to logic
      }

      const payload = {
        proveedor: data.provider || 'General',
        descripcion: data.concept,
        monto: data.amount,
        fecha: data.date,
        facturaUrl: data.evidenceUrl, // New Field
      };
      return this.http.post<any>(this.expensesUrl, payload);
    }
  }

  update(id: string, data: any) {
    return of(null);
  }

  reverse(id: string, reason: string) {
    return of(null);
  }
}

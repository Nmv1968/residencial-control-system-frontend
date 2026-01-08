import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private transactionsUrl = 'http://localhost:3000/api/v1/transactions';
  private http = inject(HttpClient);

  findAll() {
    return this.http.get<any[]>(this.transactionsUrl).pipe(
      map((transactions) => {
        return transactions.map((t) => ({
          ...t,
          // Map Backend Types to Frontend Types:
          // PAGO / CARGO_MENSUAL -> Income (related to Unit Debt)
          // GASTO -> Expense
          type: t.tipo === 'GASTO' ? 'Expense' : 'Income',
          concept: t.descripcion,
          amount: t.monto,
          date: t.fecha,
          housingId: t.unidad,
          evidenceUrl: t.evidenciaUrl,
          provider: t.proveedor,
          source: 'Transaction', // Unified source
          originalType: t.tipo, // Keep original type for debugging or detailed view
        }));
      })
    );
  }

  findOne(id: string) {
    return this.http.get<any>(`${this.transactionsUrl}/${id}`).pipe(
      map((t) => ({
        ...t,
        type: t.tipo === 'GASTO' ? 'Expense' : 'Income',
        concept: t.descripcion,
        amount: t.monto,
        date: t.fecha,
        housingId: t.unidad,
        evidenceUrl: t.evidenciaUrl,
        provider: t.proveedor,
        source: 'Transaction',
        originalType: t.tipo,
      }))
    );
  }

  create(data: any) {
    // Map Frontend Form to Backend DTO
    // Frontend 'Income' -> PAGO (Payment from Unit)
    // Frontend 'Expense' -> GASTO (Global Expense)

    const payload = {
      tipo: data.type === 'Income' ? 'PAGO' : 'GASTO',
      description: data.concept, // Note: verify field name map (concept -> descripcion)
      descripcion: data.concept,
      monto: data.amount,
      fecha: data.date,
      evidenciaUrl: data.evidenceUrl,
      // Optional fields based on type
      unidad: data.type === 'Income' ? data.housingId : undefined,
      proveedor: data.type === 'Expense' ? data.provider : undefined,
    };

    return this.http.post<any>(this.transactionsUrl, payload);
  }

  update(id: string, data: any) {
    return of(null);
  }

  reverse(id: string, reason: string) {
    return of(null);
  }
}

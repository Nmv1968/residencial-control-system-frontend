import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, of } from 'rxjs'; // Replaced forkJoin, catchError since unused or re-add if needed
import { FinancialMovement } from '../schemas/financial.schemas';
import { environment } from '../../environments/environment';

// Minimal backend DTO visualization
interface BackendTransaction {
  _id: string;
  tipo: 'PAGO' | 'GASTO' | 'CARGO_MENSUAL' | 'AJUSTE';
  descripcion: string;
  monto: number;
  fecha: string;
  unidad?: any;
  evidenciaUrl?: string;
  proveedor?: string;
  isReversed?: boolean;
  [key: string]: any; // Allow other backend fields
}

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private transactionsUrl = `${environment.apiUrl}/transactions`;
  private http = inject(HttpClient);

  findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      startDate?: string;
      endDate?: string;
      tipo?: string;
      concepto?: string;
      unitId?: string;
      isReversed?: boolean;
    },
  ) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Add filters if provided
    if (filters) {
      if (filters.startDate)
        params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
      if (filters.tipo) params = params.set('tipo', filters.tipo);
      if (filters.concepto) params = params.set('concepto', filters.concepto);
      if (filters.unitId) params = params.set('unitId', filters.unitId);
      if (filters.isReversed !== undefined) {
        params = params.set('isReversed', filters.isReversed.toString());
      }
    }

    return this.http
      .get<{
        data: BackendTransaction[];
        total: number;
      }>(this.transactionsUrl, { params })
      .pipe(
        map((response) => {
          const mappedData: FinancialMovement[] = response.data.map((t) => ({
            _id: t._id,
            type: t.tipo === 'GASTO' ? 'Expense' : 'Income',
            concept: t.descripcion,
            amount: t.monto,
            date: t.fecha,
            housingId: t.unidad,
            evidenceUrl: t.evidenciaUrl,
            provider: t.proveedor,
            source: 'Transaction',
            originalType: t.tipo,
            isReversed: t.isReversed,
          }));
          return { data: mappedData, total: response.total };
        }),
      );
  }

  findOne(id: string) {
    return this.http
      .get<BackendTransaction>(`${this.transactionsUrl}/${id}`)
      .pipe(
        map(
          (t): FinancialMovement => ({
            _id: t._id,
            type: t.tipo === 'GASTO' ? 'Expense' : 'Income',
            concept: t.descripcion,
            amount: t.monto,
            date: t.fecha,
            housingId: t.unidad,
            evidenceUrl: t.evidenciaUrl,
            provider: t.proveedor,
            source: 'Transaction',
            originalType: t.tipo,
            isReversed: t.isReversed,
          }),
        ),
      );
  }

  create(data: Partial<FinancialMovement>) {
    // Map Frontend Form to Backend DTO
    // Frontend 'Income' -> PAGO (Payment from Unit)
    // Frontend 'Expense' -> GASTO (Global Expense)

    const payload = {
      tipo: data.type === 'Income' ? 'PAGO' : 'GASTO',
      descripcion: data.concept,
      monto: data.amount,
      fecha: data.date,
      evidenciaUrl: data.evidenceUrl,
      // Optional fields based on type
      unidad: data.type === 'Income' ? data.housingId : undefined,
      proveedor: data.type === 'Expense' ? data.provider : undefined,
    };

    return this.http.post<BackendTransaction>(this.transactionsUrl, payload);
  }

  update(id: string, data: any) {
    return of(null);
  }

  reverse(id: string, reason: string) {
    return this.http.post<BackendTransaction>(
      `${this.transactionsUrl}/${id}/reverse`,
      {
        reason,
      },
    );
  }
}

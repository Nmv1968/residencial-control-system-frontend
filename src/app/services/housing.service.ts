import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Unit } from '../schemas/financial.schemas';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private apiUrl = `${environment.apiUrl}/units`;
  private http = inject(HttpClient);

  findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      number?: string;
      categoryId?: string;
      status?: string;
      hasPendingBalance?: boolean;
    },
  ): Observable<{ data: Unit[]; total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Add filters if provided
    if (filters) {
      if (filters.number) {
        params = params.set('number', filters.number);
      }
      if (filters.categoryId) {
        params = params.set('categoryId', filters.categoryId);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.hasPendingBalance !== undefined) {
        params = params.set(
          'hasPendingBalance',
          filters.hasPendingBalance.toString(),
        );
      }
    }

    return this.http.get<{ data: Unit[]; total: number }>(this.apiUrl, {
      params,
    });
  }

  findOne(id: string): Observable<Unit> {
    return this.http.get<Unit>(`${this.apiUrl}/${id}`);
  }

  create(unit: Partial<Unit>): Observable<Unit> {
    return this.http.post<Unit>(this.apiUrl, unit);
  }

  update(id: string, unit: Partial<Unit>): Observable<Unit> {
    return this.http.patch<Unit>(`${this.apiUrl}/${id}`, unit);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

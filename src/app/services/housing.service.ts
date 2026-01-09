import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    limit: number = 10
  ): Observable<{ data: Unit[]; total: number }> {
    return this.http.get<{ data: Unit[]; total: number }>(this.apiUrl, {
      params: { page: page.toString(), limit: limit.toString() },
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

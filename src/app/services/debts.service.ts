import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Debt } from '../schemas/financial.schemas';

@Injectable({
  providedIn: 'root',
})
export class DebtsService {
  private apiUrl = `${environment.apiUrl}/debts`;

  constructor(private http: HttpClient) {}

  create(debt: Partial<Debt>): Observable<Debt> {
    return this.http.post<Debt>(this.apiUrl, debt);
  }

  generateBulk(payload: {
    scope: 'ALL' | 'CATEGORY' | 'SINGLE';
    targetId?: string;
    amount: number;
    concept: string;
    dueDate?: string;
  }): Observable<{ count: number; message: string }> {
    return this.http.post<{ count: number; message: string }>(
      `${this.apiUrl}/generate-bulk`,
      payload
    );
  }

  findAll(): Observable<Debt[]> {
    return this.http.get<Debt[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Debt> {
    return this.http.get<Debt>(`${this.apiUrl}/${id}`);
  }

  findAllByUnit(unitId: string): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.apiUrl}/unit/${unitId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Payment } from '../schemas/financial.schemas';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  create(payment: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  findAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  findAllByUnit(unitId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/unit/${unitId}`);
  }
}

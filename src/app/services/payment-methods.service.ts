import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentMethod } from '../schemas/financial.schemas';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodsService {
  private apiUrl = `${environment.apiUrl}/payment-methods`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(this.apiUrl);
  }

  getActiveForPublic(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/public/active`);
  }

  create(paymentMethod: Partial<PaymentMethod>): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(this.apiUrl, paymentMethod);
  }

  update(
    id: string,
    paymentMethod: Partial<PaymentMethod>,
  ): Observable<PaymentMethod> {
    return this.http.patch<PaymentMethod>(
      `${this.apiUrl}/${id}`,
      paymentMethod,
    );
  }

  remove(id: string): Observable<PaymentMethod> {
    return this.http.delete<PaymentMethod>(`${this.apiUrl}/${id}`);
  }

  findOne(id: string): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(`${this.apiUrl}/${id}`);
  }
}

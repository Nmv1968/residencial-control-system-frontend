import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PeriodsService {
  private apiUrl = 'http://localhost:3000/api/v1/periods';
  private http = inject(HttpClient);

  findAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: string, data: any) {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  close(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { status: 'Closed' });
  }
}

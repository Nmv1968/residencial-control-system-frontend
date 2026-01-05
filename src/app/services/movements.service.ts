import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private apiUrl = 'http://localhost:3000/api/v1/movements';
  private http = inject(HttpClient);

  findAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  findOne(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Movements typically shouldn't be fully updated to preserve audit trail, but allowing concept edit
  update(id: string, data: any) {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  // Reverse instead of delete
  reverse(id: string, reason: string) {
    return this.http.post<any>(`${this.apiUrl}/${id}/reverse`, { reason });
  }
}

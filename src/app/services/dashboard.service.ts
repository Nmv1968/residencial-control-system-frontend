import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;

  getSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getIncomeExpensesHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/history`);
  }

  getOccupancyStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/occupancy`);
  }

  getRecentActivity(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/activity`);
  }
}

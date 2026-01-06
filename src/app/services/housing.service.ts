import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private apiUrl = 'http://localhost:3000/api/v1/units';
  private http = inject(HttpClient);

  findAll() {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((units) =>
        units.map((u) => ({
          ...u,
          number: u.nombre,
          balance: u.saldoActual,
          type: u.tipo,
          monthlyFee: u.tarifaMensual,
          owner: u.propietario,
        }))
      )
    );
  }

  findOne(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((u) => ({
        ...u,
        number: u.nombre,
        balance: u.saldoActual,
        type: u.tipo,
        monthlyFee: u.tarifaMensual,
        owner: u.propietario,
      }))
    );
  }

  create(data: any) {
    // Adapter: Map Frontend fields to Backend DTO
    const payload = {
      nombre: data.number, // Form field 'number' -> DTO 'nombre'
      tipo: data.type || 'CASA', // Form field 'type' -> DTO 'tipo'
      tarifaMensual: data.monthlyFee || 0, // Form field 'monthlyFee' -> DTO 'tarifaMensual'
      saldoActual: data.balance,
      propietario: data.owner || '',
    };
    return this.http.post<any>(this.apiUrl, payload);
  }

  update(id: string, data: any) {
    // Adapter
    const payload = {
      nombre: data.number,
      tipo: data.type,
      tarifaMensual: data.monthlyFee,
      saldoActual: data.balance,
      propietario: data.owner,
    };
    // Clean undefined
    Object.keys(payload).forEach(
      (key) =>
        (payload as any)[key] === undefined && delete (payload as any)[key]
    );

    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

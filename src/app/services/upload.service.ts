import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

// Definimos la interfaz de respuesta para tener autocompletado
export interface UploadResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  // Usamos la variable de entorno para que sea dinámico
  private apiUrl = `${environment.apiUrl}/upload`;

  private http = inject(HttpClient);

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // Ahora el IDE sabrá que la respuesta trae una 'url'
    return this.http.post<UploadResponse>(this.apiUrl, formData);
  }
}

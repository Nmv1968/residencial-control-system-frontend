import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'http://localhost:3000/api/v1/upload';
  private http = inject(HttpClient);

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(this.apiUrl, formData);
  }
}

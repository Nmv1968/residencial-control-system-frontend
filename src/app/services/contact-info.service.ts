import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactInfo {
  _id?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  additionalData?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactInfoService {
  private apiUrl = `${environment.apiUrl}/contact-info`;

  constructor(private http: HttpClient) {}

  getContactInfo(): Observable<ContactInfo> {
    return this.http.get<ContactInfo>(this.apiUrl);
  }

  updateContactInfo(data: Partial<ContactInfo>): Observable<ContactInfo> {
    return this.http.post<ContactInfo>(this.apiUrl, data);
  }
}

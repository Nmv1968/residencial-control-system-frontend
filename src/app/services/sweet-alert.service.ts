import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  constructor() {}

  success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#3b82f6', // Tailwind blue-500
      timer: 2000,
      timerProgressBar: true,
    });
  }

  error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#ef4444', // Tailwind red-500
    });
  }

  async confirm(
    title: string,
    text: string,
    confirmButtonText: string = 'Sí, confirmar'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    return result.isConfirmed;
  }
}

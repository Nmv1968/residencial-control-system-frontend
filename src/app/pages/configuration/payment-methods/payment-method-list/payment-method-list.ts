import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentMethodsService } from '../../../../services/payment-methods.service';
import { PaymentMethod } from '../../../../schemas/financial.schemas';
import { SweetAlertService } from '../../../../services/sweet-alert.service';

@Component({
  selector: 'app-payment-method-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-method-list.html',
  styleUrls: ['./payment-method-list.css'],
})
export class PaymentMethodListComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  paymentMethodsService = inject(PaymentMethodsService);

  private sweetAlert = inject(SweetAlertService); // [NEW]

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.paymentMethodsService.findAll().subscribe({
      next: (data) => {
        this.paymentMethods = data;
      },
      error: () => {
        this.sweetAlert.error(
          'Error',
          'No se pudieron cargar los métodos de pago.'
        );
      },
    });
  }

  toggleActive(method: PaymentMethod) {
    // Optional: Toggle active status directly logic
  }

  async deletePaymentMethod(id: string) {
    const confirmed = await this.sweetAlert.confirm(
      '¿Desactivar método?',
      'Esta acción puede afectar pagos históricos.',
      'Sí, desactivar'
    );

    if (confirmed) {
      this.paymentMethodsService.remove(id).subscribe({
        next: () => {
          this.sweetAlert.success(
            'Eliminado',
            'Método de pago eliminado/desactivado.'
          );
          this.loadPaymentMethods();
        },
        error: () => {
          this.sweetAlert.error(
            'Error',
            'No se pudo eliminar el método de pago.'
          );
        },
      });
    }
  }
}

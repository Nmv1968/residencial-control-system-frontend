import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaymentMethodsService } from '../../../../services/payment-methods.service';
import { PaymentMethod } from '../../../../schemas/financial.schemas';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { TableSkeletonComponent } from '../../../../components/common/table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-payment-method-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TableSkeletonComponent,
  ],
  templateUrl: './payment-method-list.html',
  styleUrls: ['./payment-method-list.css'],
})
export class PaymentMethodListComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  isLoading = false;
  paymentMethodsService = inject(PaymentMethodsService);

  private sweetAlert = inject(SweetAlertService); // [NEW]

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.isLoading = true;
    this.paymentMethodsService.findAll().subscribe({
      next: (data) => {
        this.paymentMethods = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.sweetAlert.error(
          'Error',
          'No se pudieron cargar las formas de pago.',
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
      'Sí, desactivar',
    );

    if (confirmed) {
      this.paymentMethodsService.remove(id).subscribe({
        next: () => {
          this.sweetAlert.success(
            'Eliminado',
            'Método de pago eliminado/desactivado.',
          );
          this.loadPaymentMethods();
        },
        error: () => {
          this.sweetAlert.error(
            'Error',
            'No se pudo eliminar el método de pago.',
          );
        },
      });
    }
  }
}

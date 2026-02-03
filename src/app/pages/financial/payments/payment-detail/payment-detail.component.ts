import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentsService } from '../../../../services/payments.service';
import { AuthService } from '../../../../auth/auth.service';
import { Payment } from '../../../../schemas/financial.schemas';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './payment-detail.component.html',
})
export class PaymentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentsService = inject(PaymentsService);
  authService = inject(AuthService);

  payment: Payment | null = null;
  loading = true;

  get backRoute(): string {
    // Si no está autenticado y hay un payment con unidad, volver a detalle de vivienda
    if (!this.authService.isAuthenticated() && this.payment?.unit) {
      const unitId =
        typeof this.payment.unit === 'string'
          ? this.payment.unit
          : this.payment.unit._id;
      return `/housing/${unitId}`;
    }
    // Si está autenticado, volver al listado de payments
    return '/financial/payments';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.loadPayment(id);
    });
  }

  loadPayment(id: string) {
    this.loading = true;
    this.paymentsService.findOne(id).subscribe({
      next: (data) => {
        this.payment = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openProof(url: string | undefined) {
    if (url) window.open(url, '_blank');
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PaymentMethodsService } from '../../../services/payment-methods.service';
import { PaymentMethod } from '../../../schemas/financial.schemas';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-payment-info',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css'],
})
export class PaymentInfoComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  loading = true;

  private paymentMethodsService = inject(PaymentMethodsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Redirect authenticated users to configuration
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/configuration/payment-methods']);
      return;
    }

    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.loading = true;
    this.paymentMethodsService.getActiveForPublic().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading payment methods:', err);
        this.loading = false;
      },
    });
  }

  getPaymentIcon(method: PaymentMethod): string {
    if (method.isBank) {
      return 'account_balance';
    }
    return 'payments';
  }

  getAccountTypeLabel(type: string): string {
    return type === 'SAVINGS' ? 'Ahorros' : 'Corriente';
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaymentsService } from '../../../../services/payments.service';
import { Payment } from '../../../../schemas/financial.schemas';
import { TableSkeletonComponent } from '../../../../components/common/table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    TableSkeletonComponent,
  ],
  templateUrl: './payment-list.component.html',
})
export class PaymentListComponent implements OnInit {
  private paymentsService = inject(PaymentsService);
  payments: Payment[] = [];
  isLoading = false;
  displayedColumns: string[] = ['date', 'unit', 'method', 'amount', 'actions'];

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.isLoading = true;
    this.paymentsService.findAll().subscribe((data) => {
      this.payments = data.sort(
        (a, b) =>
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
      );
      this.isLoading = false;
    });
  }

  getUnitNumber(payment: Payment): string {
    return (
      (payment.unit as any)?.number ||
      (payment.snapshotData as any)?.unitNumber ||
      'N/A'
    );
  }
}

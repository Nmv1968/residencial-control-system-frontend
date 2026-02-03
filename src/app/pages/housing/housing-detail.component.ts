import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { HousingService } from '../../services/housing.service';
import { DebtsService } from '../../services/debts.service';
import { PaymentsService } from '../../services/payments.service';
import { AuthService } from '../../auth/auth.service';
import { Unit, Debt, Payment } from '../../schemas/financial.schemas';

@Component({
  selector: 'app-housing-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
  ],
  templateUrl: './housing-detail.component.html',
})
export class HousingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private housingService = inject(HousingService);
  private debtsService = inject(DebtsService);
  private paymentsService = inject(PaymentsService);
  authService = inject(AuthService);

  unit: Unit | null = null;
  pendingDebts: Debt[] = [];
  paidDebts: Debt[] = [];
  payments: Payment[] = [];

  loading = true;

  displayedColumnsDebts: string[] = ['date', 'concept', 'amount', 'dueDate'];
  displayedColumnsPaidDebts: string[] = ['date', 'concept', 'amount', 'status'];
  displayedColumnsPayments: string[] = ['date', 'method', 'amount', 'actions'];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(id);
    }
  }

  loadData(id: string) {
    this.loading = true;
    this.housingService.findOne(id).subscribe({
      next: (unitData) => {
        this.unit = unitData;
        this.loadFinancials(id);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  loadFinancials(unitId: string) {
    // Load Debts (split into Pending/Paid usually by status filters or frontend filtering)
    this.debtsService.findAllByUnit(unitId).subscribe((debts) => {
      this.pendingDebts = debts
        .filter((d) => d.status === 'PENDING')
        .sort(
          (a, b) =>
            new Date(a.dueDate || 0).getTime() -
            new Date(b.dueDate || 0).getTime(),
        );
      this.paidDebts = debts
        .filter((d) => d.status === 'PAID' || d.status === 'CANCELLED')
        .sort(
          (a, b) =>
            new Date(b.generationDate).getTime() -
            new Date(a.generationDate).getTime(),
        );

      // Load Payments
      this.paymentsService.findAllByUnit(unitId).subscribe((payments) => {
        this.payments = payments.sort(
          (a, b) =>
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime(),
        );
        this.loading = false;
      });
    });
  }
}

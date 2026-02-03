import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DebtsService } from '../../../services/debts.service';
import { HousingService } from '../../../services/housing.service';
import { MovementsService } from '../../../services/movements.service';
import { Unit, FinancialMovement } from '../../../schemas/financial.schemas';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { DebtListComponent } from '../debts/debt-list/debt-list.component';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-initial-balance',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatTabsModule,
    DebtListComponent,
  ],
  templateUrl: './initial-balance.html',
})
export class InitialBalanceComponent implements OnInit {
  fb = inject(FormBuilder);
  debtsService = inject(DebtsService);
  housingService = inject(HousingService); // Using HousingService (Refactored) to get units
  movementsService = inject(MovementsService); // [NEW] injected

  private sweetAlert = inject(SweetAlertService); // [NEW]

  @ViewChild(DebtListComponent) debtListComponent!: DebtListComponent;

  form: FormGroup;
  units: Unit[] = [];
  loading = false;

  constructor() {
    this.form = this.fb.group({
      unitId: [null, Validators.required],
      type: ['DEBT', Validators.required], // DEBT | CREDIT
      amount: [0, [Validators.required, Validators.min(0.01)]],
      observation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits() {
    this.housingService.findAll(1, 1000).subscribe((response) => {
      this.units = response.data;
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const { unitId, type, amount, observation } = this.form.value;

    if (type === 'DEBT') {
      // 1. Existing Logic: Create a Pending Debt
      const concept = `Saldo Inicial (Deuda): ${observation}`;
      const payload = {
        unitId,
        amount: amount,
        concept,
      };

      this.debtsService.create(payload).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
    } else {
      // 2. New Logic: Create an Income Transaction (Credit/Advance)
      // This updates balance (decreases debt/increases credit) but prevents a "Pending Debt" record.
      const concept = `Saldo Inicial (A favor): ${observation}`;

      const payload: Partial<FinancialMovement> = {
        type: 'Income', // Maps to PAGO in backend
        concept,
        amount: Number(amount),
        date: new Date(), // Current date
        housingId: unitId,
        evidenceUrl: '', // Optional
        // provider is not needed for Income
      };

      this.movementsService.create(payload).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
    }
  }

  private handleSuccess() {
    this.loading = false;
    this.sweetAlert.success(
      'Totalmente registrado',
      'Saldo inicial registrado exitosamente.',
    );
    this.form.reset({ type: 'DEBT', amount: 0 });
  }

  private handleError(err: any) {
    this.loading = false;
    this.sweetAlert.error('Error', 'Error al registrar saldo.');
    console.error(err);
  }

  onTabChange(event: MatTabChangeEvent) {
    // When switching to "Historial de Saldos" tab (index 1), refresh the data
    if (event.index === 1 && this.debtListComponent) {
      this.debtListComponent.loadDebts();
    }
  }
}

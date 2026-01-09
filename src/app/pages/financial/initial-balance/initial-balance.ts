import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DebtsService } from '../../../services/debts.service';
import { HousingService } from '../../../services/housing.service';
import { Unit } from '../../../schemas/financial.schemas';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTabsModule } from '@angular/material/tabs';
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

  private sweetAlert = inject(SweetAlertService); // [NEW]

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

    // Logic: DEBT -> Positive Amount (Debt). CREDIT -> Negative Amount (Credit/Advance).
    const finalAmount = type === 'DEBT' ? amount : -amount;
    const concept = `Saldo Inicial (${
      type === 'DEBT' ? 'Deuda' : 'A favor'
    }): ${observation}`;

    const payload = {
      unitId,
      amount: finalAmount,
      concept,
      // Status will optionally be defaulted to PENDING by backend Schema default
    };

    this.debtsService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.sweetAlert.success(
          'Totalmente registrado',
          'Saldo inicial registrado exitosamente.'
        );
        this.form.reset({ type: 'DEBT', amount: 0 });
      },
      error: (err) => {
        this.loading = false;
        this.sweetAlert.error('Error', 'Error al registrar saldo.');
        console.error(err);
      },
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HousingService } from '../../../services/housing.service';
import { DebtsService } from '../../../services/debts.service';
import { PaymentsService } from '../../../services/payments.service';
import { PaymentMethodsService } from '../../../services/payment-methods.service';
import { Unit, Debt, PaymentMethod } from '../../../schemas/financial.schemas';
import { NgSelectModule } from '@ng-select/ng-select';
import { UploadService } from '../../../services/upload.service';
import { MatTabsModule } from '@angular/material/tabs';
import { PaymentListComponent } from '../payments/payment-list/payment-list.component';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-payment-process',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatTabsModule,
    PaymentListComponent,
  ],
  templateUrl: './payment-process.html',
})
export class PaymentProcessComponent implements OnInit {
  private fb = inject(FormBuilder);
  private housingService = inject(HousingService);
  private debtsService = inject(DebtsService);
  private paymentsService = inject(PaymentsService);
  private paymentMethodsService = inject(PaymentMethodsService);
  private uploadService = inject(UploadService);
  private sweetAlert = inject(SweetAlertService); // [NEW]

  step = 1;
  searchForm: FormGroup;
  paymentForm: FormGroup;

  units: Unit[] = [];
  selectedUnit: Unit | null = null;
  pendingDebts: Debt[] = [];
  paymentMethods: PaymentMethod[] = [];

  selectedDebts = new Set<string>();
  totalSelected = 0;

  loading = false;

  constructor() {
    this.searchForm = this.fb.group({
      unitId: [null, Validators.required],
    });

    this.paymentForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      paymentMethodId: [null, Validators.required],
      paymentDate: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      observation: [''],
      proofUrl: [''],
    });
  }

  ngOnInit() {
    this.loadUnits();
    this.loadPaymentMethods();
  }

  loadUnits() {
    this.housingService
      .findAll(1, 1000)
      .subscribe((data) => (this.units = data.data));
  }

  loadPaymentMethods() {
    this.paymentMethodsService
      .findAll()
      .subscribe(
        (data) => (this.paymentMethods = data.filter((m) => m.isActive))
      );
  }

  onUnitSelect() {
    const unitId = this.searchForm.get('unitId')?.value;
    if (!unitId) return;

    this.loading = true;
    this.housingService.findOne(unitId).subscribe((unit) => {
      this.selectedUnit = unit;
      this.debtsService.findAllByUnit(unitId).subscribe((debts) => {
        this.pendingDebts = debts.filter((d) => d.status === 'PENDING');
        this.selectedDebts.clear();
        this.updateTotal();
        this.loading = false;
        this.step = 2;
      });
    });
  }

  toggleDebt(debt: Debt) {
    if (this.selectedDebts.has(debt._id)) {
      this.selectedDebts.delete(debt._id);
    } else {
      this.selectedDebts.add(debt._id);
    }
    this.updateTotal();
  }

  updateTotal() {
    this.totalSelected = this.pendingDebts
      .filter((d) => this.selectedDebts.has(d._id))
      .reduce((sum, d) => sum + d.amount, 0);

    this.paymentForm
      .get('amount')
      ?.setValue(this.totalSelected > 0 ? this.totalSelected : 0);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.sweetAlert.error(
          'Error',
          'El archivo es demasiado grande (Máx 5MB)'
        );
        return;
      }

      this.loading = true;
      this.uploadService.uploadFile(file).subscribe({
        next: (res) => {
          this.paymentForm.patchValue({ proofUrl: res.url });
          this.loading = false;
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.loading = false;
          this.sweetAlert.error('Error', 'Error al subir el archivo');
        },
      });
    }
  }

  onSubmit() {
    if (this.paymentForm.invalid) return;

    this.loading = true;
    const formVal = this.paymentForm.value;

    // Convert Set to Array
    const debtIdsArray = Array.from(this.selectedDebts);

    const payload = {
      unitId: this.selectedUnit?._id,
      totalAmount: formVal.amount,
      paymentMethodId: formVal.paymentMethodId,
      paymentDate: formVal.paymentDate,
      observation: formVal.observation,
      proofUrl: formVal.proofUrl,
      debtIds: debtIdsArray,
    };

    this.paymentsService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.sweetAlert.success(
          'Pago Registrado',
          'Pago registrado exitosamente.'
        );
        this.step = 1;
        this.selectedUnit = null;
        this.searchForm.reset();
        this.paymentForm.reset({
          paymentDate: new Date().toISOString().split('T')[0],
        });
        this.selectedDebts.clear();
      },
      error: (err) => {
        this.loading = false;
        this.sweetAlert.error('Error', 'Error al registrar pago.');
        console.error(err);
      },
    });
  }

  back() {
    this.step = 1;
    this.selectedUnit = null;
    this.selectedDebts.clear();
  }
}

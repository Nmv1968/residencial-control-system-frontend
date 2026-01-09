import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentMethodsService } from '../../../../services/payment-methods.service';
import { PaymentMethod } from '../../../../schemas/financial.schemas';
import { SweetAlertService } from '../../../../services/sweet-alert.service';

@Component({
  selector: 'app-payment-method-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment-method-form.html',
  styleUrls: ['./payment-method-form.css'],
})
export class PaymentMethodFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  methodId: string | null = null;

  private fb = inject(FormBuilder);
  private paymentMethodsService = inject(PaymentMethodsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private sweetAlert = inject(SweetAlertService); // [NEW]

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.methodId = id;
      this.loadPaymentMethod(id);
    }
  }

  loadPaymentMethod(id: string) {
    this.paymentMethodsService.findOne(id).subscribe({
      next: (method) => {
        this.form.patchValue({
          name: method.name,
          isActive: method.isActive,
        });
      },
      error: () => {
        this.sweetAlert.error('Error', 'No se pudo cargar el método de pago.');
        this.router.navigate(['/configuration/payment-methods']);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const data: Partial<PaymentMethod> = this.form.value;

    const request =
      this.isEditMode && this.methodId
        ? this.paymentMethodsService.update(this.methodId, data)
        : this.paymentMethodsService.create(data);

    request.subscribe({
      next: () => {
        this.sweetAlert.success(
          'Éxito',
          `Método de pago ${
            this.isEditMode ? 'actualizado' : 'creado'
          } correctamente.`
        );
        this.router.navigate(['/configuration/payment-methods']);
      },
      error: (err) => {
        console.error(err);
        this.sweetAlert.error('Error', 'No se pudo guardar el método de pago.');
      },
    });
  }
}

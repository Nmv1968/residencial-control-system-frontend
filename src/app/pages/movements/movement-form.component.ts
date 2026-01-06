import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovementsService } from '../../services/movements.service';
import { HousingService } from '../../services/housing.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    NgSelectModule,
  ],
  template: `
    <div class="container mx-auto p-6 max-w-2xl">
      <div class="mb-6 flex items-center gap-2 text-gray-600">
        <a routerLink="/movements" mat-icon-button
          ><mat-icon>arrow_back</mat-icon></a
        >
        <h1 class="text-2xl font-bold text-gray-800">Registrar Movimiento</h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-6"
        >
          <!-- Type Select -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Tipo</label>
            <ng-select
              formControlName="type"
              [items]="typeOptions"
              bindLabel="label"
              bindValue="value"
              placeholder="Seleccione Tipo"
              [clearable]="false"
              appendTo="body"
              class="custom-ng-select"
            >
            </ng-select>
          </div>

          <!-- Date Input -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Fecha</label>
            <input
              type="date"
              formControlName="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              [class.border-red-500]="
                form.get('date')?.invalid && form.get('date')?.touched
              "
            />
          </div>

          <!-- Concept Input -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Concepto</label>
            <input
              type="text"
              formControlName="concept"
              placeholder="Ej. Pago Mantenimiento"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
              [class.border-red-500]="
                form.get('concept')?.invalid && form.get('concept')?.touched
              "
            />
            <span
              *ngIf="
                form.get('concept')?.hasError('required') &&
                form.get('concept')?.touched
              "
              class="text-xs text-red-500"
            >
              El concepto es requerido
            </span>
          </div>

          <!-- Amount Input -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Monto</label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500">$</span>
              </div>
              <input
                type="number"
                formControlName="amount"
                class="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                [class.border-red-500]="
                  form.get('amount')?.invalid && form.get('amount')?.touched
                "
              />
            </div>
            <span
              *ngIf="form.get('amount')?.invalid && form.get('amount')?.touched"
              class="text-xs text-red-500"
            >
              Monto inválido
            </span>
          </div>

          <!-- Housing Select -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700"
              >Vivienda (Opcional)</label
            >
            <ng-select
              formControlName="housingId"
              [items]="housingList"
              bindLabel="number"
              bindValue="_id"
              placeholder="-- Ninguna --"
              appendTo="body"
              class="custom-ng-select"
            >
            </ng-select>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <a
              routerLink="/movements"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </a>
            <button
              type="submit"
              [disabled]="form.invalid || loading"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class MovementFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movementsService = inject(MovementsService);
  private housingService = inject(HousingService);
  private router = inject(Router);

  housingList: any[] = [];
  loading = false;

  typeOptions = [
    { label: 'Ingreso', value: 'Income' },
    { label: 'Egreso', value: 'Expense' },
  ];

  form: FormGroup = this.fb.group({
    type: ['Income', Validators.required],
    concept: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: [this.formatDate(new Date()), Validators.required],
    housingId: [null],
  });

  ngOnInit() {
    this.housingService
      .findAll()
      .subscribe((data) => (this.housingList = data));
  }

  // Helper to format date for input[type="date"]
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const formData = {
        ...this.form.value,
        date: new Date(this.form.value.date), // Ensure it's sent as Date object
      };

      this.movementsService.create(formData).subscribe({
        next: () => {
          this.router.navigate(['/movements']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }
}

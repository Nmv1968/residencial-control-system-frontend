import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { PeriodsService } from '../../services/periods.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-period-form',
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
        <a routerLink="/periods" mat-icon-button
          ><mat-icon>arrow_back</mat-icon></a
        >
        <h1 class="text-2xl font-bold text-gray-800">Abrir Nuevo Periodo</h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Year Input -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Año</label>
              <input
                type="number"
                formControlName="year"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                [class.border-red-500]="
                  form.get('year')?.invalid && form.get('year')?.touched
                "
              />
              <span
                *ngIf="
                  form.get('year')?.hasError('required') &&
                  form.get('year')?.touched
                "
                class="text-xs text-red-500"
              >
                El año es requerido
              </span>
              <span
                *ngIf="
                  form.get('year')?.hasError('min') && form.get('year')?.touched
                "
                class="text-xs text-red-500"
              >
                El año debe ser mayor o igual a 2023
              </span>
            </div>

            <!-- Month Select -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Mes</label>
              <ng-select
                formControlName="month"
                [items]="months"
                bindLabel="label"
                bindValue="value"
                placeholder="Seleccione Mes"
                [clearable]="false"
                appendTo="body"
                class="custom-ng-select"
              >
              </ng-select>
              <span
                *ngIf="
                  form.get('month')?.hasError('required') &&
                  form.get('month')?.touched
                "
                class="text-xs text-red-500"
              >
                El mes es requerido
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <a
              routerLink="/periods"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </a>
            <button
              type="submit"
              [disabled]="form.invalid || loading"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Guardando...' : 'Abrir Periodo' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class PeriodFormComponent {
  private fb = inject(FormBuilder);
  private periodsService = inject(PeriodsService);
  private router = inject(Router);

  loading = false;

  months = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 },
  ];

  form: FormGroup = this.fb.group({
    year: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(2023)],
    ],
    month: [
      new Date().getMonth() + 1,
      [Validators.required, Validators.min(1), Validators.max(12)],
    ],
    status: ['Open', Validators.required],
  });

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.periodsService.create(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/periods']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }
}

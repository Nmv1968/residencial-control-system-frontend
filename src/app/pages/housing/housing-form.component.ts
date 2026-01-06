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
import { HousingService } from '../../services/housing.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-housing-form',
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
        <a routerLink="/housing" mat-icon-button
          ><mat-icon>arrow_back</mat-icon></a
        >
        <h1 class="text-2xl font-bold text-gray-800">
          {{ isEditing ? 'Editar Vivienda' : 'Nueva Vivienda' }}
        </h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Number Input -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700"
                >Número de Unidad</label
              >
              <input
                type="text"
                formControlName="number"
                placeholder="Ej. A-101"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                [class.border-red-500]="
                  form.get('number')?.invalid && form.get('number')?.touched
                "
              />
              <span
                *ngIf="
                  form.get('number')?.hasError('required') &&
                  form.get('number')?.touched
                "
                class="text-xs text-red-500"
              >
                Este campo es requerido
              </span>
            </div>

            <!-- Status Select -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-gray-700">Estado</label>
              <div class="relative">
                <ng-select
                  formControlName="status"
                  [items]="statusOptions"
                  bindLabel="label"
                  bindValue="value"
                  placeholder="Seleccione Estado"
                  [clearable]="false"
                  appendTo="body"
                  class="custom-ng-select"
                >
                </ng-select>
              </div>
            </div>
          </div>

          <!-- Balance Input -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700"
              >Saldo Actual</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500">$</span>
              </div>
              <input
                type="number"
                formControlName="balance"
                class="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                [class.border-red-500]="
                  form.get('balance')?.invalid && form.get('balance')?.touched
                "
              />
            </div>
            <span
              *ngIf="
                form.get('balance')?.invalid && form.get('balance')?.touched
              "
              class="text-xs text-red-500"
            >
              Saldo inválido
            </span>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <a
              routerLink="/housing"
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
export class HousingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private housingService = inject(HousingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    number: ['', Validators.required],
    status: ['Occupied', Validators.required],
    balance: [0, [Validators.required, Validators.min(0)]],
  });

  isEditing = false;
  housingId: string | null = null;
  loading = false;

  statusOptions = [
    { label: 'Ocupado', value: 'Occupied' },
    { label: 'Vacío', value: 'Empty' },
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.housingId = params.get('id');
      if (this.housingId) {
        this.isEditing = true;
        this.loadHousing(this.housingId);
      }
    });
  }

  loadHousing(id: string) {
    this.loading = true;
    this.housingService.findOne(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/housing']);
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;

      const request =
        this.isEditing && this.housingId
          ? this.housingService.update(this.housingId, data)
          : this.housingService.create(data);

      request.subscribe({
        next: () => {
          this.router.navigate(['/housing']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }
}

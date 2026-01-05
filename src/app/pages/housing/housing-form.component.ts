import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HousingService } from '../../services/housing.service';

@Component({
  selector: 'app-housing-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
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

      <mat-card>
        <mat-card-content class="p-6">
          <form
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            class="flex flex-col gap-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Número de Unidad</mat-label>
                <input
                  matInput
                  formControlName="number"
                  placeholder="Ej. A-101"
                />
                <mat-error *ngIf="form.get('number')?.hasError('required')"
                  >Requerido</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Estado</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="Occupied">Ocupado</mat-option>
                  <mat-option value="Empty">Vacío</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Saldo Actual</mat-label>
              <input matInput type="number" formControlName="balance" />
              <span matPrefix>$&nbsp;</span>
              <mat-error *ngIf="form.get('balance')?.hasError('required')"
                >Requerido</mat-error
              >
              <mat-error *ngIf="form.get('balance')?.hasError('min')"
                >No puede ser negativo</mat-error
              >
            </mat-form-field>

            <div class="flex justify-end gap-2 mt-4">
              <a mat-button routerLink="/housing" color="warn">Cancelar</a>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="form.invalid || loading"
              >
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
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

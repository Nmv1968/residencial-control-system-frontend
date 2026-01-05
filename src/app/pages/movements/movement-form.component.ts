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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovementsService } from '../../services/movements.service';
import { HousingService } from '../../services/housing.service';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  template: `
    <div class="container mx-auto p-6 max-w-2xl">
      <div class="mb-6 flex items-center gap-2 text-gray-600">
        <a routerLink="/movements" mat-icon-button
          ><mat-icon>arrow_back</mat-icon></a
        >
        <h1 class="text-2xl font-bold text-gray-800">Registrar Movimiento</h1>
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
                <mat-label>Tipo</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="Income">Ingreso</mat-option>
                  <mat-option value="Expense">Egreso</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Fecha</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  formControlName="date"
                />
                <mat-datepicker-toggle
                  matIconSuffix
                  [for]="picker"
                ></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Concepto</mat-label>
              <input
                matInput
                formControlName="concept"
                placeholder="Ej. Pago Mantenimiento"
              />
              <mat-error *ngIf="form.get('concept')?.hasError('required')"
                >Requerido</mat-error
              >
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Monto</mat-label>
              <input matInput type="number" formControlName="amount" />
              <span matPrefix>$&nbsp;</span>
              <mat-error *ngIf="form.get('amount')?.hasError('required')"
                >Requerido</mat-error
              >
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Vivienda (Opcional)</mat-label>
              <mat-select formControlName="housingId">
                <mat-option [value]="null">-- Ninguna --</mat-option>
                <mat-option
                  *ngFor="let house of housingList"
                  [value]="house._id"
                  >{{ house.number }}</mat-option
                >
              </mat-select>
            </mat-form-field>

            <div class="flex justify-end gap-2 mt-4">
              <a mat-button routerLink="/movements" color="warn">Cancelar</a>
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
export class MovementFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movementsService = inject(MovementsService);
  private housingService = inject(HousingService);
  private router = inject(Router);

  housingList: any[] = [];
  loading = false;

  form: FormGroup = this.fb.group({
    type: ['Income', Validators.required],
    concept: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: [new Date(), Validators.required],
    housingId: [null],
  });

  ngOnInit() {
    this.housingService
      .findAll()
      .subscribe((data) => (this.housingList = data));
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.movementsService.create(this.form.value).subscribe({
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

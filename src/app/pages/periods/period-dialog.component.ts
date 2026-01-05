import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-period-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Abrir Nuevo Periodo</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="flex flex-col gap-4 min-w-[300px]">
          <mat-form-field appearance="outline">
            <mat-label>Año</mat-label>
            <input matInput type="number" formControlName="year" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Mes</mat-label>
            <mat-select formControlName="month">
              @for (m of months; track m) {
              <mat-option [value]="m">{{ m }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          Abrir Periodo
        </button>
      </mat-dialog-actions>
    </form>
  `,
})
export class PeriodDialogComponent {
  private fb = inject(FormBuilder);
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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

  constructor(
    public dialogRef: MatDialogRef<PeriodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

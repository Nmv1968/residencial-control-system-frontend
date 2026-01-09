import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DebtsService } from '../../../services/debts.service';
import { CategoriesService } from '../../../services/categories.service';
import { HousingService } from '../../../services/housing.service';
import { Category, Unit } from '../../../schemas/financial.schemas';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-debt-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './debt-wizard.html',
})
export class DebtWizardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private debtsService = inject(DebtsService);
  private categoriesService = inject(CategoriesService);
  private housingService = inject(HousingService);

  step = 1;
  form: FormGroup;
  categories: Category[] = [];
  units: Unit[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.form = this.fb.group({
      scope: ['ALL', Validators.required], // ALL | CATEGORY | SINGLE
      targetId: [null], // Category ID or Unit ID
      amount: [50, [Validators.required, Validators.min(0.01)]],
      concept: ['Expensas Mes Actual', Validators.required],
      dueDate: [new Date().toISOString().split('T')[0]], // Default today
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadUnits();
  }

  loadCategories() {
    this.categoriesService
      .findAll()
      .subscribe((data) => (this.categories = data));
  }

  loadUnits() {
    this.housingService
      .findAll(1, 1000)
      .subscribe((data) => (this.units = data.data));
  }

  get scope() {
    return this.form.get('scope')?.value;
  }

  nextStep() {
    if (this.step === 1) {
      // Validate Scope
      if (
        (this.scope === 'CATEGORY' || this.scope === 'SINGLE') &&
        !this.form.get('targetId')?.value
      ) {
        alert('Seleccione un objetivo válido.');
        return;
      }
    } else if (this.step === 2) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
    }
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  getSelectedTargetName(): string {
    const id = this.form.get('targetId')?.value;
    if (this.scope === 'ALL') return 'Todas las Viviendas';
    if (this.scope === 'CATEGORY') {
      return this.categories.find((c) => c._id === id)?.name || 'Categoría';
    }
    if (this.scope === 'SINGLE') {
      return this.units.find((u) => u._id === id)?.number || 'Vivienda';
    }
    return '-';
  }

  estimatedCount(): number {
    if (this.scope === 'ALL') return this.units.length; // Approximate, backend filters by OCCUPIED
    if (this.scope === 'CATEGORY')
      return this.units.filter(
        (u) =>
          u.category &&
          (u.category._id === this.form.get('targetId')?.value ||
            (u.category as any) === this.form.get('targetId')?.value)
      ).length; // Rough estimate
    if (this.scope === 'SINGLE') return 1;
    return 0;
  }

  generate() {
    this.loading = true;
    this.debtsService.generateBulk(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = `Proceso completado. ${res.message}`;
        this.step = 1;
        this.form.reset({
          scope: 'ALL',
          amount: 50,
          concept: 'Expensas Mes Actual',
          dueDate: new Date().toISOString().split('T')[0],
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Ocurrió un error al generar las deudas.';
        console.error(err);
      },
    });
  }
}

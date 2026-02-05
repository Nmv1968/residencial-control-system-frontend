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
import { CategoriesService } from '../../services/categories.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Category } from '../../schemas/financial.schemas';
import { SweetAlertService } from '../../services/sweet-alert.service';

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
  templateUrl: './housing-form.component.html',
})
export class HousingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private housingService = inject(HousingService);
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    number: ['', Validators.required],
    categoryId: [null, Validators.required],
    residentName: [''],
    phone: [''],
  });

  isEditing = false;
  housingId: string | null = null;
  loading = false;
  categories: Category[] = [];

  private sweetAlert = inject(SweetAlertService); // [NEW]

  errorMessage: string | null = null;

  ngOnInit() {
    this.loadCategories();
    this.route.paramMap.subscribe((params) => {
      this.housingId = params.get('id');
      if (this.housingId) {
        this.isEditing = true;
        this.loadHousing(this.housingId);
      }
    });
  }

  loadCategories() {
    this.categoriesService.findAll().subscribe((data) => {
      this.categories = data;
    });
  }

  loadHousing(id: string) {
    this.loading = true;
    this.housingService.findOne(id).subscribe({
      next: (data) => {
        // Backend returns `category` as populated object or ID.
        // If it's an object, we need its _id for the select.
        const patchData = {
          ...data,
          categoryId:
            (data.category as any)?._id ||
            data.category ||
            (data as any).categoryId,
        };
        this.form.patchValue(patchData);
        this.loading = false;
      },
      error: () => {
        this.sweetAlert.error(
          'Error',
          'No se pudo cargar la información de la vivienda.',
        );
        this.router.navigate(['/housing']);
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.errorMessage = null;
      const data = this.form.value;

      const request =
        this.isEditing && this.housingId
          ? this.housingService.update(this.housingId, data)
          : this.housingService.create(data);

      request.subscribe({
        next: () => {
          this.sweetAlert.success(
            'Éxito',
            `La vivienda ha sido ${
              this.isEditing ? 'actualizada' : 'creada'
            } correctamente.`,
          );
          this.router.navigate(['/housing']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;

          if (err.status === 409) {
            // Keep inline error for specific validation
            this.errorMessage =
              'El número de vivienda ya existe. Por favor, verifica.';
            this.sweetAlert.error('Error', 'El número de vivienda ya existe.');
          } else {
            this.errorMessage =
              'Ocurrió un error al guardar. Intenta nuevamente.';
            this.sweetAlert.error(
              'Error',
              'Ocurrió un error inesperado al guardar.',
            );
          }
        },
      });
    }
  }
}

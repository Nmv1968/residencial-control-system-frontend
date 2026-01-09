import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../schemas/financial.schemas';
import { SweetAlertService } from '../../../../services/sweet-alert.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category-form.html',
  styleUrls: ['./category-form.css'],
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;

  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private sweetAlert = inject(SweetAlertService); // [NEW]

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = id;
      this.loadCategory(id);
    }
  }

  loadCategory(id: string) {
    this.categoriesService.findOne(id).subscribe({
      next: (category) => {
        this.form.patchValue({
          name: category.name,
          description: category.description,
        });
      },
      error: () => {
        this.sweetAlert.error('Error', 'No se pudo cargar la categoría.');
        this.router.navigate(['/configuration/categories']);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const categoryData: Partial<Category> = this.form.value;

    const request =
      this.isEditMode && this.categoryId
        ? this.categoriesService.update(this.categoryId, categoryData)
        : this.categoriesService.create(categoryData);

    request.subscribe({
      next: () => {
        this.sweetAlert.success(
          'Éxito',
          `Categoría ${
            this.isEditMode ? 'actualizada' : 'creada'
          } correctamente.`
        );
        this.router.navigate(['/configuration/categories']);
      },
      error: (err) => {
        console.error(err);
        this.sweetAlert.error('Error', 'No se pudo guardar la categoría.');
      },
    });
  }
}

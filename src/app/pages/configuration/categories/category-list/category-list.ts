import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../schemas/financial.schemas';
import { SweetAlertService } from '../../../../services/sweet-alert.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css'],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  categoriesService = inject(CategoriesService);

  private sweetAlert = inject(SweetAlertService); // [NEW]

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService.findAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        this.sweetAlert.error('Error', 'No se pudieron cargar las categorías.');
      },
    });
  }

  async deleteCategory(id: string) {
    const confirmed = await this.sweetAlert.confirm(
      '¿Eliminar categoría?',
      'Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      this.categoriesService.remove(id).subscribe({
        next: () => {
          this.sweetAlert.success('Eliminado', 'Categoría eliminada.');
          this.loadCategories();
        },
        error: () => {
          this.sweetAlert.error('Error', 'No se pudo eliminar la categoría.');
        },
      });
    }
  }
}

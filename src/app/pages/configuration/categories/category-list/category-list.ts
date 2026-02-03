import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../schemas/financial.schemas';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { TableSkeletonComponent } from '../../../../components/common/table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TableSkeletonComponent,
  ],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css'],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  categoriesService = inject(CategoriesService);

  private sweetAlert = inject(SweetAlertService); // [NEW]

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoriesService.findAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.sweetAlert.error('Error', 'No se pudieron cargar las categorías.');
      },
    });
  }

  async deleteCategory(id: string) {
    const confirmed = await this.sweetAlert.confirm(
      '¿Eliminar categoría?',
      'Esta acción no se puede deshacer.',
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

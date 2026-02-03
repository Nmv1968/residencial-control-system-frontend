import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-skeleton.component.html',
  styleUrls: ['./table-skeleton.component.css'],
})
export class TableSkeletonComponent {
  @Input() rows: number = 5;
  @Input() columns: number = 5;

  get rowsArray(): number[] {
    return Array(this.rows).fill(0);
  }

  get columnsArray(): number[] {
    return Array(this.columns).fill(0);
  }
}

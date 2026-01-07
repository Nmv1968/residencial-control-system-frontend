import { Component, Injectable, input, output } from '@angular/core';
import { Subject } from 'rxjs';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import '@angular/localize/init';

@Injectable()
export class PaginatorNavIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Casas por página:`;
  lastPageLabel = $localize`Last page`;
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;
  }
}

@Component({
  selector: 'paginator-nav',
  standalone: true,
  imports: [MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorNavIntl }],
  template: `
    <mat-paginator
      [length]="length()"
      [pageSize]="pageSize()"
      [pageSizeOptions]="pageSizeOptions()"
      [pageIndex]="pageIndex()"
      (page)="handlePageEvent.emit($event)"
      aria-label="Seleccione Página"
    >
    </mat-paginator>
  `,
})
export class PaginatorNavComponent {
  length = input.required<number>();
  pageSize = input.required<number>();
  pageIndex = input.required<number>();
  pageSizeOptions = input<number[]>([5, 10, 25, 100]);

  handlePageEvent = output<any>();
}

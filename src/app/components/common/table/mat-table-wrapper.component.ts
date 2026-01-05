import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'currency' | 'badge' | 'actions';
}

@Component({
  selector: 'app-mat-table-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  template: `
    <div class="mat-elevation-z8 overflow-auto">
      <table mat-table [dataSource]="dataSource" matSort class="w-full">
        @for (col of columns; track col.key) {
        <ng-container [matColumnDef]="col.key">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ col.label }}
          </th>
          <td mat-cell *matCellDef="let element">
            @switch (col.type) { @case ('date') {
            {{ element[col.key] | date }} } @case ('currency') {
            {{ element[col.key] | currency }} } @case ('badge') {
            <mat-chip-option
              [color]="
                element[col.key] === 'Open' ||
                element[col.key] === 'Active' ||
                element[col.key] === 'Occupied'
                  ? 'primary'
                  : 'warn'
              "
              selected
            >
              {{ element[col.key] }}
            </mat-chip-option>
            } @case ('actions') {
            <button
              mat-icon-button
              color="primary"
              (click)="edit.emit(element)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="delete.emit(element)">
              <mat-icon>delete</mat-icon>
            </button>
            } @default { {{ element[col.key] }} } }
          </td>
        </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            No se encontraron datos.
          </td>
        </tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 100]"
        aria-label="Select page of users"
      ></mat-paginator>
    </div>
  `,
})
export class MatTableWrapperComponent implements AfterViewInit, OnChanges {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() isLoading = false; // MatTable handles empty state via *matNoDataRow usually

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
    if (changes['columns']) {
      this.displayedColumns = this.columns.map((c) => c.key);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

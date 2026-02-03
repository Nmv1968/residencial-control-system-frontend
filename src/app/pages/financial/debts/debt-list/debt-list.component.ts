import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DebtsService } from '../../../../services/debts.service';
import { Debt } from '../../../../schemas/financial.schemas';
import { TableSkeletonComponent } from '../../../../components/common/table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-debt-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    TableSkeletonComponent,
  ],
  templateUrl: './debt-list.component.html',
})
export class DebtListComponent implements OnInit {
  private debtsService = inject(DebtsService);
  debts: Debt[] = [];
  isLoading = false;
  displayedColumns: string[] = [
    'date',
    'unit',
    'concept',
    'amount',
    'status',
    'actions',
  ];

  ngOnInit() {
    this.loadDebts();
  }

  loadDebts() {
    this.isLoading = true;
    this.debtsService.findAll().subscribe((data) => {
      this.debts = data.sort(
        (a, b) =>
          new Date(b.generationDate).getTime() -
          new Date(a.generationDate).getTime(),
      );
      this.isLoading = false;
    });
  }

  getUnitNumber(debt: Debt): string {
    return (debt.unit as any)?.number || 'N/A';
  }
}

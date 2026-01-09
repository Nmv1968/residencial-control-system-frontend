import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DebtsService } from '../../../../services/debts.service';
import { Debt } from '../../../../schemas/financial.schemas';

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
  ],
  templateUrl: './debt-list.component.html',
})
export class DebtListComponent implements OnInit {
  private debtsService = inject(DebtsService);
  debts: Debt[] = [];
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
    this.debtsService.findAll().subscribe((data) => {
      this.debts = data.sort(
        (a, b) =>
          new Date(b.generationDate).getTime() -
          new Date(a.generationDate).getTime()
      );
    });
  }

  getUnitNumber(debt: Debt): string {
    return (debt.unit as any)?.number || 'N/A';
  }
}

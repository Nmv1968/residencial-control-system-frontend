import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DebtsService } from '../../../../services/debts.service';
import { Debt } from '../../../../schemas/financial.schemas';

@Component({
  selector: 'app-debt-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './debt-detail.component.html',
})
export class DebtDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private debtsService = inject(DebtsService);

  debt: Debt | null = null;
  loading = true;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.loadDebt(id);
    });
  }

  loadDebt(id: string) {
    this.loading = true;
    this.debtsService.findOne(id).subscribe({
      next: (data) => {
        this.debt = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}

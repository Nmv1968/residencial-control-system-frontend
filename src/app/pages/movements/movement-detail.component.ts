import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovementsService } from '../../services/movements.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-movement-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './movement-detail.component.html',
})
export class MovementDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movementsService = inject(MovementsService);

  movement: any = null;
  loading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movementsService.findOne(id).subscribe({
        next: (data) => {
          this.movement = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }

  isPdf(url: string | undefined): boolean {
    return url ? url.toLowerCase().endsWith('.pdf') : false;
  }

  getFullUrl(path: string | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  }

  protected readonly window = window;
}

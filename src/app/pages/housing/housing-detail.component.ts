import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-housing-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './housing-detail.component.html',
})
export class HousingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private housingService = inject(HousingService);

  unit: any = null;
  loading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.housingService.findOne(id).subscribe({
        next: (data) => {
          this.unit = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }
}

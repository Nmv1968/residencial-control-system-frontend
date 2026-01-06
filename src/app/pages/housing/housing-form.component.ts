import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-housing-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    NgSelectModule,
  ],
  templateUrl: './housing-form.component.html',
})
export class HousingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private housingService = inject(HousingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    number: ['', Validators.required],
    type: ['CASA', Validators.required],
    monthlyFee: [0, [Validators.required, Validators.min(0)]],
    balance: [0, [Validators.required]],
    owner: [''],
  });

  isEditing = false;
  housingId: string | null = null;
  loading = false;

  typeOptions = [
    { label: 'Casa', value: 'CASA' },
    { label: 'Local Comercial', value: 'LOCAL' },
    { label: 'Parqueadero', value: 'PARQUEADERO' },
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.housingId = params.get('id');
      if (this.housingId) {
        this.isEditing = true;
        this.loadHousing(this.housingId);
      }
    });
  }

  loadHousing(id: string) {
    this.loading = true;
    this.housingService.findOne(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/housing']);
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;

      const request =
        this.isEditing && this.housingId
          ? this.housingService.update(this.housingId, data)
          : this.housingService.create(data);

      request.subscribe({
        next: () => {
          this.router.navigate(['/housing']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }
}

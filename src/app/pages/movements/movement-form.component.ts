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
import { MovementsService } from '../../services/movements.service';
import { HousingService } from '../../services/housing.service';
import { UploadService } from '../../services/upload.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    NgSelectModule,
  ],
  templateUrl: './movement-form.component.html',
})
export class MovementFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movementsService = inject(MovementsService);
  private housingService = inject(HousingService);
  private uploadService = inject(UploadService); // Inject UploadService
  private router = inject(Router);

  housingList: any[] = [];
  loading = false;
  uploading = false; // Track upload state

  typeOptions = [
    { label: 'Ingreso', value: 'Income' },
    { label: 'Egreso', value: 'Expense' },
  ];

  form: FormGroup = this.fb.group({
    type: ['Income', Validators.required],
    concept: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: [this.formatDate(new Date()), Validators.required],
    housingId: [null],
    provider: [''],
    evidenceUrl: [''], // Maps to evidenciaUrl (Transaction) or facturaUrl (Expense)
  });

  ngOnInit() {
    this.housingService
      .findAll()
      .subscribe((data) => (this.housingList = data));
  }

  // Helper to format date for input[type="date"]
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploading = true;
      this.uploadService.uploadFile(file).subscribe({
        next: (response) => {
          this.form.patchValue({ evidenceUrl: response.url });
          this.uploading = false;
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.uploading = false;
          // Could add toast notification here
        },
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const formData = {
        ...this.form.value,
        date: new Date(this.form.value.date), // Ensure it's sent as Date object
      };

      this.movementsService.create(formData).subscribe({
        next: () => {
          this.router.navigate(['/movements']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }
}

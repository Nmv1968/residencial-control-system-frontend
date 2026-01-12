import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ContactInfoService } from '../../../services/contact-info.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-info.component.html',
})
export class ContactInfoComponent implements OnInit {
  form: FormGroup;

  private fb = inject(FormBuilder);
  private contactService = inject(ContactInfoService);
  private sweetAlert = inject(SweetAlertService);

  constructor() {
    this.form = this.fb.group({
      fullName: [''],
      phone: [''],
      email: [''],
      additionalData: [''],
    });
  }

  ngOnInit(): void {
    this.loadContactInfo();
  }

  loadContactInfo() {
    this.contactService.getContactInfo().subscribe({
      next: (data) => {
        this.form.patchValue({
          fullName: data.fullName || '',
          phone: data.phone || '',
          email: data.email || '',
          additionalData: data.additionalData || '',
        });
      },
      error: () => {
        this.sweetAlert.error(
          'Error',
          'No se pudo cargar la información de contacto.'
        );
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.contactService.updateContactInfo(this.form.value).subscribe({
      next: () => {
        this.sweetAlert.success(
          'Éxito',
          'Información de contacto actualizada.'
        );
      },
      error: () => {
        this.sweetAlert.error('Error', 'No se pudo guardar la información.');
      },
    });
  }
}

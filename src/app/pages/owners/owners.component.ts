import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OwnersService } from '../../services/owners.service';
import {
  TableComponent,
  Column,
} from '../../components/common/table/table.component';
import { ModalComponent } from '../../components/common/modal/modal.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableComponent, ModalComponent],
  templateUrl: './owners.component.html',
})
export class OwnersComponent implements OnInit {
  private ownersService = inject(OwnersService);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);

  owners = signal<any[]>([]);
  isLoading = signal(false);
  isModalOpen = signal(false);
  isEditing = signal(false);
  currentItemId: string | null = null;

  ownerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    idNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
  });

  columns: Column[] = [
    { key: 'name', label: 'Nombre Completo', type: 'text' },
    { key: 'idNumber', label: 'Cédula', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Teléfono', type: 'text' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.ownersService.findAll().subscribe({
      next: (data) => {
        this.owners.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.currentItemId = null;
    this.ownerForm.reset();
    this.isModalOpen.set(true);
  }

  openEditModal(item: any) {
    this.isEditing.set(true);
    this.currentItemId = item._id;
    this.ownerForm.patchValue({
      name: item.name,
      idNumber: item.idNumber,
      email: item.email,
      phone: item.phone,
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  save() {
    if (this.ownerForm.invalid) return;

    const data = this.ownerForm.value;
    const request =
      this.isEditing() && this.currentItemId
        ? this.ownersService.update(this.currentItemId, data)
        : this.ownersService.create(data);

    request.subscribe({
      next: () => {
        this.loadData();
        this.closeModal();
      },
      error: (err) => console.error('Error saving owner', err),
    });
  }

  delete(item: any) {
    if (confirm('¿Estás seguro de que deseas eliminar este propietario?')) {
      this.ownersService.delete(item._id).subscribe(() => this.loadData());
    }
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryFormComponent } from './categories/category-form/category-form';
import { CategoryListComponent } from './categories/category-list/category-list';
import { PaymentMethodFormComponent } from './payment-methods/payment-method-form/payment-method-form';
import { PaymentMethodListComponent } from './payment-methods/payment-method-list/payment-method-list';
import { ContactInfoComponent } from './contact-info/contact-info.component';

const routes: Routes = [
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'categories/edit/:id', component: CategoryFormComponent },
  { path: 'payment-methods', component: PaymentMethodListComponent },
  { path: 'payment-methods/new', component: PaymentMethodFormComponent },
  { path: 'payment-methods/edit/:id', component: PaymentMethodFormComponent },
  { path: 'contact-info', component: ContactInfoComponent },
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialBalanceComponent } from './initial-balance/initial-balance';
import { DebtWizardComponent } from './debt-wizard/debt-wizard';
import { PaymentProcessComponent } from './payment-process/payment-process';
import { DebtListComponent } from './debts/debt-list/debt-list.component';
import { DebtDetailComponent } from './debts/debt-detail/debt-detail.component';
import { PaymentListComponent } from './payments/payment-list/payment-list.component';
import { PaymentDetailComponent } from './payments/payment-detail/payment-detail.component';

const routes: Routes = [
  { path: 'initial-balance', component: InitialBalanceComponent },
  { path: 'debt-wizard', component: DebtWizardComponent },
  { path: 'debts', component: DebtListComponent },
  { path: 'debts/:id', component: DebtDetailComponent },
  { path: 'payment-process', component: PaymentProcessComponent },
  { path: 'payments', component: PaymentListComponent },
  { path: 'payments/:id', component: PaymentDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialRoutingModule {}

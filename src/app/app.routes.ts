import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HousingComponent } from './pages/housing/housing.component';
import { OwnersComponent } from './pages/owners/owners.component';
import { PeriodsComponent } from './pages/periods/periods.component';
import { MovementsComponent } from './pages/movements/movements.component';
import { AccountStatusComponent } from './pages/account-status/account-status.component';
import { ReportsComponent } from './pages/reports/reports.component';

import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'housing', component: HousingComponent },
      {
        path: 'housing/create',
        loadComponent: () =>
          import('./pages/housing/housing-form.component').then(
            (m) => m.HousingFormComponent
          ),
      },
      {
        path: 'housing/edit/:id',
        loadComponent: () =>
          import('./pages/housing/housing-form.component').then(
            (m) => m.HousingFormComponent
          ),
      },
      { path: 'owners', component: OwnersComponent },
      { path: 'periods', component: PeriodsComponent },
      { path: 'movements', component: MovementsComponent },
      {
        path: 'movements/create',
        loadComponent: () =>
          import('./pages/movements/movement-form.component').then(
            (m) => m.MovementFormComponent
          ),
      },
      { path: 'account-status', component: AccountStatusComponent },
      { path: 'reports', component: ReportsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

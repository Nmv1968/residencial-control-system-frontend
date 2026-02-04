import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HousingComponent } from './pages/housing/housing.component';
import { OwnersComponent } from './pages/owners/owners.component';
import { MovementsComponent } from './pages/movements/movements.component';
import { AccountStatusComponent } from './pages/account-status/account-status.component';
import { ReportsComponent } from './pages/reports/reports.component';

import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Main routes with layout
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // Public routes (no auth required)
      { path: 'dashboard', component: DashboardComponent },
      { path: 'housing', component: HousingComponent },
      { path: 'movements', component: MovementsComponent },
      { path: 'account-status', component: AccountStatusComponent },
      { path: 'reports', component: ReportsComponent },
      {
        path: 'formas-de-pago',
        loadComponent: () =>
          import('./pages/public/payment-info/payment-info.component').then(
            (m) => m.PaymentInfoComponent,
          ),
      },

      // Protected routes (auth required) - specific routes MUST come before :id routes
      {
        path: 'housing/create',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/housing/housing-form.component').then(
            (m) => m.HousingFormComponent,
          ),
      },
      {
        path: 'housing/edit/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/housing/housing-form.component').then(
            (m) => m.HousingFormComponent,
          ),
      },
      {
        path: 'movements/create',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/movements/movement-form.component').then(
            (m) => m.MovementFormComponent,
          ),
      },

      // Public detail pages (no auth required) - :id routes come after specific routes
      {
        path: 'housing/:id',
        loadComponent: () =>
          import('./pages/housing/housing-detail.component').then(
            (m) => m.HousingDetailComponent,
          ),
      },
      {
        path: 'movements/:id',
        loadComponent: () =>
          import('./pages/movements/movement-detail.component').then(
            (m) => m.MovementDetailComponent,
          ),
      },
      {
        path: 'financial/payments/:id',
        loadComponent: () =>
          import('./pages/financial/payments/payment-detail/payment-detail.component').then(
            (m) => m.PaymentDetailComponent,
          ),
      },

      // Other protected routes
      {
        path: 'configuration',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./pages/configuration/configuration-module').then(
            (m) => m.ConfigurationModule,
          ),
      },
      {
        path: 'financial',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./pages/financial/financial-module').then(
            (m) => m.FinancialModule,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

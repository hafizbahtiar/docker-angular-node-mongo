import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '', // This path is relative to how it's lazy-loaded (e.g., /dashboard)
    component: DashboardComponent,
    // Optionally, you can add a resolve guard here to fetch initial data
    // resolve: { dashboardData: DashboardResolver }
  }
];
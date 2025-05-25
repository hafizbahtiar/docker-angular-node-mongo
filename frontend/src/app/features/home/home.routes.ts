import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';

export const HOME_ROUTES: Routes = [
    {
        path: '', // This path is relative to how it's lazy-loaded (e.g., /dashboard)
        component: HomeComponent,
        // Optionally, you can add a resolve guard here to fetch initial data
        // resolve: { dashboardData: DashboardResolver }
    }
];
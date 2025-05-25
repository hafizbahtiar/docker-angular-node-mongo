import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES) }, // Load HomeComponent at the root path
    { path: 'dashboard', component: DashboardComponent, loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
    { path: '**', redirectTo: '' } // Redirect any unmatched paths to the home page
];
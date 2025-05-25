import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for Angular directives like *ngFor, *ngIf, *ngSwitch
import { Observable, BehaviorSubject, catchError, of } from 'rxjs'; // For reactive data handling
import { StatCardComponent } from '../components/stat-card/stat-card.component';
import { DashboardWidget } from '../models/dashboard.interface';
import { DashboardApiService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page', // Make sure this matches your HTML usage
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent // Make sure to import all components used in its template
    // Add other dashboard-specific components here as you create them (e.g., ActivityListComponent)
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit { // Corrected component name if it was DashboardComponent
  userName: string = 'Hafiz';
  currentDate: string = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  userRole: string = 'Developer';

  // --- THESE PROPERTIES WERE LIKELY MISSING OR MISCONFIGURED ---
  private _widgetsSubject = new BehaviorSubject<DashboardWidget[]>([]);
  widgets$: Observable<DashboardWidget[]> = this._widgetsSubject.asObservable();
  isLoading: boolean = true;
  errorMessage: string | null = null;
  // -----------------------------------------------------------

  constructor(private dashboardApiService: DashboardApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.dashboardApiService.getDashboardData().pipe(
      catchError(error => {
        console.error('Error fetching dashboard data:', error);
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
        return of([]); // Return an empty array on error to prevent breaking the UI
      })
    ).subscribe(data => {
      // Assuming API returns data in the structure defined by DashboardWidget
      this._widgetsSubject.next(data);
      this.isLoading = false;
    });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
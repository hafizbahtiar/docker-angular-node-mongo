// src/app/features/dashboard/services/dashboard-api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
// Import all necessary interfaces
import { DashboardWidget, StatWidgetData, ListWidgetData, QuickLinkData, ChartWidgetData } from '../models/dashboard.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root' // Provided at the root level, making it a singleton
})
export class DashboardApiService {
    private apiUrl = environment.apiUrl + '/dashboard'; // Example API endpoint

    constructor(private http: HttpClient) { }

    /**
     * Fetches the dashboard data from the API.
     * @returns An Observable of an array of DashboardWidget.
     */
    getDashboardData(): Observable<DashboardWidget[]> {
        // In a real application, you'd make an actual HTTP request:
        // return this.http.get<DashboardWidget[]>(this.apiUrl);

        // For demonstration, returning mock data:
        return of(this.getMockDashboardData());
    }

    // Mock data for demonstration purposes - now much better!
    private getMockDashboardData(): DashboardWidget[] {
        return [
            {
                icon: 'fas fa-code-branch', // Changed icon for projects
                title: 'Total Projects',
                type: 'stat',
                data: { value: '53', change: '+3', trend: 'up' } as StatWidgetData
            },
            {
                icon: 'fas fa-handshake',
                title: 'Active Clients',
                type: 'stat',
                data: { value: '12', change: '+1', trend: 'up' } as StatWidgetData
            },
            {
                icon: 'fas fa-bug', // Icon for bugs
                title: 'Open Issues',
                type: 'stat',
                data: { value: '5', change: '0', trend: 'neutral' } as StatWidgetData
            },
            {
                icon: 'fas fa-hourglass-half', // Icon for pending
                title: 'Pending Reviews',
                type: 'stat',
                data: { value: '3', change: '+2', trend: 'up' } as StatWidgetData
            },
            {
                icon: 'fas fa-bell',
                title: 'Recent Activity',
                type: 'list',
                data: [
                    { text: 'Deployed "Portfolio v2"', time: '2 hours ago', status: 'success' },
                    { text: 'Reviewed PR for "E-commerce API"', time: 'Yesterday', status: 'info' },
                    { text: 'Bug fix in "Admin Panel UI"', time: '2 days ago', status: 'warning' },
                    { text: 'New client meeting scheduled', time: '3 days ago', status: 'primary' },
                    { text: 'Updated documentation for "Auth Service"', time: 'Last week', status: 'info' }
                ] as ListWidgetData[]
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Project Completion Rate',
                type: 'chart',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [65, 59, 80, 81, 88, 92],
                    datasetLabel: 'Completion Rate (%)'
                } as ChartWidgetData
            },
            {
                icon: 'fas fa-clipboard-list', // Icon for tasks
                title: 'Upcoming Milestones',
                type: 'list',
                data: [
                    { text: 'Client Portal V1 Launch', time: '2025-06-15', status: 'warning' },
                    { text: 'Backend API Refactor', time: '2025-07-01', status: 'info' },
                    { text: 'Mobile App Beta Release', time: '2025-07-20', status: 'primary' }
                ] as ListWidgetData[]
            },
            {
                icon: 'fas fa-external-link-alt', // Icon for external links
                title: 'Quick Links',
                type: 'quick-links',
                data: [
                    { text: 'GitHub Repositories', url: 'https://github.com/hafizbahtiar' },
                    { text: 'LinkedIn Profile', url: 'https://my.linkedin.com/in/hafizbahtiar' },
                ] as QuickLinkData[]
            }
        ];
    }
}
// src/app/features/dashboard/models/dashboard.interface.ts

// For stat widgets
export interface StatWidgetData {
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
}

// For list widgets (added status)
export interface ListWidgetData {
    text: string;
    time: string;
    status?: 'success' | 'info' | 'warning' | 'danger' | 'primary'; // Added status for visual cues
}

// For quick links widgets
export interface QuickLinkData {
    text: string;
    url: string;
}

// NEW: For chart widgets
export interface ChartWidgetData {
    labels: string[]; // e.g., ['Jan', 'Feb', 'Mar']
    values: number[]; // e.g., [10, 20, 15]
    datasetLabel?: string; // e.g., 'Project Progress'
    // You could add more properties like colors, type of chart etc.
}

// Main interface for any dashboard widget
export interface DashboardWidget {
    icon: string;
    title: string;
    type: 'stat' | 'list' | 'chart' | 'quick-links';
    // 'data' can be one of the specific data interfaces based on 'type'
    data: StatWidgetData | ListWidgetData[] | QuickLinkData[] | ChartWidgetData | any;
}
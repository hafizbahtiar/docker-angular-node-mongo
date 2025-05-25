import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngIf, etc.

@Component({
  selector: 'app-stat-card',
  standalone: true, // This component is standalone
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() change: string = '';
  @Input() trend: 'up' | 'down' | 'neutral' = 'neutral';
}
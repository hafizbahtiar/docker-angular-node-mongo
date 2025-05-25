import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // For NgFor

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css'],
  standalone: true, // Mark as standalone
  imports: [CommonModule]
})
export class ServiceCardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() techList: { icon: string; name: string }[] = [];
}
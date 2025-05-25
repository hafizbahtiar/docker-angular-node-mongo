import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // For NgFor

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
  standalone: true, // Mark as standalone
  imports: [CommonModule]
})
export class ProjectCardComponent {
  @Input() imageSrc: string = '';
  @Input() alt: string = '';
  @Input() category: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() techTags: string[] = [];
  @Input() links: { icon: string; href: string; title: string }[] = [];
}
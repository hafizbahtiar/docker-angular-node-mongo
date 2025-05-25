import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // For NgIf, NgFor etc.

// Import standalone components
import { ServiceCardComponent } from '../components/service-card/service-card.component';
import { ProjectCardComponent } from '../components/project-card/project-card.component';
import { ContactCardComponent } from '../components/contact-card/contact-card.component';
import { FooterComponent } from '../../../layouts/footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true, // Mark as standalone component
  imports: [
    CommonModule,
    ReactiveFormsModule, // Required for reactive forms
    ServiceCardComponent, // Import your new standalone service card component
    ProjectCardComponent, // Import your new standalone project card component
    ContactCardComponent,
    FooterComponent
  ]
})
export class HomeComponent {
  contactForm!: FormGroup; // Declare the form group

  skillsData = [
    { name: 'Node.js', level: 80 },
    { name: 'Flutter', level: 80 },
    { name: 'MongoDB', level: 70 },
    { name: 'Express.js', level: 80 },
    { name: 'PostgreSQL', level: 55 },
    { name: 'Docker', level: 60 },
    { name: 'CodeIgniter', level: 60 },
    { name: 'React Native', level: 50 }
  ];

  // Data for service cards (moved from HTML for reusability)
  services = [
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile App Development',
      description: 'I craft **high-performance, cross-platform mobile applications** using modern frameworks. From elegant user interfaces to robust backend integrations, I build apps that deliver seamless user experiences on both iOS and Android.',
      techList: [
        { icon: 'fab fa-dev', name: 'Flutter' },
        { icon: 'fab fa-dev', name: 'Dart' },
        { icon: 'fas fa-database', name: 'Firebase Integration' },
        { icon: 'fab fa-react', name: 'React Native (Basic)' }
      ]
    },
    {
      icon: 'fas fa-server',
      title: 'Robust Backend Solutions',
      description: 'I build **scalable and secure server-side applications** that power complex web and mobile platforms. My focus is on creating efficient APIs, managing databases, and ensuring the stability and performance of your application\'s core.',
      techList: [
        { icon: 'fab fa-node-js', name: 'Node.js & Express' },
        { icon: 'fas fa-database', name: 'MongoDB' },
        { icon: 'fas fa-database', name: 'PostgreSQL & MySQL' },
        { icon: 'fas fa-cloud', name: 'RESTful APIs' }
      ]
    },
    {
      icon: 'fas fa-globe',
      title: 'Dynamic Web Development',
      description: 'I develop **modern, responsive web applications** that are both visually appealing and highly functional. From front-end user interfaces to robust back-end systems, I deliver comprehensive web solutions tailored to your business goals.',
      techList: [
        { icon: 'fab fa-laravel', name: 'Laravel (PHP)' },
        { icon: 'fas fa-code', name: 'CodeIgniter 3 & 4' },
        { icon: 'fab fa-js-square', name: 'JavaScript & jQuery' },
        { icon: 'fab fa-bootstrap', name: 'Bootstrap & Responsive Design' }
      ]
    },
    {
      icon: 'fas fa-database',
      title: 'Database Design & Optimization',
      description: 'I specialize in designing **efficient and well-structured databases** to ensure optimal performance and data integrity for your applications. This includes schema design, query optimization, and data migration.',
      techList: [
        { icon: 'fas fa-server', name: 'SQL (PostgreSQL, MySQL)' },
        { icon: 'fas fa-leaf', name: 'NoSQL (MongoDB)' },
        { icon: 'fas fa-cogs', name: 'Schema Design' },
        { icon: 'fas fa-search-plus', name: 'Query Optimization' }
      ]
    },
    {
      icon: 'fas fa-plug',
      title: 'API Development & Integration',
      description: 'I build and integrate **robust RESTful APIs** that enable seamless communication between different applications and services. This ensures your platforms can interact efficiently and extend their functionality.',
      techList: [
        { icon: 'fas fa-code-branch', name: 'RESTful API Design' },
        { icon: 'fab fa-node-js', name: 'Node.js APIs' },
        { icon: 'fab fa-laravel', name: 'Laravel APIs' },
        { icon: 'fas fa-hands-helping', name: 'Third-Party Integrations' }
      ]
    }
  ];

  // Data for project cards (moved from HTML for reusability)
  projects = [
    {
      imageSrc: 'https://eperolehan.dbkl.gov.my/assets-metronic/media/logos/open-sidebar-logo_headerhome.png',
      alt: 'eperolehan DBKL',
      category: 'Mobile Application',
      title: 'ePerolehan DBKL',
      description: 'ePerolehan for Dewan Bandaraya Kuala Lumpur (DBKL): A digital platform that streamlines and automates the entire tender and procurement process, enabling efficient, paperless management of all purchasing activities.',
      techTags: ['Laravel', 'Flutter', 'MySQL', 'Postman', 'RESTful API'],
      links: [
        { icon: 'fab fa-android', href: 'https://play.google.com/store/apps/details?id=com.example.eperolehan', title: 'View on Google Play' },
        { icon: 'fab fa-apple', href: 'https://apps.apple.com/app/id1234567890', title: 'View on App Store' }
      ]
    },
    {
      imageSrc: 'https://cit.securiforce.net/app-assets/logo/9a6cefbceff3cf135b0b90cc9058c0c1.png',
      alt: 'CIT receipt',
      category: 'Web & Mobile Application',
      title: 'CIT - Full Manage Receipt Book',
      description: 'A web application for security service providers to manage Cash-In-Transit (CIT) orders. The system digitizes the entire receipt book process, enabling every transaction and receipt page to be tracked and audited efficiently for compliance and transparency.',
      techTags: ['Kotlin', 'CodeIgniter 3', 'PostgreSQL', 'Postman', 'RESTful API', 'Docker'],
      links: [
        { icon: 'fas fa-external-link-alt', href: 'https://cit.securiforce.net/', title: 'Visit CIT System' }
      ]
    },
    {
      imageSrc: 'https://cit.securiforce.net/app-assets/logo/9a6cefbceff3cf135b0b90cc9058c0c1.png',
      alt: 'wetrack system',
      category: 'Web & Mobile Application',
      title: 'Wetrack System',
      description: 'As a security provider for cash-in-transit operations between cash centers and ATM branches, this system eliminates the need for technicians to call the command center for secure lock codes at each security layer. Instead, technicians securely retrieve codes directly from the mobile app using a secure flow—each user is assigned a unique public key to obtain codes. Every security layer is protected, and all actions are fully audited for compliance and transparency.',
      techTags: ['CodeIgniter 3', 'PostgreSQL', 'Kotlin', 'Postman', 'RESTful API', 'Docker'],
      links: [
        { icon: 'fas fa-external-link-alt', href: 'https://wetrack.securiforce.net/', title: 'Visit CIT System' }
      ]
    },
    {
      imageSrc: 'https://cit.securiforce.net/app-assets/logo/9a6cefbceff3cf135b0b90cc9058c0c1.png',
      alt: 'Fasttrack',
      category: 'Web Application',
      title: 'Fasttrack System',
      description: 'A client-facing web application that enables users to conveniently order a variety of services, such as cash-in-transit, through a streamlined and user-friendly interface.',
      techTags: ['CodeIgniter 4', 'PostgreSQL', 'Postman', 'RESTful API', 'Docker'],
      links: [
        { icon: 'fas fa-external-link-alt', href: '#', title: 'View Project' },
        { icon: 'fab fa-github', href: '#', title: 'View on GitHub' }
      ]
    }
  ];

  constructor(private fb: FormBuilder) { }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form Submitted!', this.contactForm.value);
      // Here you would typically send the data to a backend service
      alert('Message sent successfully!');
      this.contactForm.reset();
    } else {
      console.log('Form is invalid');
      alert('Please fill in all required fields correctly.');
      // Optionally, mark all fields as touched to display validation errors
      this.contactForm.markAllAsTouched();
    }
  }
}
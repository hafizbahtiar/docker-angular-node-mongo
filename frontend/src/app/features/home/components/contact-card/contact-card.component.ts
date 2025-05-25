import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-card',
  standalone: true, // Assuming standalone, adjust if using NgModule
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // You can add additional initialization logic here if needed
  }

  submitForm(): void {
    if (this.contactForm.valid) {
      console.log('Form Submitted!', this.contactForm.value);
      // Here you would typically send the data to a backend service
      alert('Message sent successfully!'); // For demonstration
      this.contactForm.reset(); // Reset the form after submission
    } else {
      console.log('Form is invalid.');
      // Mark all fields as touched to show validation messages
      this.contactForm.markAllAsTouched();
    }
  }
}
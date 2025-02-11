import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',  
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(11)]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.authService.register(this.registrationForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = error.error?.message || 'Registration failed!';
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

}

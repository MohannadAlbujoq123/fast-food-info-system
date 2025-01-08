import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.loginError = null;
            this.router.navigate(['/welcome']).then(() => {
              window.location.reload();
            });
          } else {
            this.loginError = 'Login failed. Please check your credentials and try again.';
          }
        },
        error: err => {
          console.error('Login failed', err);
          this.loginError = 'An error occurred. Please try again.';
        }
      });
    }
  }
}
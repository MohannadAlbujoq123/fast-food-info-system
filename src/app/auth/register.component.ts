import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { IRole } from '../management/Interfaces/role';
import { UsersService } from '../management/users/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  roles: IRole[] = [];
  roleMap: Map<string, number> = new Map();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      username: ['', [Validators.required]],
      roleName: ['']
    });
  }

  ngOnInit(): void {
    this.usersService.getRoles().subscribe(roles => {
      this.roles = roles;
      this.roles.forEach(role => this.roleMap.set(role.roleName, role.id));
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const user = {
        userName: formValue.username,
        email: formValue.email,
        password: formValue.password,
        roleId: this.roleMap.get(formValue.roleName) || 0
      };

      this.authService.register(user).subscribe({
        next: () => this.router.navigate(['/login']),
        error: err => console.error('Registration failed', err)
      });
    }
  }
}
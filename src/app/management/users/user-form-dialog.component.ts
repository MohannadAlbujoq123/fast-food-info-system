import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from './users.service';
import { IUser } from '../Interfaces/user';
import { IRole } from '../Interfaces/role';
import { FormService } from '../../shared/form.service';

@Component({
  selector: 'fp-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  standalone: false
})
export class UserFormDialogComponent implements OnInit {
  userForm: FormGroup;
  isEdit: boolean = false;
  roles: IRole[] = [];
  roleMap: Map<string, number> = new Map();

  constructor(
    private usersService: UsersService,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operation: string, user?: IUser },
    private formService: FormService
  ) {
    this.userForm = this.formService.getUserForm(this.data.user);
  }

  ngOnInit(): void {
    this.usersService.getRoles().subscribe(roles => {
      this.roles = roles;
      this.roles.forEach(role => this.roleMap.set(role.roleName, role.id));

      if (this.data.operation === 'edit' && this.data.user) {
        this.userForm.patchValue({
          userName: this.data.user.userName,
          email: this.data.user.email,
          roleName: this.data.user.userRoles[0]?.roleName 
        });
        this.isEdit = true;
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      } else {
        this.userForm.get('password')?.setValidators(Validators.required);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      user.roleId = this.roleMap.get(user.roleName); 

      if (this.isEdit) {
        this.usersService.updateUser(this.data.user!.id, user).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.usersService.createUser(user).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }
}
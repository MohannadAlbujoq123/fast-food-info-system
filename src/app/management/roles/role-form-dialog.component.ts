import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from './roles.service';
import { IRole } from '../Interfaces/role';
import { FormService } from '../../shared/form.service';

@Component({
  selector: 'fp-role-form-dialog',
  templateUrl: './role-form-dialog.component.html',
  standalone: false
})
export class RoleFormDialogComponent implements OnInit {
  roleForm: FormGroup;
  isEdit: boolean = false;
  allPermissions: any[] = [];
  assignedPermissions: any[] = [];

  constructor(
    private rolesService: RolesService,
    public dialogRef: MatDialogRef<RoleFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operation: string, role?: IRole },
    private formService: FormService
  ) {
    this.roleForm = this.formService.getRoleForm(this.data.role);
  }

  ngOnInit(): void {
    this.rolesService.getPermissions().subscribe(permissions => {
      this.allPermissions = permissions;
      if (this.data.operation === 'edit' && this.data.role) {
        this.roleForm.patchValue(this.data.role);
        this.isEdit = true;
        this.assignedPermissions = this.data.role.rolePermissions;
      }
    });
  }

  isPermissionAssigned(permission: any): boolean {
    return this.assignedPermissions.some(ap => ap.id === permission.id);
  }

  togglePermission(permission: any, isChecked: boolean): void {
    if (isChecked) {
      this.assignedPermissions.push(permission);
    } else {
      this.assignedPermissions = this.assignedPermissions.filter(ap => ap.id !== permission.id);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const role = this.roleForm.value;
      role.rolePermissions = this.assignedPermissions.map(permission => permission.id);

      if (this.isEdit) {
        this.rolesService.updateRole(this.data.role!.id, role).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.rolesService.createRole(role).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }
}
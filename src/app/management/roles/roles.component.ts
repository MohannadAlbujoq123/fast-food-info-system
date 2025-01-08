import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolesService } from './roles.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { RoleFormDialogComponent } from './role-form-dialog.component';
import { IRole } from '../Interfaces/role';

@Component({
  selector: 'fp-roles',
  templateUrl: './roles.component.html',
  standalone: false
})
export class RolesComponent implements OnInit {
  roles: IRole[] = [];

  constructor(private rolesService: RolesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe(data => {
      if (Array.isArray(data)) {
        this.roles = data.map(role => {
          const permissions = (role.rolePermissions as any)?.$values;
          role.rolePermissions = Array.isArray(permissions) ? permissions : [];
          return role;
        });
      } else {
        console.error('Expected an array of roles but got:', data);
      }
    });
  }

  createRole(): void {
    const dialogRef = this.dialog.open(RoleFormDialogComponent, {
      width: '400px',
      data: { operation: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  editRole(role: IRole): void {
    const dialogRef = this.dialog.open(RoleFormDialogComponent, {
      width: '400px',
      data: { operation: 'edit', role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  deleteRole(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesService.deleteRole(id).subscribe(() => {
          this.loadRoles();
        });
      }
    });
  }
}
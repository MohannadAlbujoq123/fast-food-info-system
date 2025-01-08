import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PermissionsService } from './permissions.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { PermissionFormDialogComponent } from './permission-form-dialog.component';
import { IPermission } from '../Interfaces/permission';

@Component({
  selector: 'fp-permissions',
  templateUrl: './permissions.component.html',
  standalone: false
})
export class PermissionsComponent implements OnInit {
  permissions: IPermission[] = [];

  constructor(private permissionsService: PermissionsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissionsService.getPermissions().subscribe(data => {
      this.permissions = data;
    });
  }

  createPermission(): void {
    const dialogRef = this.dialog.open(PermissionFormDialogComponent, {
      width: '400px',
      data: { operation: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPermissions();
      }
    });
  }

  editPermission(permission: IPermission): void {
    const dialogRef = this.dialog.open(PermissionFormDialogComponent, {
      width: '400px',
      data: { operation: 'edit', permission }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPermissions();
      }
    });
  }

  deletePermission(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.permissionsService.deletePermission(id).subscribe(() => {
          this.loadPermissions();
        });
      }
    });
  }
}
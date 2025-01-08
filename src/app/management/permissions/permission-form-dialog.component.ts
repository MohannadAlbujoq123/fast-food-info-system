import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermissionsService } from './permissions.service';
import { IPermission } from '../Interfaces/permission';
import { FormService } from '../../shared/form.service';

@Component({
  selector: 'fp-permission-form-dialog',
  templateUrl: './permission-form-dialog.component.html',
  standalone: false
})
export class PermissionFormDialogComponent implements OnInit {
  permissionForm: FormGroup;
  isEdit: boolean = false;

  constructor(
    private permissionsService: PermissionsService,
    public dialogRef: MatDialogRef<PermissionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operation: string, permission?: IPermission },
    private formService: FormService
  ) {
    this.permissionForm = this.formService.getPermissionForm(this.data.permission);
  }

  ngOnInit(): void {
    if (this.data.operation === 'edit' && this.data.permission) {
      this.permissionForm.patchValue(this.data.permission);
      this.isEdit = true;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.permissionForm.valid) {
      const permission = this.permissionForm.value;

      if (this.isEdit) {
        this.permissionsService.updatePermission(this.data.permission!.id, permission).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.permissionsService.createPermission(permission).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }
}
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-quantity-form-dialog',
  templateUrl: './quantity-form-dialog.component.html',
  standalone: false,
})
export class QuantityFormDialogComponent {
  quantityForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<QuantityFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formService: FormService
  ) {
    this.quantityForm = this.formService.getQuantityForm(data.product);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.quantityForm.valid) {
      this.dialogRef.close(this.quantityForm.value);
    }
  }
}
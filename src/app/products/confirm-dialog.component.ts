import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>Confirm Deletion</h1>
    <div mat-dialog-content>
      <p>Are you sure you want to delete this product?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()" class="left-button">No</button>
      <button mat-button (click)="onYesClick()" cdkFocusInitial class="right-button">Yes</button>
    </div>
  `,
  standalone: false,
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>Confirmation</h1>
    <div mat-dialog-content class="center-content">
      <p>Are you sure to complete the progress?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button (click)="onNoClick()" class="left-button">No</button>
      <button mat-raised-button (click)="onYesClick()" cdkFocusInitial class="right-button">Yes</button>
    </div>
  `,
  styles: [`
    .mat-dialog-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .left-button {
      margin-right: auto!important;
      color: #f44336;
    }
    .right-button {
      margin-left: auto!important;
      left:73%;
      color: #3f51b5;
    }
    .center-content {
      text-align: center;
    }
  `],
  standalone: false
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
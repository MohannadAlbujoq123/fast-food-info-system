import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarColor } from './snackbar-color.enum'; 

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(message: string, color: 'primary' | 'accent'): void {
    this.snackBar.open(message, 'X', {
      duration: 3000000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: color === SnackbarColor.Primary ? 'snack-bar-primary' : 'snack-bar-accent'
    });
  }
}
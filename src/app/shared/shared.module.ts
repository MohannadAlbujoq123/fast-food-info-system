import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { StarRatingComponent } from './star-rating.component';
import { AutocompleteComponent } from '../products/autocomplete/autocomplete.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  declarations: [
    StarRatingComponent,
    AutocompleteComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  exports: [
    CommonModule,
    StarRatingComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AutocompleteComponent,
    MatButtonModule
  ]
})
export class SharedModule { }
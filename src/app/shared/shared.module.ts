import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StarRatingComponent } from './star-rating.component';

@NgModule({
  declarations: [
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    CommonModule,
    StarRatingComponent,
    MatIconModule
  ]
})
export class SharedModule { }
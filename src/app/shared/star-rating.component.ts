import { Component, Input } from '@angular/core';

@Component({
  selector: 'pm-star',
  template: `
    <ng-container *ngFor="let star of stars; let i = index">
      <mat-icon [ngClass]="{'filled': i < fullStars, 'half-filled': i >= fullStars && i < fullStars + halfStars}">
        {{ i < fullStars ? 'star' : (i < fullStars + halfStars ? 'star_half' : 'star_border') }}
      </mat-icon>
    </ng-container>
  `,
  styles: [`
    mat-icon {
      color: gold;
      vertical-align: middle;
    }
    .filled {
      color: gold;
    }
    .half-filled {
      color: gold;
    }
    ng-container {
      display: inline-flex;
    vertical-align: middle;
  }
  `],
  standalone: false,
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];
  get fullStars(): number {
    return Math.floor(this.rating);
  }
  get halfStars(): number {
    return this.rating % 1 >= 0.5 ? 1 : 0;
  }
}
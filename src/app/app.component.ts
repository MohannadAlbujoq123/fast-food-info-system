import { Component } from '@angular/core';

@Component({
  selector: 'fp-root',
  styleUrls: ['./app.component.css'],
  standalone: false,
  template: `
  <mat-toolbar color="primary">
    <span routerLink="/welcome" class="pageTitle">{{pageTitle}}</span>
    <span class="spacer"></span>
    <button mat-button routerLink="/products">List</button>
    <button mat-button color="accent" routerLink="/cart">
    <mat-icon>shopping_cart</mat-icon>
    </button>
  </mat-toolbar>
  <div class='container'>
    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent {
  pageTitle = 'fast-food-project';
}
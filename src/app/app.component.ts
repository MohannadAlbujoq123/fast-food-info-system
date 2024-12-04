import { Component } from '@angular/core';

@Component({
  selector: 'fp-root',
  styleUrls: ['./app.component.css'],
  standalone: false,
  template: `
  <mat-toolbar color="primary">
    <span>{{pageTitle}}</span>
    <span class="spacer"></span>
    <button mat-button routerLink="/welcome">Home</button>
    <button mat-button routerLink="/products">Product List</button>
  </mat-toolbar>
  <div class='container'>
    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent {
  pageTitle = 'fast-food-project';
}
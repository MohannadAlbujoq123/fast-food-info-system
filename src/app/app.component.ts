import { Component, OnInit } from '@angular/core';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'fp-root',
  styleUrls: ['./app.component.css'],
  standalone: false,
  template: `
  <mat-toolbar color="primary">
    <span routerLink="/welcome" class="pageTitle">{{pageTitle}}</span>
    <span class="spacer"></span>
    <button mat-button routerLink="/products">List</button>
    <button mat-button routerLink="/dashboard">Dashboard</button>
    <button mat-button color="accent" routerLink="/cart">
      <mat-icon>shopping_cart</mat-icon>
      <span *ngIf="cartCount > 0" matBadge="{{ cartCount }}" matBadgeColor="warn"></span>
    </button>
  </mat-toolbar>
  <div class='container'>
    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent implements OnInit {
  pageTitle = 'fast-food-project';
  cartCount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }
}
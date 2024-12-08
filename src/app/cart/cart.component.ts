import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { ProductService } from '../products/product.service';
import { IProduct } from '../products/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: false,
})
export class CartComponent implements OnInit {
  cartProducts: IProduct[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCartProducts();
  }

  loadCartProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.cartProducts = products.filter(product => product.cart > 0); // Changed to > 0
      this.calculateTotalPrice();
    });
  }

  incrementCart(productId: number): void {
    this.cartService.incrementCart(productId).subscribe(() => {
      this.loadCartProducts();
    });
  }

  decrementCart(productId: number): void {
    this.cartService.decrementCart(productId).subscribe(() => {
      this.loadCartProducts();
    });
  }

  resetCart(productId: number): void {
    this.cartService.resetCart(productId).subscribe(() => {
      this.loadCartProducts();
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartProducts.reduce((total, product) => total + product.price * product.cart, 0);
  }
}
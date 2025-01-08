import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export interface CartItem {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:7088/api/orders';
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.updateCartCount();
  }

  public getCartFromCookies(): CartItem[] {
    const cartCookie = document.cookie.split('; ').find(row => row.startsWith('cart='));
    return cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split('=')[1])) : [];
  }

  private setCartToCookies(cart: CartItem[]): void {
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; path=/`;
    this.updateCartCount();
  }

  incrementCart(productId: number): void {
    const cart = this.getCartFromCookies();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
    this.setCartToCookies(cart);
  }

  decrementCart(productId: number): void {
    const cart = this.getCartFromCookies();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
      }
    }
    this.setCartToCookies(cart);
  }

  resetCart(productId: number): void {
    const cart = this.getCartFromCookies();
    const index = cart.findIndex(i => i.productId === productId);
    if (index !== -1) {
      cart.splice(index, 1);
    }
    this.setCartToCookies(cart);
  }

  setCartQuantity(productId: number, quantity: number): void {
    const cart = this.getCartFromCookies();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
      }
    } else if (quantity > 0) {
      cart.push({ productId, quantity });
    }
    this.setCartToCookies(cart);
  }

  saveCartToDatabase(): Observable<any> {
    const cart = this.getCartFromCookies();
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/buy`, cart, { headers }).pipe(
      tap(() => {
        document.cookie = 'cart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        this.updateCartCount();
      })
    );
  }

  getCartCount(): Observable<number> {
    const cart = this.getCartFromCookies();
    return new BehaviorSubject(cart.reduce((total, item) => total + item.quantity, 0)).asObservable();
  }

  private updateCartCount(): void {
    const cart = this.getCartFromCookies();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    this.cartCountSubject.next(count);
  }
}
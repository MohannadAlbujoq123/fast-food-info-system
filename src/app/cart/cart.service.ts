import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/products';
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.updateCartCount();
  }

  incrementCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/cart/increment`, {}).pipe(
      tap(() => this.updateCartCount())
    );
  }

  decrementCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/cart/decrement`, {}).pipe(
      tap(() => this.updateCartCount())
    );
  }

  resetCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/cart/reset`, {}).pipe(
      tap(() => this.updateCartCount())
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`).pipe(
      tap(() => this.updateCartCount())
    );
  }

  purchaseProduct(productId: number, count: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/purchase`, { count }).pipe(
      tap(() => this.updateCartCount())
    );
  }

  getCartCount(): Observable<number> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(products => products.reduce((total, product) => total + product.cart, 0))
    );
  }

  private updateCartCount(): void {
    this.getCartCount().subscribe(count => {
      this.cartCountSubject.next(count);
    });
  }
}
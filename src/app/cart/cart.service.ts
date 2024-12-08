import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  incrementCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/cart/increment`, {});
  }

  decrementCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/cart/decrement`, {});
  }

  resetCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/cart/reset`, {});
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }
}
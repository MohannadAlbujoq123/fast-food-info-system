import { Injectable } from '@angular/core';
import { IProduct } from './product';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7088/api/products'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProducts(): Observable<IProduct[]> {
    return this.http.get<{ $values: IProduct[] }>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map(response => Array.isArray(response.$values) ? response.$values : []),
      catchError(this.handleError)
    );
  }

  submitNewProduct(productData: FormData): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, productData, {
      headers: this.authService.getAuthHeaders().delete('Content-Type') 
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, productData: FormData): Observable<IProduct> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IProduct>(url, productData, {
      headers: this.authService.getAuthHeaders().delete('Content-Type')
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<IProduct | undefined> {
    return this.getProducts().pipe(
      map((products: IProduct[]) => products.find(p => p.id === id))
    );
  }

  resetPurchased(id: number): Observable<IProduct> {
    const url = `${this.apiUrl}/${id}/purchased/reset`;
    return this.http.post<IProduct>(url, {}, {
      headers: this.authService.getAuthHeaders().set('Content-Type', 'application/json')
    }).pipe(
      catchError(this.handleError)
    );
  }

  toggleProductDisabled(id: number, isDisabled: boolean): Observable<void> {
    const url = `${this.apiUrl}/${id}/disable`;
    return this.http.put<void>(url, { isDisabled }, {
      headers: this.authService.getAuthHeaders().set('Content-Type', 'application/json')
    }).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error('Something went wrong!'));
  }
}
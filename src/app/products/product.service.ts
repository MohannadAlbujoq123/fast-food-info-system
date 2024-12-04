import { Injectable } from '@angular/core';
import { IProduct } from './product';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = 'api/products/products.json'; 
  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productUrl).pipe(
      tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  submitNewProduct(formData: FormData): Observable<IProduct> {
    const url = 'http://localhost:3000/api/products';
    return this.http.post<IProduct>(url, formData).pipe(
      tap(data => console.log('Product added: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, formData: FormData): Observable<IProduct> {
    const url = `http://localhost:3000/api/products/${id}`;
    return this.http.put<IProduct>(url, formData).pipe(
      tap(data => console.log('Product updated: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<void> {
    const url = `http://localhost:3000/api/products/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Product deleted: ${id}`)),
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<IProduct | undefined> {
    return this.getProducts().pipe(
      map((products: IProduct[]) => products.find(p => p.productId === id))
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
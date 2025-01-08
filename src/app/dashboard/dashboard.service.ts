import { Injectable } from '@angular/core';
import { ProductService } from '../products/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProduct } from '../products/product';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private productService: ProductService) {}

  getPurchasedProducts(): Observable<IProduct[]> {
    return this.productService.getProducts().pipe(
      map(products => products.filter(product => product.purchased > 0))
    );
  }

  getNoPurchasedProducts(): Observable<IProduct[]> {
    return this.productService.getProducts().pipe(
      map(products => products.filter(product => product.purchased === 0))
    );
  }
}
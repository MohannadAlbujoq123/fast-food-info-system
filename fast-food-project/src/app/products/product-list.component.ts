import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from './product.service';
import { IProduct } from './product';

@Component({
  selector: 'fp-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy{
  pageTitle: string = 'Product List';
  imageWidth: number = 250;
  imageHeight: number = 150;
  imageMargin: number = 0;
  errorMessage: string = '';
  sub!: Subscription;
  products: IProduct[] = [];

  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.sub= this.productService.getProducts().subscribe({
      next: products => {
        this.products = products
      },
      error: err => this.errorMessage = err,

      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

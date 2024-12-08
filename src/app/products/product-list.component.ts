import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from './product.service';
import { IProduct } from './product';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'fp-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false,
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Product List';
  imageWidth: number = 250;
  imageHeight: number = 150;
  imageMargin: number = 0;
  errorMessage: string = '';
  sub!: Subscription;
  products: IProduct[] = [];

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.sub = this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
      },
      error: err => this.errorMessage = err,
    });
  }

  openDialog(operation: string): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: { operation },
      panelClass: 'custom-dialog-container'
    });
  
    dialogRef.componentInstance.productAdded.subscribe(() => {
      this.loadProducts(); 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  incrementCart(productId: number): void {
    this.cartService.incrementCart(productId).subscribe(() => {
      this.loadProducts();
    });
  }

  decrementCart(productId: number): void {
    this.cartService.decrementCart(productId).subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
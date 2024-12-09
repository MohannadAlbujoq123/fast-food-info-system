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
  filteredProducts: IProduct[] = [];
  productNames: string[] = [];
  searchTerm: string = ''; 

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
        this.filteredProducts = products;
        this.productNames = products.map(product => product.productName);
      },
      error: err => this.errorMessage = err,
    });
  }

  filterProducts(searchTerm: string): void {
    this.searchTerm = searchTerm; 
    this.filteredProducts = this.products.filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
  
 
  }

  incrementCart(productId: number): void {
    this.cartService.incrementCart(productId).subscribe(() => {
      this.updateProductCart(productId, 1);
    });
  }

  decrementCart(productId: number): void {
    this.cartService.decrementCart(productId).subscribe(() => {
      this.updateProductCart(productId, -1);
    });
  }

  updateProductCart(productId: number, change: number): void {
    const product = this.products.find(p => p.productId === productId);
    if (product) {
      product.cart += change;
    }
    this.filteredProducts = this.products.filter(product =>
      product.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
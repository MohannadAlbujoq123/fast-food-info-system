import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from './product';
import { ProductService } from './product.service';
import { CartService } from '../cart/cart.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { SnackbarService } from '../shared/snackbar.service';
import { SnackbarColor } from '../shared/snackbar-color.enum';
import { TranslationService } from '../shared/translation.service';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: false
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  pageTitle: string;
  product: IProduct | undefined;
  errorMessage: string = '';
  sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    public translationService: TranslationService
  ) {
    this.pageTitle = this.translationService.translate('productDetailComponent', 'pageTitle');
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getProduct(id);
    }
  }

  getProduct(id: number): void {
    this.sub = this.productService.getProduct(id).subscribe({
      next: product => this.product = product,
      error: err => this.errorMessage = err
    });
  }

  addToCart(productId: number): void {
    this.cartService.incrementCart(productId).subscribe(() => {
      this.getProduct(productId);
    });
  }

  removeFromCart(productId: number): void {
    this.cartService.decrementCart(productId).subscribe(() => {
      this.getProduct(productId);
    });
  }

  resetCart(productId: number): void {
    this.cartService.resetCart(productId).subscribe(() => {
      this.getProduct(productId);
    });
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }

  onEdit(): void {
    if (this.product) {
      const dialogRef = this.dialog.open(ProductFormDialogComponent, {
        width: '500px',
        data: { operation: 'edit', product: this.product },
        panelClass: 'custom-dialog-container'
      });

      dialogRef.componentInstance.productAdded.subscribe(() => {
        this.getProduct(this.product!.productId); 
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(this.product!.productId).subscribe({
          next: () => {
            this.router.navigate(['/products']);
            this.snackbarService.showSnackBar(this.translationService.translate('productDetailComponent', 'productDeleted'), SnackbarColor.Accent);
          },
          error: err => this.errorMessage = err
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
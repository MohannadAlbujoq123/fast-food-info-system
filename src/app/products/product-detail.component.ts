import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from './product';
import { ProductService } from './product.service';
import { CartService, CartItem } from '../cart/cart.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { SnackbarService } from '../shared/snackbar.service';
import { SnackbarColor } from '../shared/snackbar-color.enum';
import { TranslationService } from '../shared/translation.service';
import { AuthService } from '../auth/auth.service';
import { FormGroup } from '@angular/forms';
import { FormService } from '../shared/form.service';
import { ConfigurationService } from '../shared/configuration.service';
import { Configuration } from '../shared/configuration.model';
import { QuantityFormDialogComponent } from './quantity-form-dialog.component';

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
  isAdmin: boolean = false;
  isSeller: boolean = false;
  isBuyer: boolean = false; 
  currentUserId: number | null = null;
  productForm: FormGroup;
  displayConditions: Configuration[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    public translationService: TranslationService,
    private authService: AuthService,
    private formService: FormService,
    private configService: ConfigurationService
  ) {
    this.pageTitle = this.translationService.translate('productDetailComponent', 'pageTitle');
    this.productForm = this.formService.getProductForm();
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getProduct(id);
    }
    this.isAdmin = this.authService.isAdmin();
    this.isSeller = this.authService.isSeller();
    this.isBuyer = this.authService.isBuyer(); 
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadDisplayConditions();
  }

  getProduct(id: number): void {
    this.sub = this.productService.getProduct(id).subscribe({
      next: product => {
        if (product) {
          product.imageUrl = `data:image/png;base64,${product.imageBase64}`;
          this.product = product;
          if (this.product) {
            this.productForm.patchValue(this.product);
            this.updateProductCartFromCookies();
          }
        }
      },
      error: err => this.errorMessage = err
    });
  }

  loadDisplayConditions(): void {
    this.configService.loadConfigurations().subscribe({
      next: (response: any) => {
        const configurations: Configuration[] = response.$values;
        this.displayConditions = configurations
          .filter(config => config.componentName === 'ProductDetails' && config.isActive)
          .sort((a, b) => a.order - b.order);
      },
      error: err => this.errorMessage = err
    });
  }

  isConditionActive(name: string): boolean {
    return this.displayConditions.some((cond: Configuration) => cond.name === name && cond.isActive);
  }

  canEditOrDelete(): boolean {
    return ((this.isAdmin || this.isSeller) && this.product?.createdByUserId === this.currentUserId);
  }

  addToCart(productId: number): void {
    this.cartService.incrementCart(productId);
    this.updateProductCartFromCookies();
  }

  removeFromCart(productId: number): void {
    this.cartService.decrementCart(productId);
    this.updateProductCartFromCookies();
  }

  resetCart(productId: number): void {
    this.cartService.resetCart(productId);
    this.updateProductCartFromCookies();
  }

  updateProductCartFromCookies(): void {
    if (this.product) {
      const cart: CartItem[] = this.cartService.getCartFromCookies();
      const cartItem = cart.find(item => item.productId === this.product!.id);
      this.product.cart = cartItem ? cartItem.quantity : 0;
    }
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
        this.getProduct(this.product!.id); 
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
        this.productService.deleteProduct(this.product!.id).subscribe({
          next: () => {
            this.router.navigate(['/products']);
            this.snackbarService.showSnackBar(this.translationService.translate('productDetailComponent', 'productDeleted'), SnackbarColor.Accent);
          },
          error: err => this.errorMessage = err
        });
      }
    });
  }

  openQuantityDialog(): void {
    const dialogRef = this.dialog.open(QuantityFormDialogComponent, {
      width: '500px',
      data: { product: this.product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.setCartQuantity(this.product!.id, result.quantity);
        this.updateProductCartFromCookies();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
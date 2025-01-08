import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from './product.service';
import { IProduct } from './product';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { CartService } from '../cart/cart.service';
import { TranslationService } from '../shared/translation.service';
import { AuthService } from '../auth/auth.service';
import { FormGroup } from '@angular/forms';
import { FormService } from '../shared/form.service';
import { ConfigurationService } from '../shared/configuration.service';
import { Configuration } from '../shared/configuration.model';

@Component({
  selector: 'fp-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false,
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle: string;
  imageWidth: number = 250;
  imageHeight: number = 150;
  imageMargin: number = 0;
  errorMessage: string = '';
  sub!: Subscription;
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  productNames: string[] = [];
  searchTerm: string = ''; 
  isBuyer: boolean = false;
  isAdmin: boolean = false;
  isSeller: boolean = false;
  currentUserId: number | null = null;
  productForm: FormGroup;
  displayConditions: Configuration[] = [];
  product: IProduct | null = null;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private cartService: CartService,
    public translationService: TranslationService,
    private authService: AuthService,
    private formService: FormService,
    private configService: ConfigurationService
  ) {
    this.pageTitle = this.translationService.translate('productList', 'pageTitle');
    this.productForm = this.formService.getProductForm();
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isSeller = this.authService.isSeller();
    this.isBuyer = this.authService.isBuyer();
    this.currentUserId = this.authService.getCurrentUserId(); 
    this.loadProducts();
    this.loadDisplayConditions();
  }

  loadProducts(): void {
    this.sub = this.productService.getProducts().subscribe({
      next: products => {
        if (!Array.isArray(products)) {
          console.error('Expected an array of products');
          return;
        }
        const cart = this.cartService.getCartFromCookies();
        this.products = products.map(product => {
          if (!this.imageExists(product.imageUrl)) {
            product.imageUrl = `data:image/png;base64,${product.imageBase64}`;
          }
          const cartItem = cart.find(item => item.productId === product.id);
          product.cart = cartItem ? cartItem.quantity : 0;
          return product;
        });
        this.filteredProducts = this.products;
        this.productNames = this.products.map(product => product.productName);
      },
      error: err => {
        this.errorMessage = err.message;
        console.error('Error loading products', err);
      },
    });
  }

  loadDisplayConditions(): void {
    this.configService.loadConfigurations().subscribe({
      next: (response: any) => {
        const configurations: Configuration[] = response.$values;
        this.displayConditions = configurations
          .filter(config => config.componentName === 'ProductList' && config.isActive)
          .sort((a, b) => a.order - b.order);
      },
      error: err => this.errorMessage = err
    });
  }

  isConditionActive(name: string): boolean {
    return this.displayConditions.some((cond: Configuration) => cond.name === name && cond.isActive);
  }

  imageExists(imageUrl: string): boolean {
    const img = new Image();
    img.src = imageUrl;
    return img.complete && img.naturalHeight !== 0;
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
    this.cartService.incrementCart(productId);
    this.updateProductCart(productId, 1);
  }

  decrementCart(productId: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product && product.cart > 0) {
      this.cartService.decrementCart(productId);
      this.updateProductCart(productId, -1);
    }
  }

  updateProductCart(productId: number, change: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.cart += change;
    }
    this.filteredProducts = this.products.filter(product =>
      product.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleProductDisabled(productId: number, isDisabled: boolean): void {
    this.productService.toggleProductDisabled(productId, isDisabled).subscribe(() => {
      this.loadProducts();
    });
  }

  canDisableProduct(product: IProduct): boolean {
    return this.isAdmin || (this.isSeller && product.createdByUserId === this.currentUserId);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
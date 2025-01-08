import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from './cart.service';
import { ProductService } from '../products/product.service';
import { IProduct } from '../products/product';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { forkJoin, of } from 'rxjs';
import { delay, concatMap } from 'rxjs/operators';
import { SnackbarService } from '../shared/snackbar.service';
import { SnackbarColor } from '../shared/snackbar-color.enum';
import { TranslationService } from '../shared/translation.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: false,
})
export class CartComponent implements OnInit {
  cartProducts: IProduct[] = [];
  filteredCartProducts: IProduct[] = [];
  productNames: string[] = [];
  totalPrice: number = 0;
  searchTerm: string = '';

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadCartProducts();
  }

  loadCartProducts(): void {
    const cart = this.cartService.getCartFromCookies();
    this.productService.getProducts().subscribe(products => {
      this.cartProducts = products.filter(product => {
        const cartItem = cart.find(item => item.productId === product.id);
        if (cartItem) {
          product.cart = cartItem.quantity;
          return true;
        }
        return false;
      }).map(product => {
        if (!this.imageExists(product.imageUrl)) {
          product.imageUrl = `data:image/png;base64,${product.imageBase64}`;
        }
        return product;
      });
      this.filteredCartProducts = this.cartProducts;
      this.productNames = this.cartProducts.map(product => product.productName);
      this.calculateTotalPrice();
    });
  }

  imageExists(imageUrl: string): boolean {
    const img = new Image();
    img.src = imageUrl;
    return img.complete && img.naturalHeight !== 0;
  }

  filterCartProducts(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filteredCartProducts = this.cartProducts.filter(product =>
      product.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  incrementCart(productId: number): void {
    this.cartService.incrementCart(productId);
    this.updateProductCart(productId, 1);
  }

  decrementCart(productId: number): void {
    this.cartService.decrementCart(productId);
    this.updateProductCart(productId, -1);
  }

  resetCart(productId: number): void {
    this.cartService.resetCart(productId);
    this.loadCartProducts();
    this.snackbarService.showSnackBar(this.translationService.translate('cartComponent', 'itemDeleted'), SnackbarColor.Accent);
  }

  updateProductCart(productId: number, change: number): void {
    const product = this.cartProducts.find(p => p.id === productId);
    if (product) {
      product.cart += change;
      if (product.cart <= 0) {
        this.cartProducts = this.cartProducts.filter(p => p.id !== productId);
        this.filteredCartProducts = this.filteredCartProducts.filter(p => p.id !== productId);
      } else {
        this.filteredCartProducts = this.cartProducts.filter(product =>
          product.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
      this.calculateTotalPrice();
      this.updateProductNames();
    }
  }

  updateProductNames(): void {
    this.productNames = this.cartProducts.map(product => product.productName);
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartProducts.reduce((total, product) => total + product.price * product.cart, 0);
  }

  confirmPurchase(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

   

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.purchaseProducts();
      }
    });
  }

  purchaseProducts(): void {
    this.cartService.saveCartToDatabase().subscribe({
      next: () => {
        this.loadCartProducts();
        this.snackbarService.showSnackBar(this.translationService.translate('cartComponent', 'purchaseSuccessful'), SnackbarColor.Primary);
        // Reset the cart cookies
        document.cookie = 'cart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'An error occurred while processing your request.';
        this.snackbarService.showSnackBar(errorMessage, SnackbarColor.Accent);
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
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
    this.productService.getProducts().subscribe(products => {
      this.cartProducts = products.filter(product => product.cart > 0);
      this.filteredCartProducts = this.cartProducts;
      this.productNames = this.cartProducts.map(product => product.productName);
      this.calculateTotalPrice();
    });
  }

  filterCartProducts(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filteredCartProducts = this.cartProducts.filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  resetCart(productId: number): void {
    this.cartService.resetCart(productId).subscribe(() => {
      this.loadCartProducts();
      this.snackbarService.showSnackBar(this.translationService.translate('cartComponent', 'itemDeleted'), SnackbarColor.Accent);
    });
  }

  updateProductCart(productId: number, change: number): void {
    const product = this.cartProducts.find(p => p.productId === productId);
    if (product) {
      product.cart += change;
      if (product.cart <= 0) {
        this.cartProducts = this.cartProducts.filter(p => p.productId !== productId);
        this.filteredCartProducts = this.filteredCartProducts.filter(p => p.productId !== productId);
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
      data: { message: this.translationService.translate('cartComponent', 'areYouSure') }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.purchaseProducts();
      }
    });
  }

  purchaseProducts(): void {
    const purchaseObservables = this.cartProducts.map((product, index) => {
      return of(null).pipe(
        delay(index * 100),
        concatMap(() => this.cartService.purchaseProduct(product.productId, product.cart))
      );
    });

    forkJoin(purchaseObservables).subscribe(results => {
      this.loadCartProducts();
      this.snackbarService.showSnackBar(this.translationService.translate('cartComponent', 'purchaseSuccessful'), SnackbarColor.Primary);
    });
  }

}
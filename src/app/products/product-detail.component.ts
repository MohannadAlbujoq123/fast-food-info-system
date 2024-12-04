import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from './product';
import { ProductService } from './product.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: false
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Product Detail';
  product: IProduct | undefined;
  errorMessage: string = '';
  sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pageTitle += `: ${id}`;
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
        this.getProduct(this.product!.productId); // Refresh the product details
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    }
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(this.product!.productId).subscribe({
          next: () => this.router.navigate(['/products']),
          error: err => this.errorMessage = err
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { CleanProductCodePipe } from '../customPipes/clean-product-code.pipe';
import { CardAnimationDirective } from '../customDirectives/card-animation.directive';
import { AdminGuard } from '../auth/admin.guard';
import { SellerGuard } from '../auth/seller.guard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TruncatePipe } from '../customPipes/truncate.pipe';
import { QuantityFormDialogComponent } from './quantity-form-dialog.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductFormDialogComponent,
    CleanProductCodePipe,
    QuantityFormDialogComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: ProductListComponent  },
      { path: ':id', component: ProductDetailComponent },
    ]),
    SharedModule,
    TruncatePipe,
    CardAnimationDirective,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatGridListModule,
    MatBadgeModule,
    MatCheckboxModule
  ],
  exports: [
    CleanProductCodePipe
  ]
})
export class ProductModule { }
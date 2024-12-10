import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CartService } from './cart/cart.service';
import { LoadingService } from './shared/loading-spinner/loading.service';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'fp-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  pageTitle = 'fast-food-project';
  cartCount: number = 0;
  isLoading: Observable<boolean>;

  constructor(
    private cartService: CartService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
      this.cdr.detectChanges(); // Manually trigger change detection
    });

    this.isLoading.subscribe(() => {
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }
}
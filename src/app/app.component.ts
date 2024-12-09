import { Component, OnInit } from '@angular/core';
import { CartService } from './cart/cart.service';
import { LoadingService } from './shared/loading-spinner/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'fp-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit {
  pageTitle = 'fast-food-project';
  cartCount: number = 0;
  isLoading: Observable<boolean>;

  constructor(private cartService: CartService, private loadingService: LoadingService) {
    this.isLoading = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }
}
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CartService } from './cart/cart.service';
import { LoadingService } from './shared/loading-spinner/loading.service';
import { TranslationService } from './shared/translation.service';
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

  pageTitle: string;
  cartCount: number = 0;
  isLoading: Observable<boolean>;

  constructor(
    private cartService: CartService,
    private loadingService: LoadingService,
    public translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading = this.loadingService.loading$;
    this.pageTitle = this.translationService.translate('appComponent', 'pageTitle');
  }

  ngOnInit(): void {
    // Subscribe to cart count changes
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
      this.cdr.detectChanges(); // Manually trigger change detection
    });

    // Subscribe to loading changes
    this.isLoading.subscribe(() => {
      this.cdr.detectChanges(); // Manually trigger change detection
    });

    // Subscribe to language changes
    this.translationService.getLanguageChangeObservable().subscribe(language => {
      if (language === 'ar') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
      this.pageTitle = this.translationService.translate('appComponent', 'pageTitle');
    });
  }

  changeLanguage(): void {
    const currentLanguage = this.translationService.getCurrentLanguage();
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    this.translationService.setLanguage(newLanguage);
  }
}
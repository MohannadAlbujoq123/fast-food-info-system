import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CartService } from './cart/cart.service';
import { LoadingService } from './shared/loading-spinner/loading.service';
import { TranslationService } from './shared/translation.service';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

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
  showManagementMenu: boolean = false;
  isBuyer: boolean = false;
  isAdmin: boolean = false;
  isSeller: boolean = false;

  constructor(
    private cartService: CartService,
    private loadingService: LoadingService,
    public translationService: TranslationService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    private router: Router
  ) {
    this.isLoading = this.loadingService.loading$;
    this.pageTitle = this.translationService.translate('appComponent', 'pageTitle');
  }

  ngOnInit(): void {
    this.isBuyer = this.authService.isBuyer();
    this.isAdmin = this.authService.isAdmin();
    this.isSeller = this.authService.isSeller();
    this.showManagementMenu = this.isAdmin;

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  toggleManagementMenu(): void {
    this.showManagementMenu = !this.showManagementMenu;
  }
}
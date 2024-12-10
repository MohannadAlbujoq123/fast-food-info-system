import { Injectable } from '@angular/core';
import { ArabicProductList } from '../translations/ar/product-list';
import { EnglishProductList } from '../translations/en/product-list';
import { ArabicDashboardComponent } from '../translations/ar/dashboard';
import { EnglishDashboardComponent } from '../translations/en/dashboard';
import { EnglishProductFormDialog } from '../translations/en/product-form-dialog';
import { ArabicProductFormDialog } from '../translations/ar/product-form-dialog';
import { ArabicWelcomeComponent } from '../translations/ar/welcome';
import { EnglishWelcomeComponent } from '../translations/en/welcome';
import { ArabicCartComponent } from '../translations/ar/cart';
import { EnglishCartComponent } from '../translations/en/cart';
import { ArabicProductDetailComponent } from '../translations/ar/product-detail';
import { EnglishProductDetailComponent } from '../translations/en/product-detail';
import { ArabicAutocompleteComponent } from '../translations/ar/autocomplete';
import { EnglishAutocompleteComponent } from '../translations/en/autocomplete';
import { ArabicAppComponent } from '../translations/ar/app';
import { EnglishAppComponent } from '../translations/en/app';

@Injectable({
  providedIn: 'root'
})
export class TranslationLoader {
  private translations: any = {};

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations(): void {
    // Load Arabic translations
    this.translations['ar'] = {
      productList: new ArabicProductList(),
      autocompleteComponent: new ArabicAutocompleteComponent(),
      dashboardComponent: new ArabicDashboardComponent(),
      productFormDialog: new ArabicProductFormDialog(),
      welcomeComponent: new ArabicWelcomeComponent(),
      cartComponent: new ArabicCartComponent(),
      productDetailComponent: new ArabicProductDetailComponent(),
      appComponent: new ArabicAppComponent()
    };

    // Load English translations
    this.translations['en'] = {
      productList: new EnglishProductList(),
      autocompleteComponent: new EnglishAutocompleteComponent(),
      dashboardComponent: new EnglishDashboardComponent(),
      productFormDialog: new EnglishProductFormDialog(),
      welcomeComponent: new EnglishWelcomeComponent(),
      cartComponent: new EnglishCartComponent(),
      productDetailComponent: new EnglishProductDetailComponent(),
      appComponent: new EnglishAppComponent()
    };
  }

  getTranslations(language: string): any {
    return this.translations[language] || {};
  }
}
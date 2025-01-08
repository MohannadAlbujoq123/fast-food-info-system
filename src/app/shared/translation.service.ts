import { Injectable } from '@angular/core';
import { TranslationLoader } from './translation-loader';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: any;
  private currentLanguage!: string;
  private languageChange = new BehaviorSubject<string>('en');

  constructor(private translationLoader: TranslationLoader) {
    // Set default language to English
    this.setLanguage('en');
  }

  setLanguage(language: string): void {
    this.currentLanguage = language;
    this.translations = this.translationLoader.getTranslations(language);
    if (!this.translations) {
      console.error(`Translations for language '${language}' could not be loaded.`);
    }
    this.languageChange.next(language);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getLanguageChangeObservable() {
    return this.languageChange.asObservable();
  }

  translate(component: string, key: string, params?: any): string {
    if (!this.translations) {
      console.error('Translations not loaded.');
      return '';
    }

    const componentTranslations = this.translations[component];
    if (!componentTranslations) {
      console.warn(`Translations for component '${component}' not found.`);
      return `${component}.${key}`; // Return the key itself as a fallback
    }

    let translation = componentTranslations[key];
    if (!translation) {
      console.warn(`Translation for key '${key}' in component '${component}' not found.`);
      return `${component}.${key}`; // Return the key itself as a fallback
    }

    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }

    return translation;
  }
}
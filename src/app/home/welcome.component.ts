import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../shared/translation.service';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  standalone: false,
})
export class WelcomeComponent implements OnInit {
  public pageTitle: string;

  constructor(public translationService: TranslationService) {
    this.pageTitle = this.translationService.translate('welcomeComponent', 'welcome');
  }

  ngOnInit(): void {
    this.translationService.getLanguageChangeObservable().subscribe(() => {
      this.pageTitle = this.translationService.translate('welcomeComponent', 'welcome');
    });
  }
}
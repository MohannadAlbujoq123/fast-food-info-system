import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { PermissionsComponent } from './management/permissions/permissions.component';
import { RolesComponent } from './management/roles/roles.component';
import { UsersComponent } from './management/users/users.component';
import { LoadingInterceptor } from './shared/loading-spinner/loading.interceptor';
import { TranslationService } from './shared/translation.service';
import { ManagementModule } from './management/management.module';
import { AdminGuard } from './auth/admin.guard';
import { ConfigurationService } from './shared/configuration.service';

export function loadConfigurations(configService: ConfigurationService) {
  return () => configService.loadConfigurations();
}

const loadingInterceptorProvider = { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true };

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'management/permissions', component: PermissionsComponent, canActivate: [AdminGuard] },
  { path: 'management/roles', component: RolesComponent, canActivate: [AdminGuard] },
  { path: 'management/users', component: UsersComponent, canActivate: [AdminGuard] },
  { path: 'products', loadChildren: () => import('./products/product.module').then(m => m.ProductModule) },
  { path: 'cart', loadChildren: () => import('./cart/cart.module').then(m => m.CartModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatIconModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatMenuModule,
    ManagementModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  providers: [
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigurations,
      deps: [ConfigurationService],
      multi: true
    },
    TranslationService,
    loadingInterceptorProvider
  ],
  exports: [
    MatSnackBarModule
  ]
})
export class AppModule { }
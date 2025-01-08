import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../auth/admin.guard';

const routes: Routes = [
  { path: '', component: DashboardComponent ,canActivate: [AdminGuard] }
];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
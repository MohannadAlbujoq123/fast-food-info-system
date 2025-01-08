import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { RoleFormDialogComponent } from './roles/role-form-dialog.component';
import { UserFormDialogComponent } from './users/user-form-dialog.component';
import { PermissionFormDialogComponent } from './permissions/permission-form-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    RolesComponent,
    UsersComponent,
    PermissionsComponent,
    RoleFormDialogComponent,
    UserFormDialogComponent,
    PermissionFormDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatGridListModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatExpansionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [
    PermissionsComponent,
    RolesComponent,
    UsersComponent
  ]
})
export class ManagementModule { }
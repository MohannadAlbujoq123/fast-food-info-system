import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from './users.service';
import { IUser } from '../Interfaces/user';
import { IOrder } from '../Interfaces/order';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { UserFormDialogComponent } from './user-form-dialog.component';

@Component({
  selector: 'fp-users',
  templateUrl: './users.component.html',
  standalone: false
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  orders: IOrder[] = [];
  displayedColumns: string[] = ['orderId', 'orderDate', 'totalPrice', 'products'];
  dataSource!: MatTableDataSource<IOrder>;
  currentPage: number = 1;
  totalPages: number = 1;
  currentUserId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usersService: UsersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(data => {
      this.users = data.map(user => {
        const roles = (user.userRoles as any)?.$values;
        user.userRoles = Array.isArray(roles) ? roles : [];
        user.isDisabled = user.isDisabled;
        return user;
      });
    });
  }

  loadOrders(userId: number): void {
    this.currentUserId = userId;
    this.usersService.getOrdersByUser(userId, this.currentPage).subscribe(data => {
      if (Array.isArray(data.orders)) {
        this.orders = data.orders;
        this.totalPages = data.totalPages;
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        console.error('Expected an array of orders but got:', data);
      }
    });
  }

  onPageChange(event: any): void {
    const newPage = event.pageIndex + 1;
    if (newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadOrders(this.currentUserId);
    }
  }

  toggleUserDisabled(userId: number): void {
    this.usersService.disableUser(userId).subscribe(() => {

    });
  }

  createUser(): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '400px',
      data: { operation: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: IUser): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '400px',
      data: { operation: 'edit', user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.deleteUser(id).subscribe(() => {
          this.loadUsers();
        });
      }
    });
  }
}
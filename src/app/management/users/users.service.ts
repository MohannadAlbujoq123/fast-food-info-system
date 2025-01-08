import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { IUser } from '../Interfaces/user';
import { IRole } from '../Interfaces/role';
import { IOrder } from '../Interfaces/order'; 
import { RolesService } from '../roles/roles.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'https://localhost:7088/api/users';
  private ordersApiUrl = 'https://localhost:7088/api/orders';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient, private rolesService: RolesService) {}

  getUsers(): Observable<IUser[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<{ $id: string, $values: IUser[] }>(this.apiUrl, { headers }).pipe(
      map(response => response.$values)
    );
  }

  getUser(id: number): Observable<IUser> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<IUser>(`${this.apiUrl}/${id}`, { headers });
  }

  createUser(user: { userName: string; email: string; password: string; roleId: number }): Observable<IUser> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<IUser>(this.apiUrl, user, { headers });
  }

  updateUser(id: number, user: { userName: string; email: string; password: string; roleId: number }): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.put<void>(`${this.apiUrl}/${id}`, user, { headers });
  }

  deleteUser(id: number): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

 disableUser(userId: number): Observable<void> {
  const token = localStorage.getItem('jwtToken');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  const url = `${this.apiUrl}/${userId}/disable`;
  return this.http.put<void>(url, {}, { headers });
}

  getRoles(): Observable<IRole[]> {
    return this.rolesService.getRoles();
  }

  getUserRoles(userId: number): Observable<IRole[]> {
    return this.getUser(userId).pipe(
      tap(user => {
        console.log('User:', user);
      }),
      switchMap(user => {
        const roleRequests = (user.userRoles || []).map(role => {
          console.log('Requesting role:', role.id);
          return this.rolesService.getRole(role.id);
        });
        return forkJoin(roleRequests);
      })
    );
  }

  getOrdersByUser(userId: number, pageNumber: number = 1): Observable<{ totalPages: number, orders: IOrder[] }> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.ordersApiUrl}/user/${userId}?pageNumber=${pageNumber}`;
    return this.http.get<{ totalPages: number, orders: { $values: IOrder[] } }>(url, { headers }).pipe(
      map(response => ({
        totalPages: response.totalPages,
        orders: response.orders.$values
      }))
    );
  }
}
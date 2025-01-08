import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IUser } from '../management/Interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7088/api/auth'; 
  private token: string | null = null;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    const loginRequest = {
      email: credentials.email,
      password: credentials.password
    };
    console.log('Login Request to Server:', loginRequest); // Log login request to server

    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, loginRequest).pipe(
      map(response => {
        if (response.token) {
          this.token = response.token;
          localStorage.setItem('jwtToken', this.token);
          return { success: true };
        } else {
          return { success: false };
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        return of({ success: false });
      })
    );
  }

  register(user: { userName: string; email: string; password: string; roleId: number }): Observable<IUser> {
    const registerRequest = {
      userName: user.userName,
      email: user.email,
      password: user.password,
      roleId: user.roleId
    };
    console.log('Register Request to Server:', registerRequest); 

    return this.http.post<IUser>(`${this.apiUrl}/register`, registerRequest, this.httpOptions).pipe(
      catchError(this.handleError<IUser>('register'))
    );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  isBuyer(): boolean {
    const user = this.getCurrentUser();
    return user && user.roles.includes('Buyer');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.roles.includes('Admin');
  }

  isSeller(): boolean {
    const user = this.getCurrentUser();
    return user && user.roles.includes('Seller');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCurrentUser(): any {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.email,
        roles: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        id: payload.UserId
      };
    }
    return null;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    if (user) {
      return parseInt(user.id, 10);
    }
    return null;
  }
}
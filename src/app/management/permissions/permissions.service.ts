import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPermission } from '../Interfaces/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private apiUrl = 'https://localhost:7088/api/permissions';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<IPermission[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<{ $id: string, $values: IPermission[] }>(this.apiUrl, { headers }).pipe(
      map(response => response.$values)
    );
  }

  getPermission(id: number): Observable<IPermission> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IPermission>(`${this.apiUrl}/${id}`, { headers });
  }

  createPermission(permission: { permissionName: string }): Observable<IPermission> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);

    return this.http.post<IPermission>(this.apiUrl, permission, { headers });
  }

  updatePermission(id: number, permission: { permissionName: string }): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);

    return this.http.put<void>(`${this.apiUrl}/${id}`, permission, { headers });
  }

  deletePermission(id: number): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
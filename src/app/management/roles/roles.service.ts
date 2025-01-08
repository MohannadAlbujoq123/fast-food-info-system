import { map, Observable } from "rxjs";
import { IRole } from "../Interfaces/role";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'https://localhost:7088/api/roles';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getRoles(): Observable<IRole[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<IRole[]>(this.apiUrl, { headers });
  }

  getRole(id: number): Observable<IRole> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<IRole>(`${this.apiUrl}/${id}`, { headers });
  }

  createRole(role: { roleName: string; rolePermissions: number[] }): Observable<IRole> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<IRole>(this.apiUrl, role, { headers });
  }

  updateRole(id: number, role: { roleName: string; rolePermissions: number[] }): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.put<void>(`${this.apiUrl}/${id}`, role, { headers });
  }

  deleteRole(id: number): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getPermissions(): Observable<any[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<{ $id: string, $values: any[] }>('https://localhost:7088/api/permissions', { headers }).pipe(
      map(response => response.$values)
    );
  }

  addPermissionToRole(roleId: number, permissionId: number): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`, {}, { headers });
  }

  removePermissionFromRole(roleId: number, permissionId: number): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`, { headers });
  }
}
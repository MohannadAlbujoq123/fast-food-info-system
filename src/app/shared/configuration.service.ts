import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Configuration } from './configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private configurations: Configuration[] = [];

  constructor(private http: HttpClient) {}

  loadConfigurations(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>('https://localhost:7088/api/configurations').pipe(
      tap(configurations => this.configurations = configurations),
      catchError(this.handleError)
    );
  }

  getConfigurations(): Configuration[] {
    return this.configurations;
  }

  getConfigurationByName(name: string): Configuration | undefined {
    return this.configurations.find(config => config.name === name);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }
}
// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private minimumDisplayTime = 200; 

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    setTimeout(() => {
      this.loadingSubject.next(false);
    }, this.minimumDisplayTime);
  }
}
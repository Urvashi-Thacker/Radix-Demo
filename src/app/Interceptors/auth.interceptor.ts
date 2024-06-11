import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var authToken = this.getToken();

    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return next.handle(authReq);
  }

  getToken(): string | null {
    debugger
    const platformId = inject(PLATFORM_ID);
    const token = isPlatformBrowser(platformId) ? localStorage.getItem('JWT_TOKEN') : null;
    return token;
  }
}
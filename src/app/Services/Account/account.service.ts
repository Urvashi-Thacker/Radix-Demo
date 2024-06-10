import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private loggedinUser?: string;
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private httpClient = inject(HttpClient);
  private route = inject(Router);

  constructor() { }

  login(user: { email: string, password: string }): Observable<any> {
    debugger
    return this.httpClient.post<any>('https://localhost:7071/Account/Login', user).pipe(tap(v => this.userLogin(user.email, v)))
  }

  userLogin(email: string, token: any) {
    debugger
    this.loggedinUser = email;
    this.storeJWT(token.token);
    this.isAuthenticatedSubject.next(true);
  }

  storeJWT(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
  }
  isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN) && !this.isTokenExpired();
  }
  isTokenExpired() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if (!token) return true;

    const decodedToken = jwtDecode(token);
    let expiry = decodedToken.exp! * 1000;
    return expiry < new Date().getTime();
  }
}


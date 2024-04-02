import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../models/register-request';
import { AuthResponse } from '../../models/auth-response';
import { AuthRequest } from '../../models/auth-request';
import { VerifyRequest } from '../../models/verify-request';
import { TwoFaRequest } from '../../models/two-fa-request';
import { TwoFaResponse } from '../../models/two-fa-response';
import { AuthTfaRequest } from '../../models/auth-tfa-request';
import { AuthTfaResponse } from '../../models/auth-tfa-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7126/Api/Auth';

  constructor(private http: HttpClient, private router: Router) { }

  register(registerRequest: RegisterRequest) {
    console.log(registerRequest);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest);
  }

  login(
    authRequest: AuthRequest
  ) {
    return this.http.post<AuthResponse>
    (`${this.apiUrl}/login`, authRequest);
  }
  loginTfa(authTfaRequest: AuthTfaRequest) {
    return this.http.post<AuthTfaResponse>(`${this.apiUrl}/login/tfa`, authTfaRequest);
  }

  enable2fa() {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<{}>
    (`${this.apiUrl}/get-tfa`, {}, { headers });
  }
/*
  enable2fa() {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<{}>
    (`${this.apiUrl}/enable-tfa`,{}, { headers });
  }*/


  store2fa(verifyRequest: VerifyRequest){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>
    (`${this.apiUrl}/store-tfa`, verifyRequest, { headers });
  }
  disable2fa() {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>
    (`${this.apiUrl}/disable-tfa`, {} , { headers });
  }
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('login');
    //this will clear refrsh token from cookies
    document.cookie = "refresh=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }

  
  isCookiePresent(cookieName: string): boolean {
    return document.cookie.includes(`refresh`);
  }
  
}

import { HttpClient } from '@angular/common/http';
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

  verifyCode(verificationRequest: VerifyRequest) {
    return this.http.post<AuthResponse>
    (`${this.apiUrl}/verify`, verificationRequest);
  }

  enable2fa(twoFaRequest: TwoFaRequest) {
    return this.http.post<TwoFaResponse>
    (`${this.apiUrl}/enable-tfa`, twoFaRequest);
  }
  disable2fa(twoFaRequest: TwoFaRequest) {
    return this.http.post<string>
    (`${this.apiUrl}/disable-tfa`, twoFaRequest);
  }
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

  setRefreshToken() {
    return this.http.post(`${this.apiUrl}/refresh-token`, {});
  }
  isCookiePresent(cookieName: string): boolean {
    return document.cookie.includes(`refreshToken`);
  }
  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../models/register-request';
import { AuthResponse } from '../../models/auth-response';
import { AuthRequest } from '../../models/auth-request';
import { VerifyRequest } from '../../models/verify-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = ''

  constructor(private http: HttpClient) { }

  register(registerRequest: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest);
  }

  login(
    authRequest: AuthRequest
  ) {
    return this.http.post<AuthResponse>
    (`${this.apiUrl}/authenticate`, authRequest);
  }

  verifyCode(verificationRequest: VerifyRequest) {
    return this.http.post<AuthResponse>
    (`${this.apiUrl}/verify`, verificationRequest);
  }
}

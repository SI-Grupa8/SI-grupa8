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
import { BehaviorSubject, Observable, interval, takeWhile, tap } from 'rxjs';
import { UserRequest } from '../../models/user-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userRole: string | undefined= '';


  user : BehaviorSubject<UserRequest | null> = new BehaviorSubject<UserRequest | null>(null)

  private apiUrl = 'https://vehicle-tracking-system-dev-api.azurewebsites.net/api/Auth';
  private apiUserUrl = 'https://vehicle-tracking-system-dev-api.azurewebsites.net/api/User'
  //private apiUrl = 'https://localhost:7126/api/Auth';

  //private apiShorterUrl = 'https://localhost:7126/Api';

  constructor(private http: HttpClient, private router: Router) { 
    this.userRole = localStorage.getItem('role') as string;
  }

  register(registerRequest: RegisterRequest) {
    console.log(registerRequest);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest);
  }

  login(
    authRequest: AuthRequest
  ) {
    return this.http.post<AuthResponse>
    (`${this.apiUrl}/login`, authRequest).pipe(
      tap(response => {
        localStorage.setItem('role', response.role as string);
        this.userRole = response.role;
        console.log("Role:" + this.userRole);
      })
    )
    
    /*.subscribe(response => {
      this.userRole = response.role;
      console.log("Role:" + this.userRole);
    })*/
  }

  getCurrentUser():Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUserUrl}/get-current-user`, { headers });
  }

  loginTfa(authTfaRequest: AuthTfaRequest) {
    return this.http.post<AuthTfaResponse>
    (`${this.apiUrl}/login/tfa`, authTfaRequest).pipe(
      tap(response => {
        this.userRole = response.role;
        console.log("Role:" + this.userRole);
      })
    )
    
    /*.subscribe(response => {
      this.userRole = response.role;
      console.log("Role:" + this.userRole);
    })*/
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
  getRole() {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<{}>
    (`${this.apiShorterUrl}/User`, {}, { headers });
  }
*/




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

  isAdmin(): boolean {
    return this.userRole == 'Admin';
  }
  isSuperAdmin(): boolean {
    return this.userRole == 'SuperAdmin';
  }
  setUserRole(role: string | undefined) {
    this.userRole = role;
  }

  getUserRole(): string | undefined {
    return this.userRole;
  }

  clearUserRole() {
    this.userRole = undefined;
  }
  
  isCookiePresent(): boolean {
    return document.cookie.includes(`refresh`);
  }
  startTokenExpiryCheck() {
    interval(60000) // Check every minute
      .pipe(takeWhile(() => true)) // Continue indefinitely
      .subscribe(() => {
        if(!this.isCookiePresent())
          this.logout();
      });
  }
  
}

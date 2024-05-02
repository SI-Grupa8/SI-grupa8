import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRequest } from '../../models/user-request';
import { ChangePasswordRequest } from '../../models/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 // private apiUrl = 'https://vehicle-tracking-system-dev-api.azurewebsites.net/api'
  private apiUrl = 'https://localhost:7126/api';

  constructor(private http: HttpClient) { }


  addUser(request: UserRequest): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/User/add-user`, request, { headers });
  }

  updateUser(request: UserRequest): Observable<any>{
    console.log(request)
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/User/update-user`, request, { headers });
  }
  deleteUser(userId: number):Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/User/remove-user/${userId}`, {headers});

  }
  getCompanyUsers(companyId : number):Observable<any[]>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return  this.http.get<any[]>(`${this.apiUrl}/Company/get-company-users/${companyId}` , { headers });
  }
  getUser():Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
return this.http.get<any>(`${this.apiUrl}/User/get-current-user`, {headers});
  }

  getAllAdminsWithoutCompany() : Observable<any[]>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/User/get-admins-without-company`, {headers});
  }

//FIX THIS - PRIORITYYYYYYY
  changeEmail(request: UserRequest): Observable<any>{
    //console.log(request)
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/User/change-email`, request, { headers });
  }

  changePhoneNumber(request: UserRequest): Observable<any>{
    //console.log(request)
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/User/change-phone-number`, request, { headers });
  }

  getDispatchersForNewDevice(companyId : number ) : Observable<any[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/User/get-dispatchers-new-device/${companyId}`, {headers});
  }
  
  changePassword(request: ChangePasswordRequest): Observable<any>{
    console.log(request)
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/User/change-password`, request, { headers });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRequest } from '../../models/user-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7126/Api'

  constructor(private http: HttpClient) { }

  addUser(request: UserRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-user`, request);
  }

  updateUser(request:UserRequest, userId: number):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/update-user/${userId}`,request);
  }
  deleteUser(userId: number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/remove-user/${userId}`);

  }
  getCompanyUsers():Observable<any[]>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return  this.http.get<any[]>(`${this.apiUrl}/Company/get-company-users` , { headers });
  }
}

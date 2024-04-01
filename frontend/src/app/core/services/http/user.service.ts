import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRequest } from '../../models/user-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7126/Api/Admin'

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
  getCompanyUsers(adminId:number):Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/get-company-users/${adminId}`);
  }
}

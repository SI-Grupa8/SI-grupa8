import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyRequest } from '../../models/company-request';
import { CompanyResponse } from '../../models/company-response';
import { UserRequest } from '../../models/user-request';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  //apiUrl = 'https://vehicle-tracking-system-dev-api.azurewebsites.net/api'
  apiUrl = 'http://localhost:7126/api';

  constructor(private http: HttpClient) { }

  createCompany(request: CompanyRequest, adminId : number=0): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/Company/add-company?adminId=${adminId}`, request, {headers});
  }

  getCompanies():Observable<any[]>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<CompanyResponse[]>(`${this.apiUrl}/Company/get-all-companies`, {headers});
  }

  editCompany(request: CompanyRequest): Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/Company/update-company`, request,{headers});
  }
  getCompanyById(id: number):Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<CompanyResponse>(`${this.apiUrl}/Company/get-company-by-id/${id}`,{headers});
  }
  getCompanyUsers(id: number):Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UserRequest>(`${this.apiUrl}/Company/get-company-users/${id}`,{headers});
  }
  deleteCompany(id: number): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/Company/remove-company/${id}`,{headers});
  }
  getStatistics(id: number): Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/Company/get-statistics/${id}`,{headers});
  }
}

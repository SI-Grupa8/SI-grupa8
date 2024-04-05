import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyRequest } from '../../models/company-request';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'https://vehicle-tracking-system-dev-api.azurewebsites.net/api'

  constructor(private http: HttpClient) { }

  createCompany(request: CompanyRequest): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/Company/add-company`, request, {headers});
  }
  getCompanies():Observable<any[]>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/Company/get-all-companies`, {headers});
  }
}

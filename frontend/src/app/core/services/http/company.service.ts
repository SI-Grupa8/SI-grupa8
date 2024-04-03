import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyRequest } from '../../models/company-request';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'https://localhost:7126/Api/Admin'

  constructor(private http: HttpClient) { }

  createCompany(request: CompanyRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-company`, request);
  }
  getCompanies(adminId:number):Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/get-all-companies/${adminId}`);
  }
}

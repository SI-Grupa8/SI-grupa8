import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceRequest } from '../../models/device-request';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'https://localhost:7126/Api'

  constructor(private http: HttpClient) { }

  createDevice(request: DeviceRequest): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/Device/add-device`, request, {headers});
  }

  updateDevice(request:DeviceRequest, deviceId: number):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/update-device/${deviceId}`,request);
  }
  deleteDevice(adminId: number, deviceId: number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/remove-device/${deviceId}`);

  }
  getCompanyDevices():Observable<any[]>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/Device/get-company-devices`, {headers});
  }
}

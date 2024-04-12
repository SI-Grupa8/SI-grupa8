import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceRequest } from '../../models/device-request';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'https://vehicle-tracking-system-dev-api.azurewebsites.net/api'
  //private apiUrl = 'https://localhost:7126/api';

  constructor(private http: HttpClient) { }

  createDevice(request: DeviceRequest): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/Device/add-device`, request, {headers});
  }

  updateDevice(request:DeviceRequest):Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/Device/update-device`,request, {headers});
  }
  deleteDevice(deviceId: number):Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/Device/remove-device/${deviceId}`, {headers});

  }
  getCompanyDevices(companyId : number):Observable<any[]>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/Device/get-company-devices/${companyId}`, {headers});
  }

  getDeviceTypes() : Observable<any[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/DeviceType/get-all`, {headers});
  }

  getFilteredDevices(filters : number[]) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = new URLSearchParams();
    filters.forEach(x => {
      params.append("deviceTypeIDs", x.toString())
    })

    return this.http.get<any[]>(`${this.apiUrl}/Device/get-company-devices-v1?${params.toString()}`, {headers});
  }

}

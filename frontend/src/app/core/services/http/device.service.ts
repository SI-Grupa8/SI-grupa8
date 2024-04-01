import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceRequest } from '../../models/device-request';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'https://localhost:7126/Api/Admin'

  constructor(private http: HttpClient) { }

  createDevice(request: DeviceRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-device`, request);
  }

  updateDevice(request:DeviceRequest, deviceId: number):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/update-device/${deviceId}`,request);
  }
  deleteDevice(adminId: number, deviceId: number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/remove-device/${deviceId}`);

  }
  getCompanyDevices(adminId:number):Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/get-company-devices/${adminId}`);
  }
}

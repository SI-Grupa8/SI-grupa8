import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceRequest } from '../../models/device-request';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  //private apiUrl = 'https://vehicle-tracking-system-dev-api.azurewebsites.net/api'
  private apiUrl = 'https://localhost:7126/api';

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

  getFilteredDevices(deviceTypeIds: number[], devices: string[], deviceIds: number[]) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    if (deviceTypeIds && deviceTypeIds.length > 0) {
      params = params.set('DeviceTypeIds', deviceTypeIds.join(','));
    }
    if (devices && devices.length > 0) {
      params = params.set('Devices', devices.join(','));
    }
    if (deviceIds && deviceIds.length > 0) {
      params = params.set('DeviceIds', deviceIds.join(','));
    }

    return this.http.get<any[]>(`${this.apiUrl}/Device/get-company-devices-v1`, { headers: headers, params: params });
  }

}

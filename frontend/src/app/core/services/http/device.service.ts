import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DeviceRequest } from '../../models/device-request';
import { DateRequest } from '../../models/date-request';
import { LocationStorage } from '../../models/location-storage';

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

  getFilteredDevices(deviceTypeIds: number[], deviceIds: number[]): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Prepare the payload
    const payload = {
      deviceTypeIds: deviceTypeIds,
      deviceIds: deviceIds
    };

    // Make the POST request
    return this.http.post<any[]>(`${this.apiUrl}/Device/get-company-devices-v1`, payload, { headers: headers });
  }

  getDeviceLocations(deviceId: number):Observable<any[]>{
    if (!deviceId || deviceId === 0) {
      console.error('Invalid device IDDDDD:', deviceId);
      return of([]);
    }
    console.log("ovdje"+deviceId);
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/LocationStorage/get-device-locations/${deviceId}`, {headers});
  }

  getDateTimeStamps(date: DateRequest):Observable<LocationStorage[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any[]>(`${this.apiUrl}/DeviceLocation/locations-filter`, date, { headers });
  }
}

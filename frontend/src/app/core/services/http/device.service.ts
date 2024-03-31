import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceRequest } from '../../models/device-request';
import { DeviceResponse } from '../../models/device-response';
import { UpdateDeviceRequest } from '../../models/update-device-request';
import { DeleteDeviceRequest } from '../../models/delete-device-request';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'https://localhost:7126/Api/Device'

  constructor(private http: HttpClient) { }

  createDevice(request: DeviceRequest): Observable<DeviceResponse> {
    return this.http.post<DeviceResponse>(`${this.apiUrl}/add-device`, request);
  }

  updateDevice(request:UpdateDeviceRequest):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/update-device`,request);
  }
  deleteDevice(request:DeleteDeviceRequest):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/remove-device`,{ body: request });

  }
  getCompanyDevices(request:DeviceRequest):Observable<DeviceResponse[]>{
    return this.http.get<DeviceResponse[]>(`${this.apiUrl}/get-company-devices`,{ params: request as any });
  }
}

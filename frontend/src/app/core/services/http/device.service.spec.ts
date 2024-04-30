import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeviceService } from './device.service';
import { DeviceRequest } from '../../models/device-request';
import { LocationStorage } from '../../models/location-storage';
import { CompanyResponse } from '../../models/company-response';

describe('DeviceService', () => {
  let service: DeviceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeviceService]
    });
    service = TestBed.inject(DeviceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a device', () => {
    const testDeviceRequest: DeviceRequest = {  };
    const testResponse = {  };

    service.createDevice(testDeviceRequest).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Device/add-device`);
    expect(request.request.method).toBe('POST');
    request.flush(testResponse);
  });

  it('should update a device', () => {
    const testDeviceRequest: DeviceRequest = { };
    const testResponse = {  };

    service.updateDevice(testDeviceRequest).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Device/update-device`);
    expect(request.request.method).toBe('PUT');
    request.flush(testResponse);
  });

  it('should delete a device', () => {
    const testDeviceId = 123;

    service.deleteDevice(testDeviceId).subscribe();

    const request = httpMock.expectOne(`${service.apiUrl}/Device/remove-device/${testDeviceId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });

  it('should get devices for a company', () => {
    const testCompanyId = 123;
    const testResponse: CompanyResponse[] = [];

    service.getCompanyDevices(testCompanyId).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Device/get-company-devices/${testCompanyId}`);
    expect(request.request.method).toBe('GET');
    request.flush(testResponse);
  });

  it('should get device types', () => {
    const testResponse: CompanyResponse[] = [];

    service.getDeviceTypes().subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/DeviceType/get-all`);
    expect(request.request.method).toBe('GET');
    request.flush(testResponse);
  });

  it('should get filtered devices', () => {
    const testDeviceTypeIds = [1, 2, 3];
    const testDeviceIds = [4, 5, 6];
    const testPayload = {
      deviceTypeIds: testDeviceTypeIds,
      deviceIds: testDeviceIds
    };
    const testResponse: DeviceRequest[] = [];

    service.getFilteredDevices(testDeviceTypeIds, testDeviceIds).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Device/get-company-devices-v1`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(testPayload);
    request.flush(testResponse);
  });

  it('should get device locations', () => {
    const testDeviceId = 123;
    const testResponse: any[] = [ ];

    service.getDeviceLocations(testDeviceId).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/LocationStorage/get-device-locations/${testDeviceId}`);
    expect(request.request.method).toBe('GET');
    request.flush(testResponse);
  });

  it('should get date time stamps', () => {
    const testDate = { };
    const testDeviceId = 123;
    const testResponse: any[] = [  ];

    service.getDateTimeStamps(testDate, testDeviceId).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/DeviceLocation/locations-filter?deviceId=${testDeviceId}`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(testDate);
    request.flush(testResponse);
  });
});
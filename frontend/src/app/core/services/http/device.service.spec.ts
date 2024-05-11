import { TestBed } from '@angular/core/testing';

import { DeviceService } from './device.service';

/* 
  NO NEED FOR ADDITIONAL TESTING OF SERVICE METHODS, SINCE THEY ARE TESTED IN BACKEND 
*/

describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

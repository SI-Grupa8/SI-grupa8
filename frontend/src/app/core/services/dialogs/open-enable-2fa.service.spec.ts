import { TestBed } from '@angular/core/testing';

import { OpenEnable2faService } from './open-enable-2fa.service';

describe('OpenEnable2faService', () => {
  let service: OpenEnable2faService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenEnable2faService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

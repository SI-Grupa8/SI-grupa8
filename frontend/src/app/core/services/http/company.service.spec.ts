import { TestBed } from '@angular/core/testing';

import { CompanyService } from './company.service';

/* 
  NO NEED FOR ADDITIONAL TESTING OF SERVICE METHODS, SINCE THEY ARE TESTED IN BACKEND 
*/

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

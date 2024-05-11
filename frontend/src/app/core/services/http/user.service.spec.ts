import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

/* 
  NO NEED FOR ADDITIONAL TESTING OF SERVICE METHODS, SINCE THEY ARE TESTED IN BACKEND 
*/

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserRequest } from '../../models/user-request';
import { ChangePasswordRequest } from '../../models/change-password-request';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a user', () => {
    const testUserRequest: UserRequest = {  };
    const testResponse = {  };

    service.addUser(testUserRequest).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/User/add-user`);
    expect(request.request.method).toBe('POST');
    request.flush(testResponse);
  });

  it('should update a user', () => {
    const testUserRequest: UserRequest = {  };
    const testResponse = {  };

    service.updateUser(testUserRequest).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/User/update-user`);
    expect(request.request.method).toBe('PUT');
    request.flush(testResponse);
  });

  it('should delete a user', () => {
    const testUserId = 123;

    service.deleteUser(testUserId).subscribe();

    const request = httpMock.expectOne(`${service.apiUrl}/User/remove-user/${testUserId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });

});
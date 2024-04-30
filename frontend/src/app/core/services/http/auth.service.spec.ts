import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterRequest } from '../../models/register-request';
import { AuthRequest } from '../../models/auth-request';
import { AuthTfaRequest } from '../../models/auth-tfa-request';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const testRegisterRequest: RegisterRequest = {};
    const testResponse = {};

    service.register(testRegisterRequest).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/register`);
    expect(request.request.method).toBe('POST');
    request.flush(testResponse);
  });

  it('should log in a user', () => {
    const testAuthRequest: AuthRequest = {};
    const testResponse = {};

    service.login(testAuthRequest).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/login`);
    expect(request.request.method).toBe('POST');
    request.flush(testResponse);
  });


  it('should get current user', () => {
    const testResponse = {};

    service.getCurrentUser().subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUserUrl}/get-current-user`);
    expect(request.request.method).toBe('GET');
    request.flush(testResponse);
  });

  it('should log in with TFA', () => {
    const testAuthTfaRequest: AuthTfaRequest = {};
    const testResponse = {};

    service.loginTfa(testAuthTfaRequest).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/login/tfa`);
    expect(request.request.method).toBe('POST');
    request.flush(testResponse);
  });
  
});

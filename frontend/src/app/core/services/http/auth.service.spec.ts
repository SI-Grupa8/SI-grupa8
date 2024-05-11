import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        {
          provide: HttpClient,
          useValue: jasmine.createSpyObj('HttpClient', ['post', 'get'])
        }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set user role from local storage on initialization', () => {
    const role = 'Admin';
    localStorage.setItem('role', role);

    service = new AuthService(TestBed.inject(HttpClient), TestBed.inject(Router)); // Provide HttpClient
    expect(service.getUserRole()).toBe(role);
  });

  it('should set user role via setUserRole method', () => {
    const role = 'User';
    service.setUserRole(role);
    expect(service.getUserRole()).toBe(role);
  });

  it('should clear user role via clearUserRole method', () => {
    service.setUserRole('Admin');
    service.clearUserRole();
    expect(service.getUserRole()).toBeUndefined();
  });

  it('should determine if user is admin', () => {
    service.setUserRole('Admin');
    expect(service.isAdmin()).toBe(true);

    service.setUserRole('User');
    expect(service.isAdmin()).toBe(false);
  });

  it('should determine if user is super admin', () => {
    service.setUserRole('SuperAdmin');
    expect(service.isSuperAdmin()).toBe(true);

    service.setUserRole('Admin');
    expect(service.isSuperAdmin()).toBe(false);
  });


});

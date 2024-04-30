import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompanyService } from './company.service';
import { CompanyResponse } from '../../models/company-response';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyService]
    });
    service = TestBed.inject(CompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a company', () => {
    const testRequest = { };
    const testResponse = { };

    service.createCompany(testRequest).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Company/add-company`);
    expect(request.request.method).toBe('POST');
    request.flush(testResponse);
  });

  it('should get all companies', () => {
    const testResponse: CompanyResponse[] = [];

    service.getCompanies().subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Company/get-all-companies`);
    expect(request.request.method).toBe('GET');
    request.flush(testResponse);
  });

  it('should edit a company', () => {
    const testRequest = {};
    const testResponse = { };

    service.editCompany(testRequest).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Company/update-company`);
    expect(request.request.method).toBe('PUT');
    request.flush(testResponse);
  });

  it('should get a company by ID', () => {
    const testId = 123;
    const testResponse = {};

    service.getCompanyById(testId).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Company/get-company-by-id/${testId}`);
    expect(request.request.method).toBe('GET');
    request.flush(testResponse);
  });

  it('should get company users', () => {
    const testId = 123;
    const testResponse: CompanyResponse[] = [  ];

    service.getCompanyUsers(testId).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Company/get-company-users/${testId}`);
    expect(request.request.method).toBe('GET');
    request.flush(testResponse);
  });

  it('should delete a company', () => {
    const testId = 123;

    service.deleteCompany(testId).subscribe();

    const request = httpMock.expectOne(`${service.apiUrl}/Company/remove-company/${testId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });

  it('should get company statistics', () => {
    const testId = 123;
    const testResponse = {  };

    service.getStatistics(testId).subscribe(response => {
      expect(response).toEqual(testResponse);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/Company/get-statistics/${testId}`);
    expect(request.request.method).toBe('GET');
    request.flush(testResponse);
  });
});
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { UserRequest } from '../../models/user-request';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://localhost:7126/api'; // Mock apiUrl

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: 'apiUrl', useValue: apiUrl } // Provide mock apiUrl
      ]
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

  it('should add user', () => {
    const request: UserRequest = {
      name: 'John',
      surname: 'Doe',
      email: 'user1@gmail.com',
      password: '12345678',
      roleID: 3,
      companyID: 1
    };
  
    service.addUser(request).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpMock.expectOne(`${apiUrl}/User/add-user`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ /* provide a mock response */ });
  });
  

  it('should update user', () => {
    const request: UserRequest = { /* provide valid user request data */ };

    service.updateUser(request).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/User/update-user`); // Use mock apiUrl
    expect(req.request.method).toBe('PUT');
    req.flush({ /* provide a mock response */ });
  });

  it('should delete user', () => {
    const userId = 123;

    service.deleteUser(userId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/User/remove-user/${userId}`); // Use mock apiUrl
    expect(req.request.method).toBe('DELETE');
    req.flush({ /* provide a mock response */ });
  });

  it('should get company users', () => {
    service.getCompanyUsers().subscribe(users => {
      expect(users).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/Company/get-company-users`); // Use mock apiUrl
    expect(req.request.method).toBe('GET');
    req.flush({ /* provide a mock response */ });
  });

  it('should get current user', () => {
    service.getUser().subscribe(user => {
      expect(user).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/User/get-current-user`); // Use mock apiUrl
    expect(req.request.method).toBe('GET');
    req.flush({ /* provide a mock response */ });
  });

  it('should get all admins without company', () => {
    service.getAllAdminsWithoutCompany().subscribe(admins => {
      expect(admins).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/User/get-admins-without-company`); // Use mock apiUrl
    expect(req.request.method).toBe('GET');
    req.flush({ /* provide a mock response */ });
  });
});

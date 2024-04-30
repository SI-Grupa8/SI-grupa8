import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should return true and not navigate when token is present', () => {
    localStorage.setItem('token', 'dummy-token');
    
    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    const canActivate = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    expect(router.navigate).not.toHaveBeenCalled();
    expect(canActivate).toBe(true);
  });

  it('should return false and navigate to login when token is not present', () => {
    localStorage.clear();

    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    const canActivate = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    expect(router.navigate).toHaveBeenCalledWith(['login']);
    expect(canActivate).toBe(false);
  });
});
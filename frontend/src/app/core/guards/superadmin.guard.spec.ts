import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { superadminGuard } from './superadmin.guard';

describe('superadminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => superadminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

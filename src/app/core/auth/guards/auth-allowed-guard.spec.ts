import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authAllowedGuard } from './auth-allowed-guard';

describe('authAllowedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authAllowedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

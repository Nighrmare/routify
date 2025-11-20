import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  const createMockContext = (user: any = null): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext);

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockContext({ role: 'user' });
    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should throw if user is not authenticated', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const context = createMockContext(null);
    expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw if user does not have required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const context = createMockContext({ role: 'user' });
    expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow access if user has required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const context = createMockContext({ role: 'admin' });
    expect(rolesGuard.canActivate(context)).toBe(true);
  });
});
import { JwtAuthGuard } from './jwt.guard';

describe('JwtAuthGuard', () => {
  it('should be defined and constructable', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
    expect(typeof guard.canActivate).toBe('function'); 
  });
});
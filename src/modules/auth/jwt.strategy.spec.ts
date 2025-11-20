import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    const mockConfig = {
      get: (key: string) => {
        if (key === 'JWT_SECRET_KEY') return 'test-secret';
        return null;
      },
    };
    strategy = new JwtStrategy(mockConfig as ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate a JWT payload', async () => {
    const payload = { sub: 'abc123', email: 'test@example.com', role: 'user' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({
      userId: 'abc123',
      email: 'test@example.com',
      role: 'user',
    });
  });
});

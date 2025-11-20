import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthModule', () => {
  const userRepoMock = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const getConfigMock = jest.fn();

  const providersOverride = () => ({
    get: getConfigMock,
  });

  const loadModule = async () =>
    await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(ConfigService)
      .useValue(providersOverride())
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepoMock)
      .compile();

  it('should compile the module (branch: JWT_EXPIRES_IN provided)', async () => {
    getConfigMock.mockImplementation((key: string) => {
      if (key === 'JWT_SECRET_KEY') return 'test-secret';
      if (key === 'JWT_EXPIRES_IN') return '5m';
      return null;
    });

    const module = await loadModule();

    expect(module).toBeDefined();

    const jwt = module.get(JwtService);
    expect(jwt).toBeDefined();
  });

  it('should compile the module (branch: JWT_EXPIRES_IN fallback)', async () => {
    getConfigMock.mockImplementation((key: string) => {
      if (key === 'JWT_SECRET_KEY') return 'test-secret';
      if (key === 'JWT_EXPIRES_IN') return undefined;
      return null;
    });

    const module = await loadModule();

    expect(module).toBeDefined();
  });

  it('should provide providers and controllers', async () => {
    getConfigMock.mockImplementation(() => '1h');

    const module = await loadModule();

    expect(module.get(AuthService)).toBeDefined();
    expect(module.get(AuthController)).toBeDefined();
    expect(module.get(JwtStrategy)).toBeDefined();
    expect(module.get(JwtService)).toBeDefined();
  });
});

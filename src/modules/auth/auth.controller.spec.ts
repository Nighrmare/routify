/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { LoginDTO } from 'src/dto/login.dto';
import { UserRole } from 'src/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            id: 'abc123',
            email: 'test@example.com',
            name: 'Test',
            role: UserRole.USER,
          };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/register (POST) should register a user', async () => {
    const dto: CreateUserDTO = {
      email: 'test@example.com',
      password: '123456',
      name: 'Test',
      role: UserRole.USER,
    };

    authService.register.mockResolvedValue({
      message: 'User successfully registered',
      user: { id: 'abc123', email: dto.email },
    });

    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(dto)
      .expect(201);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(res.body).toEqual({
      message: 'User successfully registered',
      user: { id: 'abc123', email: dto.email },
    });
  });

  it('/api/auth/login (POST) should return access token', async () => {
    const dto: LoginDTO = { email: 'test1@example.com', password: '123456' };

    authService.login.mockResolvedValue({ accessToken: 'mocked-token' });

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(dto)
      .expect(201);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(res.body).toEqual({ accessToken: 'mocked-token' });
  });

  it('/api/auth/profile (GET) should return user profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .expect(200);

    expect(res.body).toEqual({
      id: 'abc123',
      email: 'test@example.com',
      name: 'Test',
      role: UserRole.USER,
    });
  });
});

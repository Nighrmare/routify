/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsException } from 'src/common/exceptions/routify.exception';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: any;
  let jwtService: any;

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a user and return minimal info', async () => {
    const dto = { email: 'test@example.com', password: '123456', name: 'Test' };
    const hashed = await bcrypt.hash(dto.password, 10);
    const createdUser = { id: 'abc123', email: dto.email, password: hashed };

    userRepo.findOne.mockResolvedValue(null);
    userRepo.create.mockReturnValue(createdUser);
    userRepo.save.mockResolvedValue(createdUser);

    const result = await service.register(dto);

    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { email: dto.email },
    });
    expect(userRepo.create).toHaveBeenCalledWith({
      ...dto,
      password: expect.any(String),
    });
    expect(result).toEqual({
      message: 'User successfully registered',
      user: { id: 'abc123', email: 'test@example.com' },
    });
  });

  it('should throw BadRequestException if email already exists', async () => {
    const dto = { email: 'test@example.com', password: '123456', name: 'Test' };
    const existingUser = { id: 'existing-id', email: dto.email };

    userRepo.findOne.mockResolvedValue(existingUser);

    await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    await expect(service.register(dto)).rejects.toThrow(
      'Email already exists.',
    );
  });

  it('should return access token on valid login', async () => {
    const dto = { email: 'test@example.com', password: '123456' };
    const user = {
      id: 'abc1234',
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      name: 'Test',
      role: 'user',
    };

    userRepo.findOne.mockResolvedValue(user);
    jwtService.signAsync.mockResolvedValue('mocked-token');

    const result = await service.login(dto);

    expect(result).toEqual({ accessToken: 'mocked-token' });
  });

  it('should throw InvalidCredentialsException if user not found', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(
      service.login({ email: 'x@example.com', password: '123' }),
    ).rejects.toThrow(InvalidCredentialsException);
  });

  it('should throw InvalidCredentialsException if password is incorrect', async () => {
    const dto = { email: 'test@example.com', password: 'wrongpass' };
    const user = {
      id: 'abc123',
      email: dto.email,
      password: await bcrypt.hash('correctpass', 10),
      name: 'Test',
      role: 'user',
    };

    userRepo.findOne.mockResolvedValue(user);

    await expect(service.login(dto)).rejects.toThrow(
      InvalidCredentialsException,
    );
  });
});

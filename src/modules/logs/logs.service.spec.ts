/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LogEntry } from 'src/entities/log.entity';
import { User } from 'src/entities/user.entity';

describe('LogsService', () => {
  let service: LogsService;
  let logRepo: Repository<LogEntry>;
  let userRepo: Repository<User>;

  const mockLogRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getRepositoryToken(LogEntry),
          useValue: mockLogRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
    logRepo = module.get(getRepositoryToken(LogEntry));
    userRepo = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('Should return the user ID if the user exists', async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 10 });

    const result = await service.findUserIdByEmail('test@example.com');

    expect(result).toBe(10);
    expect(mockUserRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: ['id'],
    });
  });

  it('Should return null if the email is not found', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);

    const result = await service.findUserIdByEmail('notfound@example.com');

    expect(result).toBeNull();
  });

  it('Should return null if no email is provided', async () => {
    const result = await service.findUserIdByEmail('');
    expect(result).toBeNull();
  });

  it('Should save a log when userId is provided directly', async () => {
    const logData = {
      method: 'GET',
      url: '/test',
      status: 200,
      durationMs: 100,
      userId: 5,
      userEmail: 'test@example.com',
    };

    mockLogRepo.create.mockReturnValue({ ...logData });
    mockLogRepo.save.mockResolvedValue({ ...logData });

    const result = await service.saveLog(logData);

    expect(mockLogRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/test',
        userId: 5,
        userEmail: 'test@example.com',
      }),
    );

    expect(mockLogRepo.save).toHaveBeenCalled();
    expect(result).toEqual(logData);
  });

  it('Should fetch userId by email if userId is not provided', async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 7 });

    const logData = {
      method: 'POST',
      url: '/login',
      status: 201,
      durationMs: 150,
      userEmail: 'user@mail.com',
    };

    mockLogRepo.create.mockReturnValue({ ...logData, userId: 7 });
    mockLogRepo.save.mockResolvedValue({ ...logData, userId: 7 });

    const result = await service.saveLog(logData);

    expect(mockUserRepo.findOne).toHaveBeenCalled();
    expect(mockLogRepo.save).toHaveBeenCalled();
    expect(result.userId).toBe(7);
  });

  it('Should log an error when findUserIdByEmail throws', async () => {
    mockUserRepo.findOne.mockRejectedValue(new Error('DB error'));

    const logData = {
      method: 'DELETE',
      url: '/error',
      status: 200,
      durationMs: 100,
      userEmail: 'error@mail.com',
    };

    mockLogRepo.create.mockReturnValue({ ...logData, userId: null });
    mockLogRepo.save.mockResolvedValue({ ...logData, userId: null });

    const result = await service.saveLog(logData);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result.userId).toBeNull();
  });

  it('Should keep the provided timestamp when timestamp is passed', async () => {
    const date = new Date('2024-01-01T00:00:00Z');

    const logData = {
      method: 'PUT',
      url: '/with-timestamp',
      status: 204,
      durationMs: 40,
      timestamp: date,
    };

    mockLogRepo.create.mockReturnValue({ ...logData });
    mockLogRepo.save.mockResolvedValue({ ...logData });

    const result = await service.saveLog(logData);

    expect(mockLogRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: date,
      }),
    );

    expect(result.timestamp).toBe(date);
  });

  it('Should set userEmail to null when userId exists but userEmail is not provided', async () => {
    const logData = {
      method: 'PATCH',
      url: '/force-null-email',
      status: 200,
      durationMs: 60,
      userId: 99,
      userEmail: undefined,
    };

    mockLogRepo.create.mockReturnValue({
      ...logData,
      userEmail: null,
    });

    mockLogRepo.save.mockResolvedValue({
      ...logData,
      userEmail: null,
    });

    const result = await service.saveLog(logData);

    expect(mockLogRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 99,
        userEmail: null,
      }),
    );

    expect(result.userEmail).toBeNull();
  });
});

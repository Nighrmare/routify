/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ComparisonsService } from './comparisons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comparison } from 'src/entities/comparison.entity';
import { TransportService } from '../transport/transport.service';
import { User } from 'src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  TransportOption,
  ComparisonResult,
} from 'src/interfaces/transport-comparison.interface';

describe('ComparisonsService', () => {
  let service: ComparisonsService;
  let comparisonRepo: jest.Mocked<Repository<Comparison>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let transportService: jest.Mocked<TransportService>;

  const mockOption: TransportOption = {
    type: 'taxi',
    score: 10,
    distance: 5,
    duration: 15,
    cost: 12.5,
    comfort: 4,
    reliability: 0.9,
  };

  const mockTransportResult: ComparisonResult = {
    origin: 'A',
    destination: 'B',
    options: [mockOption],
    recommended: mockOption,
    fastest: mockOption,
    cheapest: mockOption,
  };

  const mockComparison = {
    id: 1,
    origin: 'A',
    destination: 'B',
    results: mockTransportResult,
    user: { id: 10 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComparisonsService,
        {
          provide: getRepositoryToken(Comparison),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TransportService,
          useValue: {
            compareTransports: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ComparisonsService>(ComparisonsService);

    comparisonRepo = module.get(getRepositoryToken(Comparison));
    userRepo = module.get(getRepositoryToken(User));
    transportService = module.get(TransportService);
  });

  it('should create a comparison', async () => {
    userRepo.findOne.mockResolvedValue({ id: 10 } as any);
    transportService.compareTransports.mockResolvedValue(mockTransportResult);

    comparisonRepo.create.mockReturnValue(mockComparison as any);
    comparisonRepo.save.mockResolvedValue(mockComparison as any);

    const result = await service.create({ origin: 'A', destination: 'B' }, 10);

    expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
    expect(transportService.compareTransports).toHaveBeenCalledWith('A', 'B');
    expect(comparisonRepo.create).toHaveBeenCalled();
    expect(comparisonRepo.save).toHaveBeenCalled();
    expect(result).toEqual(mockComparison);
  });

  it('should throw if user does not exist on create', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(
      service.create({ origin: 'A', destination: 'B' }, 99),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return all comparisons', async () => {
    comparisonRepo.find.mockResolvedValue([mockComparison] as any);

    const result = await service.findAll();
    expect(result).toEqual([mockComparison]);
    expect(comparisonRepo.find).toHaveBeenCalledWith({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  });

  it('should find comparisons by user', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1 } as any);
    comparisonRepo.find.mockResolvedValue([mockComparison] as any);

    const result = await service.findByUser(1);

    expect(result).toEqual([mockComparison]);
    expect(comparisonRepo.find).toHaveBeenCalledWith({
      where: { user: { id: 1 } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  });

  it('should throw if user does not exist on findByUser', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(service.findByUser(999)).rejects.toThrow(NotFoundException);
  });

  it('should return one comparison', async () => {
    comparisonRepo.findOne.mockResolvedValue(mockComparison as any);

    const result = await service.findOne(1);

    expect(result).toEqual(mockComparison);
    expect(comparisonRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['user'],
    });
  });

  it('should throw if comparison not found', async () => {
    comparisonRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should remove a comparison', async () => {
    comparisonRepo.delete.mockResolvedValue({ affected: 1 } as any);

    await expect(service.remove(1)).resolves.not.toThrow();
  });

  it('should throw if comparison not found on remove', async () => {
    comparisonRepo.delete.mockResolvedValue({ affected: 0 } as any);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });

  it('should return stats without userId', async () => {
    const qb: any = {
      where: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(5),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockComparison]),
    };

    comparisonRepo.createQueryBuilder.mockReturnValue(qb);

    const stats = await service.getStats();

    expect(stats.totalComparisons).toBe(5);
    expect(stats.recentComparisons).toEqual([mockComparison]);
  });

  it('should return stats with userId', async () => {
    const qb: any = {
      where: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(3),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockComparison]),
    };

    comparisonRepo.createQueryBuilder.mockReturnValue(qb);

    const stats = await service.getStats('10');

    expect(qb.where).toHaveBeenCalledWith('comparison.userId = :userId', {
      userId: '10',
    });
    expect(stats.totalComparisons).toBe(3);
  });
});

/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ComparisonsController } from './comparisons.controller';
import { ComparisonsService } from './comparisons.service';
import { UserRole } from 'src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateComparisonDTO } from 'src/dto/create-comparison.dto';

describe('ComparisonsController', () => {
  let controller: ComparisonsController;
  let service: jest.Mocked<ComparisonsService>;

  const mockComparison = {
    id: 1,
    origin: 'A',
    destination: 'B',
    results: {},
    user: { id: 10, role: UserRole.USER },
  };

  const mockStats = {
    totalComparisons: 5,
    recentComparisons: [mockComparison],
  };

  const mockUserRequest = { user: { userId: 10 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComparisonsController],
      providers: [
        {
          provide: ComparisonsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUser: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            getStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ComparisonsController>(ComparisonsController);
    service = module.get(ComparisonsService);
  });

  it('should create a new comparison', async () => {
    const dto: CreateComparisonDTO = { origin: 'A', destination: 'B' };
    service.create.mockResolvedValue(mockComparison as any);

    const result = await controller.create(dto, mockUserRequest as any);

    expect(service.create).toHaveBeenCalledWith(dto, 10);
    expect(result).toEqual(mockComparison);
  });

  it('should return all comparisons', async () => {
    service.findAll.mockResolvedValue([mockComparison] as any);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockComparison]);
  });

  it('should return comparisons of the logged user', async () => {
    service.findByUser.mockResolvedValue([mockComparison] as any);

    const result = await controller.findMyComparisons(mockUserRequest as any);

    expect(service.findByUser).toHaveBeenCalledWith(10);
    expect(result).toEqual([mockComparison]);
  });

  it('should return comparisons by user ID', async () => {
    service.findByUser.mockResolvedValue([mockComparison] as any);

    const result = await controller.findByUser(10);

    expect(service.findByUser).toHaveBeenCalledWith(10);
    expect(result).toEqual([mockComparison]);
  });

  it('should return global stats', async () => {
    service.getStats.mockResolvedValue(mockStats as any);

    const result = await controller.getStats();

    expect(service.getStats).toHaveBeenCalled();
    expect(result).toEqual(mockStats);
  });

  it('should return stats of the logged user', async () => {
    service.getStats.mockResolvedValue(mockStats as any);

    const result = await controller.getMyStats(mockUserRequest as any);

    expect(service.getStats).toHaveBeenCalledWith(10);
    expect(result).toEqual(mockStats);
  });

  it('should return one comparison by ID', async () => {
    service.findOne.mockResolvedValue(mockComparison as any);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockComparison);
  });

  it('should remove a comparison by ID', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const result = await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toBeUndefined();
  });

  it('should throw if comparison not found', async () => {
    service.findOne.mockRejectedValue(new NotFoundException());

    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });
});

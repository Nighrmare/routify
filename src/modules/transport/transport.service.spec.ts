import { Test, TestingModule } from '@nestjs/testing';
import { TransportService } from './transport.service';
import { TransportSimulatorService } from '../services/transport-simulator.service';
import { ComparisonsService } from '../comparisons/comparisons.service';
import { TransportOption } from 'src/interfaces/transport-comparison.interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transport } from 'src/entities/transport.entity';
import { NotFoundException } from '@nestjs/common';

describe('TransportService', () => {
  let service: TransportService;
  let mockSimulator: Partial<TransportSimulatorService>;
  let mockComparisonsService: Partial<ComparisonsService>;
  let moduleRef: TestingModule;

  const mockOptions: TransportOption[] = [
    {
      type: 'taxi',
      score: 10,
      distance: 5,
      duration: 15,
      cost: 12.5,
      comfort: 4,
      reliability: 0.9,
    },
    {
      type: 'bus',
      score: 8,
      distance: 6,
      duration: 20,
      cost: 2.5,
      comfort: 3,
      reliability: 0.85,
    },
  ];

  beforeEach(async () => {
    mockSimulator = {
      simulateTransportOptions: jest.fn().mockReturnValue(mockOptions),
    };

    mockComparisonsService = {
      create: jest.fn(),
    };

    const repoMock = {
      create: jest.fn().mockImplementation(dto => ({ id: 1, ...dto })),
      save: jest.fn().mockImplementation(entity => Promise.resolve({ id: 1, ...entity })),
      find: jest.fn().mockResolvedValue([{ id: 1, type: 'taxi' }]),
      findOne: jest.fn().mockImplementation(({ where: { id } }) =>
        Promise.resolve(id === 1 ? { id: 1, type: 'taxi' } : undefined),
      ),
    };

    moduleRef = await Test.createTestingModule({
      providers: [
        TransportService,
        { provide: TransportSimulatorService, useValue: mockSimulator },
        { provide: ComparisonsService, useValue: mockComparisonsService },
        { provide: getRepositoryToken(Transport), useValue: repoMock },
      ],
    }).compile();

    service = moduleRef.get<TransportService>(TransportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should compare transports and save comparison when userId is provided', async () => {
    await service.compareTransports('A', 'B', '10');

    expect(mockSimulator.simulateTransportOptions).toHaveBeenCalledWith('A', 'B');

    expect(mockComparisonsService.create).toHaveBeenCalledWith(
      { origin: 'A', destination: 'B' },
      10,
    );
  });

  it('should NOT save comparison when userId not provided', async () => {
    await service.compareTransports('A', 'B');

    expect(mockSimulator.simulateTransportOptions).toHaveBeenCalledWith('A', 'B');
    expect(mockComparisonsService.create).not.toHaveBeenCalled();
  });

  it('should throw when simulator returns empty options (current implementation)', async () => {
    
    mockSimulator.simulateTransportOptions = jest.fn().mockReturnValue([]);
    await expect(service.compareTransports('A', 'B')).rejects.toThrow();
  });

  it('create should call repository create and save', async () => {
    const repo = moduleRef.get(getRepositoryToken(Transport)) as any;
    const dto = { type: 'bike', distance: 10 } as any;
    (repo.create as jest.Mock).mockReturnValue(dto);
    (repo.save as jest.Mock).mockResolvedValue({ id: 2, ...dto });
    await expect(service.create(dto)).resolves.toEqual({ id: 2, ...dto });
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(dto);
  });

  it('findAll should return array from repo.find', async () => {
    const repo = moduleRef.get(getRepositoryToken(Transport)) as any;
    (repo.find as jest.Mock).mockResolvedValue([{ id: 5 }]);
    await expect(service.findAll()).resolves.toEqual([{ id: 5 }]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('findOne should return transport when found', async () => {
    const repo = moduleRef.get(getRepositoryToken(Transport)) as any;
    (repo.findOne as jest.Mock).mockResolvedValue({ id: 7 });
    await expect(service.findOne(7)).resolves.toEqual({ id: 7 });
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 7 } });
  });

  it('findOne should throw NotFoundException when not found', async () => {
    const repo = moduleRef.get(getRepositoryToken(Transport)) as any;
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('compareTransports should return options ordered by score', async () => {
    mockSimulator.simulateTransportOptions = jest.fn().mockReturnValue([
      { ...mockOptions[1] }, 
      { ...mockOptions[0] }, 
    ]);
    const result = await service.compareTransports('A', 'B');
    expect(result.options[0].score).toBeGreaterThanOrEqual(result.options[1].score);
  });
});
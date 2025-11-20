import { Test, TestingModule } from '@nestjs/testing';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';
import { UserRole } from 'src/entities/user.entity';

const mockTransportService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  compareTransports: jest.fn(),
});

describe('TransportController', () => {
  let controller: TransportController;
  let service: jest.Mocked<TransportService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportController],
      providers: [
        { provide: TransportService, useFactory: mockTransportService },
      ],
    }).compile();

    controller = module.get<TransportController>(TransportController);
    service = module.get(TransportService);
  });

  describe('create', () => {
    it('should create a new transport route', async () => {
      const dto = { origin: 'A', destination: 'B', distance: 10 };
      const expected = { id: 1, ...dto };

      service.create.mockResolvedValue(expected as any);

      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of transports', async () => {
      const transports = [{ id: 1 }, { id: 2 }];
      service.findAll.mockResolvedValue(transports as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(transports);
    });
  });

  describe('findOne', () => {
    it('should return one transport by id', async () => {
      const transport = { id: 1 };
      service.findOne.mockResolvedValue(transport as any);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(transport);
    });
  });

  describe('compare', () => {
    it('should return comparison results', async () => {
      const dto = { origin: 'A', destination: 'B' };
      const comparisonResult = { fastest: {}, cheapest: {} };

      service.compareTransports.mockResolvedValue(comparisonResult as any);

      const result = await controller.compare(dto);

      expect(service.compareTransports).toHaveBeenCalledWith('A', 'B');
      expect(result).toEqual(comparisonResult);
    });
  });
});

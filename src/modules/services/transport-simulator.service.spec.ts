/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Test, TestingModule } from '@nestjs/testing';
import { TransportSimulatorService } from './transport-simulator.service';
import { TransportType } from 'src/entities/transport.entity';

describe('TransportSimulatorService', () => {
  let service: TransportSimulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransportSimulatorService],
    }).compile();

    service = module.get<TransportSimulatorService>(TransportSimulatorService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const callService = () =>
    service.simulateTransportOptions('Origin', 'Destination');

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of transport options', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const options = callService();
    expect(options).toBeInstanceOf(Array);
    expect(options.length).toBeGreaterThan(0);
  });

  it('should always include BUS, TAXI, and PRIVATE_CAR', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const options = callService();
    const types = options.map((o) => o.type);
    expect(types).toContain(TransportType.BUS);
    expect(types).toContain(TransportType.TAXI);
    expect(types).toContain(TransportType.PRIVATE_CAR);
  });

  it('should include METRO if baseDistance < 15', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const options = callService();
    const metro = options.find((o) => o.type === TransportType.METRO);
    expect(metro).toBeDefined();
  });

  it('should include BICYCLE if baseDistance < 10', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const options = callService();
    const bike = options.find((o) => o.type === TransportType.BICYCLE);
    expect(bike).toBeDefined();
  });

  it('should include WALKING if baseDistance < 5', () => {
    jest.spyOn(Math, 'random').mockImplementationOnce(() => -0.1);
    const options = callService();
    const walk = options.find((o) => o.type === TransportType.WALKING);
    expect(walk).toBeDefined();
  });

  it('should not include METRO if baseDistance >= 15', () => {
    jest.spyOn(Math, 'random').mockReturnValue(1);
    const options = callService();
    const metro = options.find((o) => o.type === TransportType.METRO);
    expect(metro).toBeUndefined();
  });

  it('should not include BICYCLE if baseDistance >= 10', () => {
    jest.spyOn(Math, 'random').mockReturnValue(1);
    const options = callService();
    const bike = options.find((o) => o.type === TransportType.BICYCLE);
    expect(bike).toBeUndefined();
  });

  it('should not include WALKING if baseDistance >= 5', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const options = callService();
    const walk = options.find((o) => o.type === TransportType.WALKING);
    expect(walk).toBeUndefined();
  });

  it('each option must contain all numeric fields and score', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const options = callService();
    options.forEach((o) => {
      expect(typeof o.distance).toBe('number');
      expect(typeof o.duration).toBe('number');
      expect(typeof o.cost).toBe('number');
      expect(typeof o.comfort).toBe('number');
      expect(typeof o.reliability).toBe('number');
      expect(typeof o.score).toBe('number');
      expect(isNaN(o.score)).toBe(false);
    });
  });

  it('score should always be between 0 and 10', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const options = callService();
    options.forEach((o) => {
      expect(o.score).toBeGreaterThanOrEqual(0);
      expect(o.score).toBeLessThanOrEqual(10);
    });
  });
});

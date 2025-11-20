import { Test, TestingModule } from '@nestjs/testing';
import { TransportModule } from './transport.module';
import { TransportService } from './transport.service';
import { TransportSimulatorService } from '../services/transport-simulator.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transport } from 'src/entities/transport.entity';
import { Comparison } from 'src/entities/comparison.entity';
import { User } from 'src/entities/user.entity';

describe('TransportModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TransportModule],
    })
      .overrideProvider(TransportService)
      .useValue({})
      .overrideProvider(TransportSimulatorService)
      .useValue({})
      .overrideProvider(getRepositoryToken(Transport))
      .useValue({})
      .overrideProvider(getRepositoryToken(Comparison))
      .useValue({})
        .overrideProvider(getRepositoryToken(User))
        .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});

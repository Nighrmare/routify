import { Test, TestingModule } from '@nestjs/testing';
import { ComparisonsModule } from './comparisons.module';
import { ComparisonsService } from './comparisons.service';
import { ComparisonsController } from './comparisons.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comparison } from 'src/entities/comparison.entity';
import { User } from 'src/entities/user.entity';
import { Module } from '@nestjs/common';
import { TransportService } from '../transport/transport.service';

@Module({
  providers: [
    {
      provide: TransportService,
      useValue: {
        simulateTransportOptions: jest.fn(),
      },
    },
  ],
  exports: [TransportService],
})
class MockTransportModule {}

describe('ComparisonsModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ComparisonsModule],
    })

      .overrideModule(require('../transport/transport.module').TransportModule)
      .useModule(MockTransportModule)


      .overrideProvider(getRepositoryToken(Comparison))
      .useValue({})
      .overrideProvider(getRepositoryToken(User))
      .useValue({})

      .compile();
  });

  it('should be defined', () => {
    const controller = module.get<ComparisonsController>(ComparisonsController);
    const service = module.get<ComparisonsService>(ComparisonsService);

    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});

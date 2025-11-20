import { forwardRef, Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from 'src/entities/transport.entity';
import { TransportSimulatorService } from '../services/transport-simulator.service';
import { Comparison } from 'src/entities/comparison.entity';
import { ComparisonsModule } from '../comparisons/comparisons.module';

@Module({
  // Import Transport and Comparison repositories and handle circular dependency with ComparisonsModule
  imports: [
    TypeOrmModule.forFeature([Transport, Comparison]),
    forwardRef(() => ComparisonsModule),
  ],
  // Register TransportController
  controllers: [TransportController],
  // Register TransportService and TransportSimulatorService
  providers: [TransportService, TransportSimulatorService],
  // Export TransportService for use in other modules
  exports: [TransportService],
})
export class TransportModule {}

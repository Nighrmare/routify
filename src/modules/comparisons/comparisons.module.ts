import { forwardRef, Module } from '@nestjs/common';
import { ComparisonsController } from './comparisons.controller';
import { ComparisonsService } from './comparisons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comparison } from 'src/entities/comparison.entity';
import { User } from 'src/entities/user.entity';
import { TransportModule } from '../transport/transport.module';

@Module({
  // Import Comparison and User repositories
  imports: [
    TypeOrmModule.forFeature([Comparison, User]),
    // Use forwardRef to handle circular dependency with TransportModule
    forwardRef(() => TransportModule),
  ],
  // Register ComparisonsController
  controllers: [ComparisonsController],
  // Register ComparisonsService
  providers: [ComparisonsService],
  // Export ComparisonsService so it can be used in other modules
  exports: [ComparisonsService],
})
export class ComparisonsModule {}

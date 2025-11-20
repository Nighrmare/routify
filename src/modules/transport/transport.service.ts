import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transport } from 'src/entities/transport.entity';
import { CreateRouteDTO } from 'src/dto/create-route.dto';
import { ComparisonResult } from 'src/interfaces/transport-comparison.interface';
import { TransportSimulatorService } from '../services/transport-simulator.service';
import { ComparisonsService } from '../comparisons/comparisons.service';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Transport)
    private transportRepository: Repository<Transport>,
    private simulatorService: TransportSimulatorService,
    private comparisonsService: ComparisonsService,
  ) {}

  // Create and save a new transport route
  async create(CreateRouteDTO: CreateRouteDTO): Promise<Transport> {
    const transport = this.transportRepository.create(CreateRouteDTO);
    return await this.transportRepository.save(transport);
  }

  // Get all transport routes
  async findAll(): Promise<Transport[]> {
    return await this.transportRepository.find();
  }

  // Get transport route by ID
  async findOne(id: number): Promise<Transport> {
    const transport = await this.transportRepository.findOne({ where: { id } });
    if (!transport) {
      throw new NotFoundException(`Transport with Id ${id} not found`);
    }
    return transport;
  }

  // Compare transport options between two locations
  async compareTransports(
    origin: string,
    destination: string,
    userId?: string,
  ): Promise<ComparisonResult> {
    const options = this.simulatorService.simulateTransportOptions(
      origin,
      destination,
    );

    const recommended = options.reduce((prev, current) =>
      prev.score > current.score ? prev : current,
    );

    const fastest = options.reduce((prev, current) =>
      prev.duration < current.duration ? prev : current,
    );

    const cheapest = options.reduce((prev, current) =>
      prev.cost < current.cost ? prev : current,
    );

    const result = {
      origin,
      destination,
      options: options.sort((a, b) => b.score - a.score),
      recommended,
      fastest,
      cheapest,
    };

    if (userId) {
      await this.comparisonsService.create(
        {
          origin,
          destination,
        },
        Number(userId),
      );
    }

    return result;
  }
}

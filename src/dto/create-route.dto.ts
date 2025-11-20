import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { TransportType } from '../entities/transport.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsAddressOrCity } from 'src/common/validators/is-address-or-city.validator';
export class CreateRouteDTO {
  @ApiProperty({
    example: 'private_car',
    description: 'Type of transport used for the route',
    enum: TransportType,
  })
  @IsEnum(TransportType)
  // Type of transport
  type: TransportType;

  @ApiProperty({
    example: 'Cra 20 #45-10',
    description: 'Route starting point',
  })
  @IsString()
  @IsNotEmpty()
  @IsAddressOrCity({
    message:
      'Origin must be a valid address or city Example "Bogota DC o Cra 24 #45"',
  })
  origin: string;

  @ApiProperty({
    example: 'Calle 50 #30',
    description: 'Route destination point',
  })
  @IsString()
  @IsNotEmpty()
  @IsAddressOrCity({
    message:
      'Destination must be a valid address or city Example "Bogota DC o Cra 24 #45"',
  })
  destination: string;

  @ApiProperty({
    example: 250,
    description: 'Distance of the route in kilometers',
  })
  @IsNumber()
  @Min(0)
  // Distance
  distance: number;

  @ApiProperty({
    example: 60,
    description: 'Duration of the route in minutes',
  })
  @IsNumber()
  @Min(0)
  //Duration
  duration: number;

  @ApiProperty({
    example: 50000,
    description: 'Total cost of the route',
  })
  @IsNumber()
  @Min(0)
  // Total cost
  cost: number;

  @ApiProperty({
    example: 7,
    description: 'Comfort level (1–10)',
  })
  @IsNumber()
  @Min(1)
  // Comfort level
  comfort: number;

  @ApiProperty({
    example: 8,
    description: 'Reliability level (1–10)',
  })
  @IsNumber()
  @Min(1)
  // Reliability level
  reliability: number;

  @ApiProperty({
    example: 'Smooth ride with minimal traffic',
    description: 'Additional notes or observations about the route',
    required: false,
  })
  @IsString()
  @IsOptional()
  // Notes or observations (optional)
  notes?: string;
}

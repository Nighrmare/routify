import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComparisonDTO {
  @ApiProperty({
    description: 'Origin address or city',
    example: 'Bogota DC',
  })
  @IsString()
  @IsNotEmpty()
  // Origin of the comparison
  origin: string;

  @ApiProperty({
    description: 'Destination address or city',
    example: 'Cali',
  })
  @IsString()
  @IsNotEmpty()
  // Destination of the comparison
  destination: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsAddressOrCity } from 'src/common/validators/is-address-or-city.validator';

export class CompareTransportDTO {
  @ApiProperty({
    description: 'Origin address or city',
    example: 'Bogota DC',
  })
  @IsString()
  @IsNotEmpty()
  @IsAddressOrCity({
    message:
      'Origin must be a valid address or city Example "Bogota DC o Cra 24 #45"',
  })
  // Address or city of origin
  origin: string;

  @ApiProperty({
    description: 'Destination address or city',
    example: 'Calle 50 #30',
  })
  @IsString()
  @IsNotEmpty()
  @IsAddressOrCity({
    message:
      'Destination must be a valid address or city, Example "Bogota DC o Cra 24 #45"',
  })
  // Destination address or city
  destination: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'User email',
    example: 'juan@example.com',
  })
  @IsEmail()
  // User email
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '1234567',
  })
  @Length(6, 10, {
    message: 'The password must be between 6 and 10 characters long',
  })
  // User password
  password: string;
}

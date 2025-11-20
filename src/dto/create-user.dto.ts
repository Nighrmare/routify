import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class CreateUserDTO {
  @ApiProperty({
    description: 'User name',
    example: 'Juan',
  })
  @IsNotEmpty()
  // Username
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'juan@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  // User email address
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '1234567',
  })
  @IsNotEmpty()
  @Length(6, 10, {
    message: 'The password must be between 6 and 10 characters long',
  })
  // Password (6-10 characters)
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
    required: false,
  })
  @IsString()
  @IsOptional()
  // User role (optional)
  role?: UserRole;
}

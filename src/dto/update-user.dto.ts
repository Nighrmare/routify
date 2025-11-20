import { IsBoolean, IsEmail, IsOptional, Length } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({
    description: 'Account status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  // Account statement
  status?: boolean;

  @ApiProperty({
    description: 'User name',
    example: 'Juan',
    required: false,
  })
  // Username
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'User email',
    example: 'juan@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  // User email address
  email?: string;

  @ApiProperty({
    description: 'User password',
    example: '1234567',
    required: false,
  })
  @IsOptional()
  @Length(6, 10, {
    message: 'The password must be between 6 and 10 characters long',
  })
  // User password
  password?: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  // User role
  role?: UserRole;
}

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  // Import the User repository
  imports: [TypeOrmModule.forFeature([User])],
  // Register UsersController
  controllers: [UsersController],
  // Register UsersService
  providers: [UsersService],
  // Export UsersService and TypeOrmModule for use in other modules
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

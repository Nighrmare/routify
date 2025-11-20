import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/api/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /api/users
  // Get all active users
  @Get()
  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({
    status: 200,
    description: 'List of active users',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // GET /api/users/:id
  // Get user by ID
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // GET /api/users/search/:name
  // Search users by name
  @Get('search/:name')
  @ApiOperation({ summary: 'Search users by name' })
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Users found successfully',
  })
  async searchByName(@Param('name') name: string): Promise<User[]> {
    return this.usersService.findByName(name);
  }

  // POST /api/users
  // Create a new user
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: ' Bad Request',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  async create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  // PUT /api/users/:id
  // Update user by ID
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', example: 3 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: ' Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
    return this.usersService.update(id, body);
  }

  // PATCH /api/users/:id/disable
  // Disable a user account
  @Patch(':id/disable')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Disable a user account' })
  @ApiParam({ name: 'id', example: 4 })
  @ApiResponse({
    status: 200,
    description: 'User disabled successfully',
  })
  @ApiResponse({
    status: 400,
    description: ' Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.disable(id);
  }
}

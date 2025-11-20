/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/dto/login.dto';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { JwtAuthGuard } from './jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register
  // Register a new user account
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiBody({
    description: 'User registration data',
    type: CreateUserDTO,
    examples: {
      default: {
        summary: 'Register example',
        value: {
          name: 'example',
          email: 'example@example.com',
          password: '1234567',
          role: 'admin',
        },
      },
    },
  })
  register(@Body() data: CreateUserDTO) {
    return this.authService.register(data);
  }

  // POST /api/auth/login
  // Authenticate a user and return TOKEN
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 201,
    description: 'User logged in successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }

  // GET /api/auth/profile
  // Displays the authenticated user profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getProfile(@Request() req) {
    return req.user;
  }
}

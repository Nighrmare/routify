/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ComparisonsService } from './comparisons.service';
import { CreateComparisonDTO } from 'src/dto/create-comparison.dto';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from 'src/entities/user.entity';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Comparisons')
@ApiBearerAuth()
@Controller('/api/comparisons')
@UseGuards(JwtAuthGuard)
export class ComparisonsController {
  constructor(private readonly comparisonsService: ComparisonsService) {}

  // POST /api/comparisons
  // Create a new comparison for the logged user
  @Post()
  @ApiOperation({
    summary: 'Create a new transport comparison',
    description:
      'Creates a comparison between two locations and generates transport results.',
  })
  @ApiResponse({
    status: 201,
    description: 'Comparison created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createComparisonDto: CreateComparisonDTO,
    @Request() req,
  ) {
    return await this.comparisonsService.create(
      createComparisonDto,
      req.user.userId,
    );
  }

  // GET /api/comparisons
  // Get all comparisons
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all comparisons' })
  @ApiResponse({ status: 200, description: 'List of all comparisons' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.comparisonsService.findAll();
  }

  // GET /api/comparisons/my-comparisons
  // Get comparisons created by the logged user
  @Get('my-comparisons')
  @ApiOperation({ summary: 'Get comparisons made by the logged' })
  @ApiResponse({ status: 200, description: 'User comparisons listed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyComparisons(@Request() req) {
    return this.comparisonsService.findByUser(req.user.userId);
  }

  // GET /api/comparisons/user/:userId
  // Get comparisons by user ID
  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get comparisons by user ID' })
  @ApiParam({ name: 'userId', example: 3 })
  @ApiResponse({ status: 200, description: 'Comparisons by user listed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.comparisonsService.findByUser(userId);
  }

  // GET /api/comparisons/stats
  // Get global comparison statistics
  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get global statistics about comparisons',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getStats() {
    return this.comparisonsService.getStats();
  }

  // GET /api/comparisons/my-stats
  // Get statistics for the logged user
  @Get('my-stats')
  @ApiOperation({ summary: 'Get statistics of the logged' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyStats(@Request() req) {
    return this.comparisonsService.getStats(req.user.userId);
  }

  // GET /api/comparisons/:id
  // Get a comparison by its ID
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get comparison by ID' })
  @ApiParam({ name: 'id', example: 5 })
  @ApiResponse({ status: 200, description: 'Comparison found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comparisonsService.findOne(id);
  }

  // DELETE /api/comparisons/:id
  // Delete comparison by ID
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a comparison by ID' })
  @ApiParam({ name: 'id', example: 5 })
  @ApiResponse({ status: 200, description: 'Comparison deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comparisonsService.remove(id);
  }
}

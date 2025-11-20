import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Welcome endpoint
  @Get()
  @ApiOperation({ summary: 'Welcome' })
  @ApiResponse({
    status: 200,
    description: 'Returns welcome message for the API',
  })
  getApiInfo() {
    return this.appService.getApiInfo();
  }
}

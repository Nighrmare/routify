import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Returns welcome message
  getApiInfo() {
    return {
      message: 'Welcome to Routify API',
    };
  }
}

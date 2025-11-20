import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntry } from 'src/entities/log.entity';
import { LogsService } from './logs.service';
import { APP_FILTER } from '@nestjs/core';
import { User } from 'src/entities/user.entity';
import { AllExceptionsFilter } from 'src/common/filters/http-exception.filter';
import { LoggingDbInterceptor } from './interceptors/logging-db.interceptor';

@Module({
  // Import LogEntry and User repositories
  imports: [TypeOrmModule.forFeature([LogEntry, User])],
  // Register LogsService and LoggingDbInterceptor
  // Register global exception filter
  providers: [
    LogsService,
    LoggingDbInterceptor,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  // Export LogsService and LoggingDbInterceptor for use in other modules
  exports: [LogsService, LoggingDbInterceptor],
})
export class LogsModule {}

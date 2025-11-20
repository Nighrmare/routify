import { Test, TestingModule } from '@nestjs/testing';
import { LogsModule } from './logs.module';
import { LogsService } from './logs.service';
import { LoggingDbInterceptor } from './interceptors/logging-db.interceptor';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LogEntry } from 'src/entities/log.entity';
import { User } from 'src/entities/user.entity';

describe('LogsModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [LogsModule],
    })
      .overrideProvider(getRepositoryToken(LogEntry))
      .useValue({})
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .compile();
  });

  it('should compile the module', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should provide LogsService', () => {
    const service = moduleRef.get<LogsService>(LogsService);
    expect(service).toBeDefined();
  });

  it('should provide LoggingDbInterceptor', () => {
    const interceptor =
      moduleRef.get<LoggingDbInterceptor>(LoggingDbInterceptor);
    expect(interceptor).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should compile the AppModule', () => {
    expect(appModule).toBeDefined();
  });

  it('should resolve AppService', () => {
    const service = appModule.get<AppService>(AppService);
    expect(service).toBeInstanceOf(AppService);
  });

  it('should resolve AppController', () => {
    const controller = appModule.get<AppController>(AppController);
    expect(controller).toBeInstanceOf(AppController);
  });
});
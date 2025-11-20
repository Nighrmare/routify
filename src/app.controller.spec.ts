import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getApiInfo: jest
              .fn()
              .mockReturnValue({ message: 'Welcome to Routify API' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AppService.getApiInfo and return welcome message', () => {
    const spy = jest.spyOn(service, 'getApiInfo');

    const result = controller.getApiInfo();

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Welcome to Routify API' });
  });
});

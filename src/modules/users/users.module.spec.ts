import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

describe('UsersModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    const controller = module.get<UsersController>(UsersController);
    const service = module.get<UsersService>(UsersService);

    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});

/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { UserRole } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';

const mockJwtGuard = { canActivate: jest.fn().mockReturnValue(true) };
const mockRolesGuard = { canActivate: jest.fn().mockReturnValue(true) };

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      disable: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('should instantiate the controller directly', () => {
    const ctrl = new UsersController(service);
    expect(ctrl).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const expected = [{ id: 1, name: 'Test' }];
    service.findAll.mockResolvedValue(expected as never);

    const result = await controller.findAll();
    expect(result).toEqual(expected);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    const expected = { id: 1, name: 'Test' };
    service.findOne.mockResolvedValue(expected as never);

    const result = await controller.findOne(1);
    expect(result).toEqual(expected);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw if service.findOne fails', async () => {
    service.findOne.mockRejectedValue(new Error('User not found'));

    await expect(controller.findOne(999)).rejects.toThrow('User not found');

    expect(service.findOne).toHaveBeenCalledWith(999);
  });

  it('should search users by name', async () => {
    const expected = [{ id: 1, name: 'Laura' }];
    service.findByName.mockResolvedValue(expected as never);

    const result = await controller.searchByName('Laura');
    expect(result).toEqual(expected);
    expect(service.findByName).toHaveBeenCalledWith('Laura');
  });

  it('should create a user', async () => {
    const dto: CreateUserDTO = {
      name: 'User',
      email: 'test@test.com',
      password: '123456',
      role: UserRole.ADMIN,
    };

    const expected = { id: 1, ...dto };
    service.create.mockResolvedValue(expected as never);

    const result = await controller.create(dto);
    expect(result).toEqual(expected);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDTO = { name: 'NewName', role: UserRole.USER };
    service.update.mockResolvedValue({ id: 1, ...dto } as never);

    const result = await controller.update(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should throw if service.update fails', async () => {
    const dto: UpdateUserDTO = { name: 'BadUpdate' };

    service.update.mockRejectedValue(new Error('Update failed'));

    await expect(controller.update(1, dto)).rejects.toThrow('Update failed');

    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should disable a user', async () => {
    const expected = { message: 'User disabled' };
    service.disable.mockResolvedValue(expected as never);

    const result = await controller.disable(1);
    expect(result).toEqual(expected);
    expect(service.disable).toHaveBeenCalledWith(1);
  });
});

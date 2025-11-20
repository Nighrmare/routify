/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserRole } from 'src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { UserNotFoundException } from 'src/common/exceptions/routify.exception';
import { BadRequestException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    status: true,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should inject repository into the service', () => {
    expect(service).toBeInstanceOf(UsersService);
    expect((service as any).usersRepo).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all active users', async () => {
      mockUserRepo.find.mockResolvedValue([mockUser]);
      const users = await service.findAll();
      expect(users).toEqual([mockUser]);
      expect(mockUserRepo.find).toHaveBeenCalledWith({
        where: { status: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      const user = await service.findOne(1);
      expect(user).toEqual(mockUser);
    });

    it('should throw UserNotFoundException if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return users matching the name', async () => {
      mockUserRepo.find.mockResolvedValue([mockUser]);
      const users = await service.findByName('Test');
      expect(users).toEqual([mockUser]);
    });

    it('should throw UserNotFoundException if no users found', async () => {
      mockUserRepo.find.mockResolvedValue([]);
      await expect(service.findByName('NoUser')).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser: CreateUserDTO = {
        name: 'New',
        email: 'new@example.com',
        password: '1234',
        role: UserRole.USER,
      };
      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.create.mockReturnValue(newUser);
      mockUserRepo.save.mockResolvedValue({
        ...newUser,
        id: 2,
        password: 'hashedPassword',
      });

      const result = await service.create(newUser);
      expect(result.user.password).toBe('hashedPassword');
      expect(result.message).toBe('User created successfully.');
    });

    it('should throw BadRequestException if email exists', async () => {
      const newUser: CreateUserDTO = {
        name: 'New',
        email: 'test@example.com',
        password: '1234',
        role: UserRole.USER,
      };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      await expect(service.create(newUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateDto: UpdateUserDTO = {
        name: 'Updated',
        password: 'newpass',
        role: UserRole.ADMIN,
      };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue({
        ...mockUser,
        ...updateDto,
        password: 'hashedPassword',
      });

      const result = await service.update(1, updateDto);
      expect(result.user.name).toBe('Updated');
      expect(result.user.password).toBe('hashedPassword');
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.update(999, {} as UpdateUserDTO)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw BadRequestException if email already exists (different user)', async () => {
      const updateDto: UpdateUserDTO = {
        email: 'exists@example.com',
        role: UserRole.ADMIN,
      };

      mockUserRepo.findOne
        .mockImplementationOnce(() => Promise.resolve(mockUser))
        .mockImplementationOnce(() =>
          Promise.resolve({ ...mockUser, id: 2, email: 'exists@example.com' }),
        );

      await expect(service.update(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow same email for the same user', async () => {
      const updateDto: UpdateUserDTO = {
        email: 'test@example.com',
        role: UserRole.ADMIN,
      };

      mockUserRepo.findOne
        .mockImplementationOnce(() => Promise.resolve(mockUser))
        .mockImplementationOnce(() => Promise.resolve({ ...mockUser, id: 1 }));

      mockUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.update(1, updateDto);
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw BadRequestException if no fields provided', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      await expect(service.update(1, {} as UpdateUserDTO)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should convert string role to UserRole enum', async () => {
      const updateDto: UpdateUserDTO = { role: UserRole.ADMIN };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue({
        ...mockUser,
        role: UserRole.ADMIN,
      });

      const result = await service.update(1, updateDto);
      expect(result.user.role).toBe(UserRole.ADMIN);
    });

    it('should skip role conversion if role is already UserRole enum', async () => {
      const updateDto: UpdateUserDTO = { role: UserRole.USER };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue({
        ...mockUser,
        role: UserRole.USER,
      });

      const result = await service.update(1, updateDto);
      expect(result.user.role).toBe(UserRole.USER);
    });

    it('should skip role conversion if role is undefined', async () => {
      const updateDto: UpdateUserDTO = { name: 'NoRoleUpdate' };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue({
        ...mockUser,
        name: 'NoRoleUpdate',
      });

      const result = await service.update(1, updateDto);
      expect(result.user.name).toBe('NoRoleUpdate');
      expect(result.user.role).toBe(mockUser.role);
    });

    it('should skip password hashing if password is undefined', async () => {
      const updateDto: UpdateUserDTO = { name: 'NoPasswordUpdate' };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue({
        ...mockUser,
        name: 'NoPasswordUpdate',
      });

      const result = await service.update(1, updateDto);
      expect(result.user.name).toBe('NoPasswordUpdate');
      expect(result.user.password).toBe(mockUser.password);
    });

    it('should not check email duplication if email is same as current', async () => {
      const updateDto: UpdateUserDTO = { email: 'test@example.com' };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.update(1, updateDto);
      expect(result.user.email).toBe('test@example.com');
    });

    it('should skip role conversion if role is not a string (numeric enum)', async () => {
      const updateDto: UpdateUserDTO = { role: 1 as any };

      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue({
        ...mockUser,
        role: 1,
      });

      const result = await service.update(1, updateDto);

      expect(result.user.role).toBe(1);
    });
  });

  describe('disable', () => {
    it('should disable an active user', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue({ ...mockUser, status: false });

      const result = await service.disable(1);
      expect(result.message).toBe('User with ID 1 disabled successfully.');
    });

    it('should throw BadRequestException if user already disabled', async () => {
      mockUserRepo.findOne.mockResolvedValue({ ...mockUser, status: false });
      await expect(service.disable(1)).rejects.toThrow(BadRequestException);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.disable(999)).rejects.toThrow(UserNotFoundException);
    });
  });
});

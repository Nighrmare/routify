/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from 'src/common/exceptions/routify.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  // Get all active users
  findAll(): Promise<User[]> {
    return this.usersRepo.find({ where: { status: true } });
  }

  // Get user by ID
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  // Search users by name
  async findByName(name: string): Promise<User[]> {
    const users = await this.usersRepo.find({
      where: { name: ILike(`%${name}%`) },
    });
    if (users.length === 0) {
      throw new UserNotFoundException();
    }

    return users;
  }

  // Create a new user with hashed password
  async create(
    newUser: CreateUserDTO,
  ): Promise<{ message: string; user: User }> {
    const existingUser = await this.usersRepo.findOne({
      where: { email: newUser.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const user = this.usersRepo.create({
      ...newUser,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepo.save(user);
    return { message: 'User created successfully.', user: savedUser };
  }

  // Update an existing user
  async update(
    id: number,
    updateUser: UpdateUserDTO,
  ): Promise<{ message: string; user: User }> {
    const user = await this.findOne(id);

    const hasAtLeastOneField = Object.values(updateUser).some(
      (value) => value !== undefined && value !== null,
    );

    if (!hasAtLeastOneField) {
      throw new BadRequestException(
        'You must submit at least one field to update',
      );
    }

    if (updateUser.email && updateUser.email !== user.email) {
      const existingUser = await this.usersRepo.findOne({
        where: { email: updateUser.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(
          'Email is already in use by another user.',
        );
      }
    }

    if (updateUser.password) {
      updateUser.password = await bcrypt.hash(updateUser.password, 10);
    }

    if (updateUser.role && typeof updateUser.role === 'string') {
      const roleKey = updateUser.role.toUpperCase() as keyof typeof UserRole;
      updateUser.role = UserRole[roleKey];
    }

    Object.assign(user, updateUser);
    const updatedUser = await this.usersRepo.save(user);

    return { message: 'User updated successfully.', user: updatedUser };
  }

  // Disable a user account
  async disable(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);

    if (!user.status) {
      throw new BadRequestException('User is already disabled.');
    }

    user.status = false;
    await this.usersRepo.save(user);
    return { message: `User with ID ${id} disabled successfully.` };
  }
}

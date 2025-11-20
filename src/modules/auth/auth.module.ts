/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({ isGlobal: true }),
    // Import the User repository
    TypeOrmModule.forFeature([User]),
    // Register Passport with JWT strategy as default
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Register JWT module asynchronously using environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        // JWT secret key
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          // Token expiration
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '1h') as any,
        },
      }),
    }),
  ],
  // Register service and strategy
  providers: [AuthService, JwtStrategy],
  // Register controller
  controllers: [AuthController],
})
export class AuthModule {}

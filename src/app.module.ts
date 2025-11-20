import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TransportModule } from './modules/transport/transport.module';
import { LogsModule } from './modules/logs/logs.module';
import { LoggingDbInterceptor } from './modules/logs/interceptors/logging-db.interceptor';
import { ComparisonsModule } from './modules/comparisons/comparisons.module';

@Module({
  // Load environment configuration globally
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Database configuration using environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    // Application modules
    UsersModule,
    AuthModule,
    TransportModule,
    LogsModule,
    ComparisonsModule,
  ],
  // Main controller
  controllers: [AppController],
  // Global services and providers
  providers: [AppService, LoggingDbInterceptor],
})
export class AppModule {}

import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './modules/logs/interceptors/logging-console.interceptor';
import { LoggingDbInterceptor } from './modules/logs/interceptors/logging-db.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Api Routify')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

   const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      url: '/api-json'
    },
    customCssUrl: [
      'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css',
    ],
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js',
    ]
  }
  SwaggerModule.setup('api/docs', app, document, customOptions)

  // Global validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  

  // Global interceptor to hide fields with @Exclude()
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggingInterceptor(),
    app.get(LoggingDbInterceptor),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`App running on: http://localhost:${port}`);
}

void bootstrap();

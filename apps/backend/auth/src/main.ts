import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.enableCors()

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('API documentation for the Auth Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // route will be /docs

  const port = process.env.PORT ?? 3099;
  await app.listen(port);

  logger.log(`🚀 Auth service running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();

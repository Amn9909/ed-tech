import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Student application')
    .setDescription('API documentation for your application')
    .setVersion('1.0')
    .addBearerAuth() // Optional: if you use JWT or token-based auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);


  const port = process.env.PORT || 3000;

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`SwaggerApplication is running on: http://localhost:${port}/api-docs`);
}
bootstrap();

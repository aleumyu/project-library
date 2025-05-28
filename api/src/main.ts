import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorsFilter } from './common/filters/errors.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Library Project API')
    .setDescription('The Library Project API description')
    .setVersion('1.0')
    .addTag('library')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Global filter for error handling
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ErrorsFilter(httpAdapterHost));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

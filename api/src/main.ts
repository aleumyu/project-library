import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorsFilter } from './common/filters/errors.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global filter for error handling
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ErrorsFilter(httpAdapterHost));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/setup.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('APP_PORT');
  const dev = configService.getOrThrow<string>('NODE_ENV') === 'dev';

  const logger = new Logger('NestApplication', {
    timestamp: true,
  });

  app.enableCors({
    origin: true,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api', {
    exclude: [
      { path: '', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
      { path: 'api/doc', method: RequestMethod.GET },
      { path: 'api/doc/*path', method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (dev) await setupSwagger(app, 'api/doc');

  await app.listen(port, '0.0.0.0');

  if (dev) {
    logger.log(`Nest application is running on: ${await app.getUrl()}`);
    logger.log(
      `Swagger documentation is available on: ${await app.getUrl()}/api/doc`,
    );
  }
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './config/env/env.service';
import NestjsLoggerServiceAdapter from './logger/logger.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(EnvService);

  app.useLogger(app.get(NestjsLoggerServiceAdapter));

  await app.listen(
    configService.get('PORT') ?? 3000,
    configService.get('HOST'),
  );

  // logger.debug(`This application is runnning on: ${await app.getUrl()}`);
}
bootstrap();

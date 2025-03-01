import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './config/env/env.service';
import { WinstonLogger } from './logger/winston/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvService);

  const logger = new WinstonLogger(configService);

  await app.listen(
    configService.get('PORT') ?? 3000,
    configService.get('HOST'),
  );

  logger.info(`This application is runnning on: ${await app.getUrl()}`);
}
bootstrap();

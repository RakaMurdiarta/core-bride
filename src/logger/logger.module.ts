import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import Logger, { LoggerBaseKey, LoggerKey } from './domain/logger';
import { LoggerService } from './logger.service';
import WinstonLoggerCustom, {
  WinstonLoggerTransportsKey,
} from './winston/winston-custom.logger';
import * as morgan from 'morgan';
import { EnvService } from '../config/env/env.service';
import ConsoleTransport from './winston/transports/console.transport';
import { EnvModule } from '../config/env/env.module';
import NestjsLoggerServiceAdapter from './logger.adapter';
import FileTransport from './winston/transports/file.transport';
import SlackTransport from './winston/transports/slack.transport';

@Global()
@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLoggerCustom,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: NestjsLoggerServiceAdapter,
      useFactory: (logger: Logger) => new NestjsLoggerServiceAdapter(logger),
      inject: [LoggerBaseKey],
    },
    {
      provide: WinstonLoggerTransportsKey,
      useFactory: (env: EnvService) => {
        const transports = [];

        transports.push(ConsoleTransport.createColorize(env));

        transports.push(FileTransport.create(env));

        if (process.env.NODE_ENV === 'production') {
          if (env.get('slackWebhookUrl')) {
            transports.push(SlackTransport.create(env.get('slackWebhookUrl')));
          }
        }

        return transports;
      },
      inject: [EnvService],
    },
  ],
  exports: [LoggerKey],
})
export class LoggerModule implements NestModule {
  constructor(@Inject(LoggerKey) private logger: Logger) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        morgan(process.env.NODE_ENV !== 'production' ? 'combined' : 'dev', {
          stream: {
            write: (message: string) => {
              this.logger.debug(message, {
                sourceClass: 'RequestLogger',
              });
            },
          },
        }),
      )
      .forRoutes('*');
  }
}

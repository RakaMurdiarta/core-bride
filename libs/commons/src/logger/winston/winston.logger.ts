import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { EnvService } from '@env/env.service';
import { customLevels } from './winston.conf';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
  private readonly logger: winston.Logger;
  private ctx: string;

  constructor(private env: EnvService) {
    const logDir = path.join(process.cwd(), 'logs');

    this.logger = winston.createLogger({
      level: this.env.get('LOG_LEVEL') ?? 'debug',
      levels: customLevels.levels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true, colors: customLevels.colors }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}] ${this.ctx ? `[${this.ctx}]` : ''}: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          level: this.env.get('LOG_LEVEL') ?? 'debug',
          filename: 'logs-%DATE%.log',
          dirname: logDir,
          format: winston.format.uncolorize(),
          zippedArchive: true,
          datePattern: 'YYYY-MM-DD',
          maxFiles: '20d',
          maxSize: '30m',
        }),
      ],
    });
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          level: this.env.get('LOG_LEVEL') ?? 'debug',
        }),
      );
    }

    this.ctx = '';
  }

  setContext(context: string) {
    this.ctx = context;
  }

  error(message: string, trace?: string) {
    this.logger.error(trace ? `${message} - ${trace}` : message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  log(message: string) {
    this.logger.warn(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}

import { EnvService } from '@env/env.service';
import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';
import { LogLevel } from '@app/commons/logger/domain/log';

export default class FileTransport {
  public static create(env: EnvService) {
    const logDir = path.join(process.cwd(), 'logs');

    return new winston.transports.DailyRotateFile({
      level: env.get('LOG_LEVEL') ?? LogLevel.Debug,
      filename: 'logs-%DATE%.log',
      dirname: logDir,
      format: winston.format.uncolorize(),
      zippedArchive: true,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '20d',
      maxSize: '30m',
    });
  }
}

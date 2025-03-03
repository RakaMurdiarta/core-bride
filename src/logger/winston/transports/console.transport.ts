import * as winston from 'winston';
import { LogData, LogLevel } from '@root/logger/domain/log';
import { EnvService } from '../../../config/env/env.service';

enum LogColors {
  red = '\x1b[31m',
  green = '\x1b[32m',
  yellow = '\x1b[33m',
  blue = '\x1b[34m',
  magenta = '\x1b[35m',
  cyan = '\x1b[36m',
  pink = '\x1b[38;5;206m',
}

type logPrintf = LogData & {
  label: string;
  durationMs: number;
  stack: string;
  props: string;
};
export default class ConsoleTransport {
  public static createColorize(env: EnvService) {
    return new winston.transports.Console({
      level: env.get('LOG_LEVEL') ?? LogLevel.Debug,
      format: winston.format.combine(
        winston.format.printf((log) => {
          const logs = log.data as logPrintf;
          const color = this.mapLogLevelColor(log.level as LogLevel);
          const prefix = `${logs.label ? `[${logs.label}]` : ''}`;

          return `${this.colorize(color, prefix + '  -')} ${log.timestamp}    ${
            logs.correlationId
              ? `(${this.colorize(LogColors.cyan, logs.correlationId)})`
              : ''
          } ${this.colorize(color, log.level.toUpperCase())} ${
            logs.sourceClass
              ? `${this.colorize(LogColors.cyan, `[${logs.sourceClass}]`)}`
              : ''
          } ${this.colorize(
            color,
            log.message + ' - ' + (logs.error ? logs.error : ''),
          )}${
            logs.durationMs !== undefined
              ? this.colorize(color, ' +' + logs.durationMs + 'ms')
              : ''
          }${logs.stack ? this.colorize(color, `  - ${logs.stack}`) : ''}${
            logs.props
              ? `\n  - Props: ${JSON.stringify(log.props, null, 4)}`
              : ''
          }`;
        }),
      ),
    });
  }

  private static colorize(color: LogColors, message: string): string {
    return `${color}${message}\x1b[0m`;
  }

  private static mapLogLevelColor(level: LogLevel): LogColors {
    switch (level) {
      case LogLevel.Debug:
        return LogColors.pink;
      case LogLevel.Info:
        return LogColors.green;
      case LogLevel.Warn:
        return LogColors.yellow;
      case LogLevel.Error:
        return LogColors.red;
      case LogLevel.Fatal:
        return LogColors.magenta;
      case LogLevel.Emergency:
        return LogColors.pink;
      default:
        return LogColors.blue;
    }
  }
}

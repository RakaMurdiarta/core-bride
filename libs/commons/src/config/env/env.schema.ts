import { z } from 'zod';
import { LogLevel } from '../../logger/type';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(8080),
  HOST: z.string().optional().default('0.0.0.0'),
  LOG_LEVEL: z
    .string()
    .transform((val) => {
      const validLevels: LogLevel[] = ['error', 'debug', 'info', 'warn'];

      const trimmedVal = val.trim().toLowerCase() as LogLevel;

      if (!validLevels.includes(trimmedVal)) {
        throw new Error(
          `LOG_LEVEL must be one of the following: ${validLevels.join(', ')}`,
        );
      }
      return trimmedVal;
    })
    .refine((val) => ['error', 'debug', 'info', 'warn'].includes(val), {
      message:
        'LOG_LEVEL must be one of the following: error, debug, info, warn',
    }),
  APP: z.string().optional().default('core-bride'),
  CONTEXT: z.string().optional().default('logger Ctx'),
  ORGANIZATION: z.string().optional().default('Personal'),
  slackWebhookUrl: z.string().optional().default('url'),
  //Database
  DB_NAME: z.string().optional().default('local'),
  DB_USER: z.string().optional().default('admin'),
  DB_PORT: z.coerce.number().optional().default(5432),
  DB_PASSWORD: z.string().optional().default('admin'),
  DB_HOST: z.string().optional().default('127.0.0.1'),
  DB_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

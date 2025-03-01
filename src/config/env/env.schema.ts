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
});

export type Env = z.infer<typeof envSchema>;

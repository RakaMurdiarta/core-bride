import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  private logger: Logger;
  constructor(private readonly schema: ZodSchema) {
    this.logger = new Logger('Validation');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      this.logger.debug(error.message);
      throw error;
    }
  }
}

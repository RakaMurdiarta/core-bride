import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodError } from 'zod';
import { ApiResponse } from '../api/base-response';

@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 400;

    const __response: ApiResponse<any> = {
      data: null,
      message: `property ${exception.errors[0].path[0]}, ${exception.errors[0].message}`,
      metaData: {
        timestamp: new Date().toISOString(),
      },
      statusCode: status,
    };
    response.status(status).json(__response);
  }
}

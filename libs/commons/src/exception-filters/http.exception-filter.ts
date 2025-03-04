import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../api/base-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorMessage =
      typeof exception.getResponse === 'function'
        ? typeof exception.getResponse() === 'string'
          ? exception.getResponse()
          : exception.getResponse()['message']
        : exception.message;

    const __response: ApiResponse<any> = {
      data: null,
      message: errorMessage,
      metaData: {
        timestamp: new Date().toISOString(),
      },
      statusCode: status,
    };

    response.status(status).json(__response);
  }
}

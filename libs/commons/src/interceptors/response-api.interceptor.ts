import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from '../api/base-response';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE_METADATA } from '../decorators/response-message.decorator';
import { format } from 'date-fns';

@Injectable()
export class ResponseApiInterceptor<ResponseDataType>
  implements
    NestInterceptor<
      ApiResponse<ResponseDataType>,
      ApiResponse<ResponseDataType>
    >
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<ApiResponse<ResponseDataType>>,
  ):
    | Observable<ApiResponse<ResponseDataType>>
    | Promise<Observable<ApiResponse<ResponseDataType>>> {
    return next
      .handle()
      .pipe(
        map((res: ApiResponse<ResponseDataType>) =>
          this.responseHandler(res, context),
        ),
      );
  }

  responseHandler(
    res: ApiResponse<ResponseDataType>,
    context: ExecutionContext,
  ) {
    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ) || 'operation success';
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const statusCode = response.statusCode;

    const __response: ApiResponse<ResponseDataType> = {
      message: message,
      data: res.data,
      statusCode,
      metaData: {
        timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
      },
    };

    return __response;
  }
}

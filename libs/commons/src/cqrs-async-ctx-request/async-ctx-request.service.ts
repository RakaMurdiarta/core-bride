import { Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';

@Injectable({
  scope: Scope.REQUEST,
})
export class AsyncCtxRequestService {
  static __requestCtx?: Request;
  constructor() {}

  get requestCtx(): Request | undefined {
    return AsyncCtxRequestService.__requestCtx;
  }

  setRequestCtx(req: Request) {
    AsyncCtxRequestService.__requestCtx = req;
  }
}

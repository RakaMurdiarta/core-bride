import { DataSource, EntityManager, Repository } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '@interceptors/db-transaction.interceptor';
import { Request } from 'express';
import { AsyncCtxRequestService } from '../cqrs-async-ctx-request/async-ctx-request.service';

export class BaseRepository<T> {
  private readonly entityManager: EntityManager;
  constructor(
    private dataSource: DataSource,
    private commonsRequest: Request,
    private entity: new () => T,
    private asyncCtxRequest?: AsyncCtxRequestService,
  ) {
    this.entityManager = this.resolveEntityManager();
  }

  private resolveEntityManager(): EntityManager {
    const requestInstance = this.getRequestInstance();
    return requestInstance[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
  }

  protected get repo(): Repository<T> {
    return this.entityManager.getRepository(this.entity);
  }

  private getRequestInstance(): Request {
    if (this.asyncCtxRequest && this.asyncCtxRequest.requestCtx) {
      return this.asyncCtxRequest.requestCtx;
    }
    return this.commonsRequest;
  }
}

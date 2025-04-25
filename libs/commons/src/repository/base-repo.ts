import { DataSource, EntityManager, Repository } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '@app/commons/db-transaction/db-transaction.interceptor';
import { Request } from 'express';

export class BaseRepository<T> {
  private readonly entityManager: EntityManager;
  constructor(
    private dataSource: DataSource,
    private commonsRequest: Request,
    private entity: new () => T,
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
    return this.commonsRequest;
  }
}

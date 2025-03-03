import { DataSource, EntityManager, Repository } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '@interceptors/db-transaction.interceptor';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    ENTITY_MANAGER?: EntityManager;
  }
}

export class BaseRepository<T> {
  constructor(
    private dataSource: DataSource,
    private request: Request,
    private entity: new () => T,
  ) {}

  protected getRepository<T>(entityCls: new () => T): Repository<T> {
    const entityManager: EntityManager =
      this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }

  protected get repo(): Repository<T> {
    return this.getRepository(this.entity);
  }
}

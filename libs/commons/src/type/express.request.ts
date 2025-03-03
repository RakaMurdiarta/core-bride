import { type EntityManager } from 'typeorm';

declare module 'express' {
  interface Request {
    ENTITY_MANAGER?: EntityManager;
  }
}

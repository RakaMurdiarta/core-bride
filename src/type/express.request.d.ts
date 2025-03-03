// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express';
import { type EntityManager } from 'typeorm';

declare global {
  namespace Express {
    interface Request {
      ENTITY_MANAGER?: EntityManager; // Example of another custom property
    }
  }
}

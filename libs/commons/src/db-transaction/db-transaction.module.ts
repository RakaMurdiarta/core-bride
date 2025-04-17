import { Module } from '@nestjs/common';
import {
  __DbTransactionalJobServiceTOKEN,
  DbTransactionalJobService,
} from './job-db-transaction';

@Module({
  imports: [],
  exports: [__DbTransactionalJobServiceTOKEN],
  providers: [
    {
      provide: __DbTransactionalJobServiceTOKEN,
      useClass: DbTransactionalJobService,
    },
  ],
})
export class DBTransactionModule {}

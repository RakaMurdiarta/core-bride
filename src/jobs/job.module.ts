import { Module } from '@nestjs/common';
import { JobFailedRepo } from './repo/job-failed.repo';
import { CreateJobFailedHandler } from './commands/create-job-failed.handler';

@Module({
  imports: [],
  providers: [JobFailedRepo, CreateJobFailedHandler],
  exports: [CreateJobFailedHandler, JobFailedRepo],
})
export class JobModule {}

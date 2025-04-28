import {
  QueueEventsHost,
  QueueEventsListener,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { DistributedProjectQueue } from '../constants/distributed-project.token';

@QueueEventsListener(DistributedProjectQueue)
@Injectable()
export class DistributedProjectProducer extends QueueEventsHost {
  constructor(@Inject(LoggerKey) private logger: Logger) {
    super();
  }
  @OnQueueEvent('retries-exhausted')
  onRetryExeceed(job: { jobId: string; prev?: string }) {
    console.log('max-retries-execute', job.prev, job.jobId);
    //should call service notify like telegram bot or slack
    // this.logger.info(`Processing job ${job.jobId}...`);
  }
}

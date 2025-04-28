import {
  QueueEventsHost,
  QueueEventsListener,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { ProjectQueue } from '../constants/project.token';
import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from '@logger/domain/logger';

@QueueEventsListener(ProjectQueue)
@Injectable()
export class ProjectProducer extends QueueEventsHost {
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

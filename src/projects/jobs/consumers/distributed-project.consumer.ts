import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { DistributedProjectQueue } from '../constants/distributed-project.token';
import { Job } from 'bullmq';
import { ProjectCreatedEvent } from '@root/projects/events/project-create.event';
import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProjectDistributeCommand } from '@root/projects/commands/project-dispatcher.command';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { CreateJobFailedCommand } from '@root/jobs/commands/create-job-failed.command';

@Processor(DistributedProjectQueue)
@Injectable()
export class DistributedProjectConsumer extends WorkerHost {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(LoggerKey) private logger: Logger,
  ) {
    super();
  }
  async process(job: Job<ProjectCreatedEvent>): Promise<any> {
    try {
      const arg = job.data;
      await this.commandBus.execute(
        new CreateProjectDistributeCommand(
          arg.name,
          arg.projectType,
          arg.status,
          arg.companyId,
          arg.number,
          arg.projectId,
        ),
      );
    } catch (error) {
      this.logger.error(`${error.message}`, {
        error: error.message,
        context: DistributedProjectConsumer.name,
        props: {
          functionName: 'process',
        },
      });
      throw error;
    }
  }
  @OnWorkerEvent('failed')
  async onFailed(job: Job): Promise<void> {
    this.logger.info(
      `${job.id} - ${job.name} is retry cause ${job.failedReason} with attempts : ${job.attemptsMade}`,
    );
    if (job.attemptsMade === 3) {
      const args = new CreateJobFailedCommand(
        job.name,
        job.id,
        job.queueName,
        JSON.stringify(job.data),
        'DISTRIBUTED_PROJECT',
        'Project',
        'FAILED',
        job.failedReason,
        'PENDING',
        false,
      );
      //pakai upsert aja
      await this.commandBus.execute(args);
    }
  }
  @OnWorkerEvent('error')
  async onError(job: Job): Promise<void> {
    this.logger.error(job.failedReason);
  }
}

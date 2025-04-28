import { Processor, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { ProjectQueue } from '../constants/project.token';
import { CreateProjectCommand } from '@root/projects/commands/create-project.command';
import { IWorkerListener } from '@app/commons/queue/redis-bull/listeners/Iworker.listener';
import { CreateJobFailedCommand } from '@root/jobs/commands/create-job-failed.command';

@Processor(ProjectQueue)
@Injectable()
export class ProjectConsumer extends IWorkerListener {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(LoggerKey) private logger: Logger,
  ) {
    super();
  }
  async process(job: Job<CreateProjectCommand>): Promise<any> {
    try {
      const arg = job.data;

      await this.commandBus.execute(
        new CreateProjectCommand(
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
        context: ProjectConsumer.name,
        props: {
          functionName: 'process',
        },
      });
      if (error instanceof HttpException) {
        if (error.getStatus() === HttpStatus.CONFLICT) {
          return;
        }

        throw error;
      } else {
        throw error;
      }
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
        'CORE_PROJECT',
        'Project',
        'FAILED',
        job.failedReason,
        'PENDING',
        false,
      );

      await this.commandBus.execute(args);
    }
  }
  @OnWorkerEvent('error')
  async onError(job: Job): Promise<void> {
    this.logger.error(job.failedReason);
  }
}

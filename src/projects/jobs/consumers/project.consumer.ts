import { Processor, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { ProjectQueue } from '../constants/project.token';
import { CreateProjectCommand } from '@root/projects/commands/create-project.command';
import { IWorkerListener } from '@app/commons/queue/redis-bull/listeners/Iworker.listener';

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
      throw new Error('ssf');
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
      throw error;
    }
  }
  @OnWorkerEvent('failed')
  async onFailed(job: Job): Promise<void> {
    console.log('failed');
    console.log(job.attemptsMade);

    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`,
    );
  }
  @OnWorkerEvent('error')
  async onError(job: Job): Promise<void> {
    console.log('error');

    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`,
    );
  }
}

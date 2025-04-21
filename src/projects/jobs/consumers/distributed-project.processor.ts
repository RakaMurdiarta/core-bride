import { Processor, WorkerHost } from '@nestjs/bullmq';
import { DistributedProjectQueue } from '../constants/distributed-project.token';
import { Job } from 'bullmq';
import { ProjectCreatedEvent } from '@root/projects/events/project-create.event';
import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProjectDistributeCommand } from '@root/projects/commands/project-dispatcher.command';
import Logger, { LoggerKey } from '@logger/domain/logger';

@Processor(DistributedProjectQueue)
@Injectable()
export class DistributedProjectProcessor extends WorkerHost {
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
        context: DistributedProjectProcessor.name,
        props: {
          functionName: 'process',
        },
      });
      throw error;
    }
  }
}

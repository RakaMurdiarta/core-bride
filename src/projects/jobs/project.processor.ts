import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { ProjectQueue } from './project.token';
import { CreateProjectCommand } from '../commands/create-project.command';

@Processor(ProjectQueue)
@Injectable()
export class ProjectProcessor extends WorkerHost {
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
        context: ProjectProcessor.name,
        props: {
          functionName: 'process',
        },
      });
      throw error;
    }
  }
}

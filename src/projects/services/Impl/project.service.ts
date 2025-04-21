import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { IProjectService } from '../Iproject.service';
import { CreateProjectDto } from '@root/projects/zod-schema/create-project.schema';
import { CreateProjectCommand } from '@root/projects/commands/create-project.command';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { UpdateProjectResponse } from '@root/projects/dao/update-project.dao';
import { UpdateProjectDto } from '@root/projects/zod-schema/update-project.schema';
import { UpdateProjectCommand } from '@root/projects/commands/update-project.command';
import { ProjectCreatedEvent } from '@root/projects/events/project-create.event';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  ProjectJobKeyName,
  ProjectQueue,
} from '@root/projects/jobs/constants/project.token';
import { v7 as uuid_v7 } from 'uuid';
import { RetryConfig } from '@app/commons/queue/redis-bull/retry.config';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectQueue(ProjectQueue)
    private readonly queue: Queue<any, any, any, CreateProjectCommand>,
    private readonly eventBus: EventBus,
    @Inject(LoggerKey) private logger: Logger,
  ) {}

  async createProject(arg: CreateProjectDto): Promise<string> {
    try {
      this.logger.debug('Create Project Job prepare for dispatch', {
        props: {
          ...arg,
        },
        context: ProjectService.name,
      });

      const uuid = uuid_v7();

      const commandPayload = new CreateProjectCommand(
        arg.name,
        arg.projectType,
        arg.status,
        arg.companyId,
        arg.number,
        arg.projectId,
      );

      await this.queue.add(ProjectJobKeyName, commandPayload, {
        jobId: uuid,
        attempts: 3,
        backoff: RetryConfig,
      });

      this.logger.debug('Create Project Job prepare dispatched');

      //call event dispatch
      this.eventBus.publish(
        new ProjectCreatedEvent(
          arg.name,
          arg.projectType,
          arg.status,
          arg.companyId,
          arg.number,
          arg.projectId,
        ),
      );

      return 'Job Create Project has been Dispatched';
    } catch (error) {
      this.logger.error(`${error.message}`, {
        error: error.message,
        context: ProjectService.name,
        props: {
          functionName: 'createProject',
        },
      });
      throw error;
    }
  }

  async updateProject(arg: UpdateProjectDto): Promise<UpdateProjectResponse> {
    try {
      this.logger.debug('UpdateProjectCommand prepare execute', {
        props: {
          ...arg,
        },
        context: ProjectService.name,
      });

      const cmd = await this.commandBus.execute(
        new UpdateProjectCommand(
          arg.projectId,
          arg.name,
          arg.projectType,
          arg.status,
          arg.companyId,
          arg.number,
        ),
      );

      return cmd;
    } catch (error) {
      this.logger.error(`${error.message}`, {
        error: error.message,
        context: ProjectService.name,
        props: {
          functionName: 'updateProject',
        },
      });
      throw error;
    }
  }
}

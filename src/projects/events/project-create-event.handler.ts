import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectCreatedEvent } from './project-create.event';
import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import {
  distributedProjectJobKeyName,
  DistributedProjectQueue,
} from '../jobs/distributed-project.token';
import { Queue } from 'bullmq';
import { v7 as uuid_v7 } from 'uuid';
import Logger, { LoggerKey } from '@logger/domain/logger';

@EventsHandler(ProjectCreatedEvent)
@Injectable()
export class ProjectCreatedEventHandler
  implements IEventHandler<ProjectCreatedEvent>
{
  constructor(
    @InjectQueue(DistributedProjectQueue)
    private readonly queue: Queue<any, any, any, ProjectCreatedEvent>,
    @Inject(LoggerKey) private logger: Logger,
  ) {}
  async handle(event: ProjectCreatedEvent) {
    //this will use for publish queue distribute project
    try {
      throw new Error('HAI error');
      this.logger.debug('Event Bus is triggered', {
        props: {
          ...event,
        },
        context: ProjectCreatedEventHandler.name,
      });

      const uuid = uuid_v7();

      await this.queue.add(distributedProjectJobKeyName, event, {
        jobId: uuid,
        attempts: 3,
      });
    } catch (error) {
      this.logger.error('Event Bus is triggered Error', {
        props: {
          ...event,
        },
        error: error,
        context: ProjectCreatedEventHandler.name,
      });

      throw error;
    }
  }
}

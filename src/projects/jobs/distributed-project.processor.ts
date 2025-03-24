import { Processor, WorkerHost } from '@nestjs/bullmq';
import { DistributedProjectQueue } from './distributed-project.token';
import { Job } from 'bullmq';
import { ProjectCreatedEvent } from '@root/projects/events/project-create.event';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Processor(DistributedProjectQueue)
@Injectable()
export class DistributedProjectProcessor extends WorkerHost {
  constructor(private readonly commandBus: CommandBus) {
    super();
  }
  async process(job: Job<ProjectCreatedEvent>, token?: string): Promise<any> {
    console.log(token);
  }
}

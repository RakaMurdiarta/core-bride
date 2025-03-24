import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectCreatedEvent } from './project-create.event';
import { Injectable } from '@nestjs/common';

@EventsHandler(ProjectCreatedEvent)
@Injectable()
export class ProjectCreatedEventHandler
  implements IEventHandler<ProjectCreatedEvent>
{
  constructor() {}
  async handle(event: ProjectCreatedEvent) {
    //this will use for publish queue distribute project
    console.log(event);
  }
}

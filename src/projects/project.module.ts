import { Module } from '@nestjs/common';
import { CreateProjectHandler } from './commands/create-project.handler';
import { ProjectService } from './services/Impl/project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './repo/project.repository';
import { UpdateProjectHandler } from './commands/update-project.handler';
import { SiaModule } from '../sia/sia.module';
import { QRTrackModule } from '../qr-track/qr-track.module';
import { ProjectsDispatcher } from './shared/distibute-project-dispatch.service';
import { ProjectCreatedEventHandler } from './events/project-create-event.handler';
import { RedisBullQueueModule } from '@app/commons/queue/redis-bull/redis-bull.module';
import { DistributedProjectQueue } from './jobs/distributed-project.token';
import { DistributedProjectProcessor } from './jobs/distributed-project.processor';
import { CQRS_ASYNC_CTX_REQUEST_TOKEN } from '@app/commons/cqrs-async-ctx-request/async-ctx-request-token';
import { AsyncCtxRequestService } from '@app/commons/cqrs-async-ctx-request/async-ctx-request.service';
import { CreateProjectDistributeHandler } from './commands/project-dispatch.handler';

@Module({
  imports: [
    SiaModule,
    QRTrackModule,
    RedisBullQueueModule.register({
      queues: [DistributedProjectQueue],
    }),
  ],
  providers: [
    CreateProjectHandler,
    UpdateProjectHandler,
    ProjectService,
    ProjectRepository,
    ProjectsDispatcher,
    ProjectCreatedEventHandler,
    DistributedProjectProcessor,
    CreateProjectDistributeHandler,
    {
      provide: CQRS_ASYNC_CTX_REQUEST_TOKEN,
      useClass: AsyncCtxRequestService,
    },
  ],
  exports: [
    CreateProjectHandler,
    UpdateProjectHandler,
    ProjectService,
    ProjectRepository,
    ProjectsDispatcher,
  ],
  controllers: [ProjectController],
})
export class ProjectModule {}

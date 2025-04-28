import { Module } from '@nestjs/common';
import { CreateProjectHandler } from './commands/create-project.handler';
import { ProjectService } from './services/Impl/project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './repo/project.repository';
import { UpdateProjectHandler } from './commands/update-project.handler';
import { SiaModule } from '../sia/sia.module';
import { QRTrackModule } from '../qr-track/qr-track.module';
import { ProjectsDispatcher } from './shared/distribute-project-dispatch.service';
import { ProjectCreatedEventHandler } from './events/project-create-event.handler';
import { RedisBullQueueModule } from '@app/commons/queue/redis-bull/redis-bull.module';
import { DistributedProjectQueue } from './jobs/constants/distributed-project.token';
import { CreateProjectDistributeHandler } from './commands/project-dispatch.handler';
import { ProjectQueue } from './jobs/constants/project.token';
import { ProjectConsumer } from './jobs/consumers/project.consumer';
import { DBTransactionModule } from '@app/commons/db-transaction/db-transaction.module';
import { DistributedProjectConsumer } from './jobs/consumers/distributed-project.consumer';
import { ProjectProducer } from './jobs/producers/project.producer';
import { JobModule } from '../jobs/job.module';
import { DistributedProjectProducer } from './jobs/producers/distributed-project.producer';

@Module({
  imports: [
    SiaModule,
    QRTrackModule,
    RedisBullQueueModule.register({
      queues: [DistributedProjectQueue, ProjectQueue],
    }),
    DBTransactionModule,
    JobModule,
  ],
  providers: [
    CreateProjectHandler,
    UpdateProjectHandler,
    ProjectService,
    ProjectRepository,
    ProjectsDispatcher,
    ProjectCreatedEventHandler,
    DistributedProjectConsumer,
    ProjectProducer,
    DistributedProjectProducer,
    ProjectConsumer,
    CreateProjectDistributeHandler,
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

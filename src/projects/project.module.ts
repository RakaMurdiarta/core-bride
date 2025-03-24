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

@Module({
  imports: [SiaModule, QRTrackModule],
  providers: [
    CreateProjectHandler,
    UpdateProjectHandler,
    ProjectService,
    ProjectRepository,
    ProjectsDispatcher,
    ProjectCreatedEventHandler,
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

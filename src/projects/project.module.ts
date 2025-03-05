import { Module } from '@nestjs/common';
import { CreateProjectHandler } from './commands/create-project.handler';
import { ProjectService } from './services/Impl/project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './repo/project.repository';

@Module({
  providers: [CreateProjectHandler, ProjectService, ProjectRepository],
  exports: [CreateProjectHandler, ProjectService, ProjectRepository],
  controllers: [ProjectController],
})
export class ProjectModule {}

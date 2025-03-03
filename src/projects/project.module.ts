import { Module } from '@nestjs/common';
import { CreateProjectHandler } from './commands/create-project.handler';
import { ProjectService } from './services/Impl/project.service';

@Module({
  providers: [CreateProjectHandler, ProjectService],
  exports: [CreateProjectHandler, ProjectService],
})
export class ProjectModule {}

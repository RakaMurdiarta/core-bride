import { Module } from '@nestjs/common';
import { CreateProjectHandler } from './commands/create-project.handler';
import { ProjectService } from './services/Impl/project.service';
import { ProjectController } from './project.controller';

@Module({
  providers: [CreateProjectHandler, ProjectService],
  exports: [CreateProjectHandler, ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}

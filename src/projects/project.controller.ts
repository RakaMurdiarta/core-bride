import { Body, Controller, Post } from '@nestjs/common';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectService } from './services/Impl/project.service';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}
  @Post()
  async create(@Body() payload: CreateProjectDto) {
    return await this.projectService.createProject(payload);
  }
}

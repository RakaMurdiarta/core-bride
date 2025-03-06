import { Body, Controller, Patch, Post, UseInterceptors } from '@nestjs/common';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectService } from './services/Impl/project.service';
import { TransactionInterceptor } from '@app/commons/interceptors/db-transaction.interceptor';
import { ResponseApiInterceptor } from '@app/commons/interceptors/response-api.interceptor';
import { ApiResponse } from '@app/commons/api/base-response';
import { CreateProjectResponse } from './dao/create-project.dao';
import { ResponseMessage } from '@app/commons/decorators/response-message.decorator';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { UpdateProjectResponse } from './dao/update-project.dao';

@Controller('project')
@UseInterceptors(ResponseApiInterceptor)
export class ProjectController {
  constructor(private projectService: ProjectService) {}
  @UseInterceptors(TransactionInterceptor)
  @ResponseMessage('project created')
  @Post()
  async create(
    @Body() payload: CreateProjectDto,
  ): Promise<ApiResponse<CreateProjectResponse>> {
    const project = await this.projectService.createProject(payload);

    return {
      data: project,
    };
  }

  @UseInterceptors(TransactionInterceptor)
  @ResponseMessage('project updated')
  @Patch()
  async update(
    @Body() payload: UpdateProjectDto,
  ): Promise<ApiResponse<UpdateProjectResponse>> {
    const project = await this.projectService.updateProject(payload);

    return {
      data: project,
    };
  }
}

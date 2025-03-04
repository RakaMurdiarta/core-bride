import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectService } from './services/Impl/project.service';
import { TransactionInterceptor } from '@app/commons/interceptors/db-transaction.interceptor';
import { ResponseApiInterceptor } from '@app/commons/interceptors/response-api.interceptor';
import { ApiResponse } from '@app/commons/api/base-response';
import { CreateProjectResponse } from './dao/create-project.dao';
import { ResponseMessage } from '../../libs/commons/src/decorators/response-message.decorator';

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
}

import {
  Body,
  Controller,
  Inject,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { TransactionInterceptor } from '@app/commons/db-transaction/db-transaction.interceptor';
import { ApiResponse } from '@app/commons/api/base-response';
import { ResponseMessage } from '@app/commons/decorators/response-message.decorator';
import { UpdateProjectResponse } from './dao/update-project.dao';
import { ZodPipe } from '@app/commons/pipes/zod.pipe';
import {
  CreateProjectDto,
  createProjectSchema,
} from './zod-schema/create-project.schema';
import Logger, { LoggerKey } from '@app/commons/logger/domain/logger';
import {
  UpdateProjectDto,
  updateProjectSchema,
} from './zod-schema/update-project.schema';
import { ProjectService } from './services/Impl/project.service';

@Controller('projects')
// @UseInterceptors(ResponseApiInterceptor)
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    @Inject(LoggerKey) private logger: Logger,
  ) {}
  @UsePipes(new ZodPipe(createProjectSchema))
  @ResponseMessage('project created')
  @Post()
  async create(
    @Body() payload: CreateProjectDto,
  ): Promise<ApiResponse<string>> {
    const res = await this.projectService.createProject(payload);

    return {
      data: res,
    };
  }

  @UsePipes(new ZodPipe(updateProjectSchema))
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

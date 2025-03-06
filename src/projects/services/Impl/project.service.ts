import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IProjectService } from '../Iproject.service';
import { CreateProjectDto } from '@root/projects/dtos/create-project.dto';
import { CreateProjectCommand } from '@root/projects/commands/create-project.command';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { CreateProjectResponse } from '@root/projects/dao/create-project.dao';
import { UpdateProjectResponse } from '@root/projects/dao/update-project.dao';
import { UpdateProjectDto } from '@root/projects/dtos/update-project.dto';
import { UpdateProjectCommand } from '../../commands/update-project.command';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(LoggerKey) private logger: Logger,
  ) {}

  async createProject(arg: CreateProjectDto): Promise<CreateProjectResponse> {
    try {
      this.logger.debug('CreateProjectCommand prepare execute', {
        props: {
          ...arg,
        },
        context: ProjectService.name,
      });
      const cmd = await this.commandBus.execute(
        new CreateProjectCommand(
          arg.name,
          arg.propertyType,
          arg.status,
          arg.companyId,
          arg.number,
          arg.projectId,
        ),
      );
      this.logger.debug('CreateProjectCommand executed');

      return cmd;
    } catch (error) {
      this.logger.error(`${error.message}`, {
        error: error.message,
        context: ProjectService.name,
        props: {
          functionName: 'createProject',
        },
      });
      throw error;
    }
  }

  async updateProject(arg: UpdateProjectDto): Promise<UpdateProjectResponse> {
    try {
      this.logger.debug('UpdateProjectCommand prepare execute', {
        props: {
          ...arg,
        },
        context: ProjectService.name,
      });

      const cmd = await this.commandBus.execute(
        new UpdateProjectCommand(
          arg.projectId,
          arg.name,
          arg.propertyType,
          arg.status,
          arg.companyId,
          arg.number,
        ),
      );

      return cmd;
    } catch (error) {
      this.logger.error(`${error.message}`, {
        error: error.message,
        context: ProjectService.name,
        props: {
          functionName: 'updateProject',
        },
      });
      throw error;
    }
  }
}

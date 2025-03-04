import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from './create-project.command';
import { ProjectEntity } from '../project.entity';
import { DataSource } from 'typeorm';
import {
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '@app/commons/repository/base-repo';
import { Request } from 'express';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { CreateProjectResponse } from '../dao/create-project.dao';

@Injectable({ scope: Scope.REQUEST })
@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  extends BaseRepository<ProjectEntity>
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    dataSource: DataSource,
    @Inject(REQUEST) req: Request,
    @Inject(LoggerKey) private logger: Logger,
  ) {
    super(dataSource, req as Request, ProjectEntity);
  }

  async execute(command: CreateProjectCommand): Promise<CreateProjectResponse> {
    try {
      const getProjectById = await this.repo.findOne({
        where: {
          projectId: command.projectId,
          name: command.name,
        },
      });

      if (getProjectById) {
        throw new ConflictException('project already exist');
      }

      const project = this.repo.create({ ...command });

      this.logger.debug('Prepare save to Project Table', {
        props: {
          ...command,
        },
      });
      await this.repo.save(project).catch((error) => {
        this.logger.error(error.message, {
          error: error.message,
          props: {
            functionName: 'repo save',
            line: '52',
          },
        });

        throw new UnprocessableEntityException('Failed to create project');
      });

      return {
        id: project.id,
      };
    } catch (error) {
      throw error;
    }
  }
}

import {
  Inject,
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { ProjectEntity } from '../project.entity';
import { BaseRepository } from '@app/commons/repository/base-repo';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { CreateProjectCommand } from '../commands/create-project.command';
import { UpdateProjectCommand } from '../commands/update-project.command';
import { CQRS_ASYNC_CTX_REQUEST_TOKEN } from '@app/commons/cqrs-async-ctx-request/async-ctx-request-token';
import { AsyncCtxRequestService } from '@app/commons/cqrs-async-ctx-request/async-ctx-request.service';

@Injectable({
  scope: Scope.REQUEST,
})
export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor(
    dataSource: DataSource,
    @Inject(REQUEST) commonsRequest: Request,
    @Inject(LoggerKey) private logger: Logger,
    @Inject(CQRS_ASYNC_CTX_REQUEST_TOKEN)
    private async_req_ctx: AsyncCtxRequestService,
  ) {
    super(dataSource, commonsRequest, ProjectEntity, async_req_ctx);
  }
  async findBy(where: FindOneOptions<ProjectEntity>) {
    return await this.repo.findOne(where);
  }

  async create(cmd: CreateProjectCommand) {
    const project = this.repo.create({ ...cmd });

    this.logger.debug('create project progress', {
      props: {
        ...cmd,
      },
    });
    const projectSave = await this.repo.save(project).catch((error) => {
      this.logger.error(error.message, {
        error: error.message,
        props: {
          location: `${ProjectRepository.name} method : create`,
        },
      });

      throw new UnprocessableEntityException('Failed to create project');
    });

    return projectSave;
  }

  async update(cmd: UpdateProjectCommand, project: ProjectEntity) {
    this.logger.debug('update project progress', {
      props: {
        ...cmd,
      },
    });

    Object.keys(cmd).forEach((key) => {
      if (key === 'projectId') {
        return;
      }

      if (cmd[key] !== undefined && cmd[key] !== null) {
        project[key] = cmd[key];
      }
    });

    await this.repo.save(project).catch((error) => {
      this.logger.error(error.message, {
        error: error.message,
        props: {
          location: `${ProjectRepository.name} method : update`,
        },
      });

      throw new UnprocessableEntityException('Failed to update project');
    });

    return project;
  }
}

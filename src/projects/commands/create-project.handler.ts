import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from './create-project.command';
import { ProjectEntity } from '../project.entity';
import { DataSource } from 'typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '../../../libs/commons/src/repository/base-repo';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  extends BaseRepository<ProjectEntity>
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req as Request, ProjectEntity);
  }

  async execute(command: CreateProjectCommand): Promise<{ id: string }> {
    const project = this.repo.create({ ...command });

    await this.repo.save(project);

    return {
      id: project.id,
    };
  }
}

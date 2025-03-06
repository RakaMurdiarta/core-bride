import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Inject,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { ProjectRepository } from '../repo/project.repository';
import { UpdateProjectCommand } from './update-project.command';
import { UpdateProjectResponse } from '../dao/update-project.dao';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler
  implements ICommandHandler<UpdateProjectCommand>
{
  constructor(
    @Inject(LoggerKey) private logger: Logger,
    private projectRepo: ProjectRepository,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<UpdateProjectResponse> {
    try {
      const getProjectById = await this.projectRepo.findBy({
        where: {
          projectId: command.projectId,
        },
      });

      if (!getProjectById) {
        throw new NotFoundException('project not found');
      }

      const project = await this.projectRepo.update(command, getProjectById);

      if (!project) {
        throw new UnprocessableEntityException('no update found');
      }

      return {
        id: project.id,
      };
    } catch (error) {
      throw error;
    }
  }
}

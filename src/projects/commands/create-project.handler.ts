import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from './create-project.command';
import { ConflictException, Inject } from '@nestjs/common';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { CreateProjectResponse } from '../dao/create-project.dao';
import { ProjectRepository } from '../repo/project.repository';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    @Inject(LoggerKey) private logger: Logger,
    private projectRepo: ProjectRepository,
  ) {}

  async execute(command: CreateProjectCommand): Promise<CreateProjectResponse> {
    try {
      const getProjectById = await this.projectRepo.findBy({
        where: {
          projectId: command.projectId,
          name: command.name,
        },
      });

      if (getProjectById) {
        throw new ConflictException('project already exist');
      }

      const project = await this.projectRepo.create(command);

      return {
        id: project.id,
      };
    } catch (error) {
      throw error;
    }
  }
}

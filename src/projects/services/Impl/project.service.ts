import { Injectable } from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import { IProjectService } from '../Iproject.service';
import { CreateProjectDto } from '@root/projects/dtos/create-project.dto';
import { CreateProjectCommand } from '@root/projects/commands/create-project.command';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(private readonly commandBus: CommandBus) {}

  async createProject(arg: CreateProjectDto): Promise<{ id: string }> {
    return this.commandBus.execute(
      new CreateProjectCommand(arg.name, arg.type, arg.status),
    );
  }
}

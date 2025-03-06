import { Command } from '@nestjs/cqrs';
import { UpdateProjectResponse } from '../dao/update-project.dao';

export class UpdateProjectCommand extends Command<UpdateProjectResponse> {
  constructor(
    public readonly projectId: number,
    public readonly name?: string,
    public readonly projectType?: string,
    public readonly status?: string,
    public readonly companyId?: string,
    public readonly number?: string,
  ) {
    super();
  }
}

import { Command } from '@nestjs/cqrs';
import { CreateProjectResponse } from '../dao/create-project.dao';

export class CreateProjectCommand extends Command<CreateProjectResponse> {
  constructor(
    public readonly name: string,
    public readonly projectType: string,
    public readonly status: string,
    public readonly companyId: string,
    public readonly number: string,
    public readonly projectId: number,
  ) {
    super();
  }
}

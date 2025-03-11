import { Command } from '@nestjs/cqrs';
import { DistributedProjectResponse } from '../dao/distributed-project.dao';

export class CreateProjectDistributeCommand extends Command<DistributedProjectResponse> {
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

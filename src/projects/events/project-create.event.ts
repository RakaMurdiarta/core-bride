import { IEvent } from '@nestjs/cqrs';

export class ProjectCreatedEvent implements IEvent {
  constructor(
    public readonly name: string,
    public readonly projectType: string,
    public readonly status: string,
    public readonly companyId: string,
    public readonly number: string,
    public readonly projectId: number,
  ) {}
}

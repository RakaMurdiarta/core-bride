import { Command } from '@nestjs/cqrs';

export class CreateProjectCommand extends Command<{ id: string }> {
  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly status: string,
  ) {
    super();
  }
}

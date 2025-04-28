import { Inject, Injectable } from '@nestjs/common';
import { CreateJobFailedCommand } from './create-job-failed.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { JobFailedRepo } from '../repo/job-failed.repo';

@CommandHandler(CreateJobFailedCommand)
@Injectable()
export class CreateJobFailedHandler
  implements ICommandHandler<CreateJobFailedCommand>
{
  constructor(
    @Inject(LoggerKey) private logger: Logger,
    private jobsRepo: JobFailedRepo,
  ) {}

  async execute(command: CreateJobFailedCommand): Promise<void> {
    try {
      await this.jobsRepo.create(command);
    } catch (error) {
      throw error;
    }
  }
}

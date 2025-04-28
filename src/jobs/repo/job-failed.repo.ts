import {
  Inject,
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseRepository } from '@app/commons/repository/base-repo';
import { JobFailedEntity } from '../job-failed.entity';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { Request } from 'express';
import { CreateJobFailedCommand } from '../commands/create-job-failed.command';

@Injectable({
  scope: Scope.REQUEST,
})
export class JobFailedRepo extends BaseRepository<JobFailedEntity> {
  constructor(
    dataSource: DataSource,
    @Inject(REQUEST) commonsRequest: Request,
    @Inject(LoggerKey) private logger: Logger,
  ) {
    super(dataSource, commonsRequest, JobFailedEntity);
  }

  async create(cmd: CreateJobFailedCommand): Promise<JobFailedEntity> {
    const jobFailed = this.repo.create({
      queueName: cmd.queueName,
      jobStatus: cmd.jobStatus,
      jobName: cmd.jobName,
      jobId: cmd.jobId,
      typeIdentifier: cmd.typeIdentifier,
      target: cmd.target,
      payloads: cmd.payloads,
      isReschedule: cmd.isReschedule,
      rescheduleStatus: cmd.rescheduleStatus,
      failedReason: cmd.failedReason,
    });

    await this.repo
      .upsert(jobFailed, {
        conflictPaths: {
          jobId: true,
        },
      })
      .catch((error) => {
        this.logger.error(error.message, {
          error: error.message,
          props: {
            location: `${JobFailedRepo.name} method : create`,
          },
        });

        throw new UnprocessableEntityException('Failed to create job failed');
      });

    return jobFailed;
  }
}

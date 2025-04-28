import {
  JobStatus,
  RESCHEDULE_STATUS,
  TARGET,
  TYPE_IDENTIFIER,
} from '../job.type';

export class CreateJobFailedCommand {
  constructor(
    public readonly jobName: string,
    public readonly jobId: string,
    public readonly queueName: string,
    public readonly payloads: string,
    public readonly target: TARGET,
    public readonly typeIdentifier: TYPE_IDENTIFIER,
    public readonly jobStatus: JobStatus,
    public readonly failedReason: string,
    public readonly rescheduleStatus?: RESCHEDULE_STATUS,
    public readonly isReschedule?: boolean,
  ) {}
}

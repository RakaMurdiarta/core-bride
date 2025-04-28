import { Column, Entity, Unique } from 'typeorm';
import { BaseSchemaUUID } from '@app/commons/entities/base/entity.abstract';

@Entity({ name: JobFailedEntity.tableName })
@Unique('uq_JobFailed_job_key', ['jobId'])
export class JobFailedEntity extends BaseSchemaUUID {
  static tableName = 'jobs_failed';

  @Column({ type: 'varchar', name: 'queue_name' })
  queueName: string;

  @Column({ type: 'varchar', name: 'job_name' })
  jobName: string;

  @Column({ type: 'varchar', name: 'job_id' })
  jobId: string;

  @Column({ type: 'text' })
  payloads: string;

  @Column({ type: 'varchar', name: 'target' })
  target: string;

  @Column({ type: 'varchar', name: 'type_identifier' })
  typeIdentifier: string;

  @Column({ type: 'varchar', name: 'job_status' })
  jobStatus: string;

  @Column({ type: 'varchar', name: 'failed_reason' })
  failedReason: string;

  @Column({ type: 'boolean', name: 'is_reschedule', default: false })
  isReschedule: boolean;

  @Column({ type: 'varchar', name: 'reschedule_status' })
  rescheduleStatus: string;
}

import { Column, Entity, Unique } from 'typeorm';
import { BaseSchemaUUID } from '@app/commons/entities/base/entity.abstract';

@Entity({ name: JobFailedEntity.tableName })
@Unique('uq_JobFailed_job_key', ['jobKey'])
export class JobFailedEntity extends BaseSchemaUUID {
  static tableName = 'jobs_failed';

  @Column({ type: 'varchar', name: 'job_key' })
  jobKey: string;

  @Column({ type: 'varchar', name: 'queue_name' })
  queueName: string;

  @Column({ type: 'text' })
  payloads: string;

  @Column({ type: 'varchar', name: 'target' })
  target: string;

  @Column({ type: 'varchar', name: 'type_identifier' })
  typeIdentifier: string;

  @Column({ type: 'varchar' })
  status: string;
}

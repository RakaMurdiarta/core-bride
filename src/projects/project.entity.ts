import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { BaseSchemaUUID } from '@app/commons/entities/base/entity.abstract';

@Entity({ name: ProjectEntity.tableName })
@Unique('uq_project_name', ['name'])
export class ProjectEntity extends BaseSchemaUUID {
  static tableName = 'projects';

  @PrimaryColumn({ type: 'varchar', name: 'project_id' })
  projectId: number;

  @Column({ type: 'varchar', name: 'company_id' })
  companyId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', name: 'project_type', nullable: true })
  projectType?: string;

  @Column({ type: 'varchar', nullable: true })
  number?: string;

  @Column({ type: 'varchar', nullable: true })
  status?: string;
}

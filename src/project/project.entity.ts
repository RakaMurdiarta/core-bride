import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseSchemaUUID } from '@app/commons/entities/base/entity.abstract';

@Entity({ name: ProjectEntity.tableName })
export class ProjectEntity extends BaseSchemaUUID {
  static tableName = 'projects';

  @PrimaryColumn({ type: 'varchar', name: 'project_id' })
  projectId: number;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: string;
}

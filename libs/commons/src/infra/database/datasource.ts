import { DataSource, DataSourceOptions } from 'typeorm';
import { dbMigrationConfig } from '@config/database/migration.config';

const dataSource = new DataSource(dbMigrationConfig() as DataSourceOptions);
export default dataSource;

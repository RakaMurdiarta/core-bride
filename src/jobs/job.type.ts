export const ProjectIdentifier = 'Project';
export type ProjectIdentifier = 'Project';

export const CompaiesIdentifier = 'Companies';
export type CompaiesIdentifier = 'Companies';

export const SupplierIdentifier = 'Supliers';
export type SupplierIdentifier = 'Supliers';

export type TYPE_IDENTIFIER =
  | ProjectIdentifier
  | CompaiesIdentifier
  | SupplierIdentifier;

export const JOB_COMPLETED = 'COMPLETED';
export type JOB_COMPLETED = 'COMPLETED';

export const JOB_PENDING = 'PENDING';
export type JOB_PENDING = 'PENDING';

export const JOB_FAILED = 'FAILED';
export type JOB_FAILED = 'FAILED';

export const JOB_ERROR = 'ERROR';
export type JOB_ERROR = 'ERROR';
export type JobStatus = JOB_COMPLETED | JOB_ERROR | JOB_FAILED;

export const CORE_PROJECT = 'CORE_PROJECT';
export type CORE_PROJECT = 'CORE_PROJECT';

export const DISTRIBUTED_PROJECT = 'DISTRIBUTED_PROJECT';
export type DISTRIBUTED_PROJECT = 'DISTRIBUTED_PROJECT';

export type TARGET = DISTRIBUTED_PROJECT | CORE_PROJECT;
export type RESCHEDULE_STATUS = JobStatus | JOB_PENDING;

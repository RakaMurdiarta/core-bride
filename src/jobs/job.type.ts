export const DistributedProject = 'DistributedProject';
export type DistributedProject = 'DistributedProject';

export const AppProject = 'AppProject';
export type AppProject = 'AppProject';

export type TARGET = AppProject | DistributedProject;

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

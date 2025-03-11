import { z } from 'zod';

/**
 * @description this schema must be the same with column name represented sia database schema
 */
export const siaCreateProjectSchema = z.object({
  // ProjectID: z.number(),
  CompanyID: z.string(),
  Name: z.string(),
  Number: z.string(),
  UserText4: z.string(),
  ProjectStatus: z.string(),
});

export type SiaCreateProjectDto = z.infer<typeof siaCreateProjectSchema>;

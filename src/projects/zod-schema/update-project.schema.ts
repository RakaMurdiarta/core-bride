import { z } from 'zod';
import { createProjectSchema } from './create-project.schema';

export const updateProjectSchema = createProjectSchema
  .omit({ projectId: true })
  .partial()
  .merge(
    z.object({
      projectId: z.number(),
    }),
  );

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;

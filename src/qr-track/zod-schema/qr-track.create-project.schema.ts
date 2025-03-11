import { z } from 'zod';

/**
 * @description this schema must be the same with column name represented qr track database schema
 */
export const qrTrackCreateProjectSchema = z.object({
  // ProjectID: z.number(),
  name: z.string(),
  sector_type: z.string(),
});

export type QrTrackCreateProjectDto = z.infer<
  typeof qrTrackCreateProjectSchema
>;

import { z } from 'zod';

export const batchMemberformSchema = z.object({
  bdNo: z.string().min(1, 'BD Number is required'),
  bupNo: z.string().min(1, 'BUP Number is required'),
  rank: z.string().min(1, 'Rank is required'),
  name: z.string().min(1, 'Name is required'),
  branch: z.string().min(1, 'Branch is required')
});

export type BatchMemberFormSchemaValues = z.infer<typeof batchMemberformSchema>;

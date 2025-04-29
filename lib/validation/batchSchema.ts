import { z } from 'zod';

export const batchFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Batch name must be at least 2 characters.'
  }),
  description: z.string().min(10, {
    message: 'Batch description must be at least 10 characters.'
  })
});

export type BatchFormSchemaValues = z.infer<typeof batchFormSchema>;

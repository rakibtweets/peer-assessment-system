import { z } from 'zod';

export const submissionFormSchema = z.object({
  batchId: z.string().min(1, 'Batch ID is required'),
  marker: z.string().min(1, 'Marker ID is required'),
  markerBdNo: z.string().min(1, 'Marker BD number is required'),
  recipient: z.string().min(1, 'Recipient ID is required'),
  recipientBDNo: z.string().min(1, 'Recipient BD number is required'),
  marks: z
    .number({ required_error: 'Marks are required' })
    .min(0, 'Marks must be at least 0')
});

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;

'use server';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { revalidatePath } from 'next/cache';
import Submission from '@/database/submission.model';
import dbConnect from '../db/mongoose';
import mongoose from 'mongoose';
import {
  SubmissionFormValues,
  submissionFormSchema
} from '../validation/submissionSchema';
import Member from '@/database/member.model';

export async function createSubmission(data: SubmissionFormValues[]): Promise<
  ActionResponse<{
    submissions: SubmissionFormValues[];
  }>
> {
  const validationResult = await action({
    params: data,
    schema: submissionFormSchema.array()
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    await dbConnect();
    const { marker, batchId } = data[0];
    const createdSubmissions = await Submission.insertMany(data);

    if (!createdSubmissions) {
      throw new Error('Failed to create submissions');
    }

    // Update stats for each recipient
    for (const submission of data) {
      const recipient = await Member.findById(submission.recipient);
      if (!recipient) continue;

      // Update averageMarks
      const allSubmissions = await Submission.find({
        recipient: recipient._id
      });

      const totalMarks = allSubmissions.reduce((sum, s) => sum + s.marks, 0);
      const avgMarks = totalMarks / allSubmissions.length;

      recipient.submissionCount = allSubmissions.length;
      recipient.averageMarks = parseFloat(avgMarks.toFixed(2));
      await recipient.save();
    }

    const markerMember = await Member.findById(marker);

    const alreadySubmitted = markerMember?.submissionStatus.some(
      (s: any) => s.batchId.toString() === batchId
    );

    if (!alreadySubmitted) {
      markerMember?.submissionStatus.push({
        batchId,
        completed: true,
        submittedAt: new Date()
      });
      await markerMember?.save();
    }

    revalidatePath('/admin/submissions');
    revalidatePath('/admin');

    return {
      success: true,
      data: {
        submissions: JSON.parse(JSON.stringify(createdSubmissions))
      }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

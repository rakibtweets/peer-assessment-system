'use server';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { revalidatePath } from 'next/cache';
import Submission from '@/database/submission.model';
import dbConnect from '../db/mongoose';
import {
  SubmissionFormValues,
  submissionFormSchema
} from '../validation/submissionSchema';
import Member, { IMember } from '@/database/member.model';
import {
  IGetSubmissionByMarker,
  IGetSubmissionsForRecipient
} from '@/types/actions';

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

export async function getSubmissionByMarker(markerId: string): Promise<
  ActionResponse<{
    submissions: IGetSubmissionByMarker[];
    marker: IMember;
    averageMarks: number;
  }>
> {
  try {
    await dbConnect();

    const submissions = await Submission.find({ marker: markerId })
      .populate({
        path: 'recipient',
        select: 'name bdNo rank',
        model: Member
      })
      .sort({ submitted: -1 });

    if (!submissions) {
      throw new Error('No submissions found');
    }

    const formatted = submissions.map((submission) => ({
      recipient: {
        name: submission.recipient.name,
        bdNo: submission.recipient.bdNo,
        rank: submission.recipient.rank
      },
      marks: submission.marks,
      submitted: submission.createdAt
    })) as IGetSubmissionByMarker[];

    const totalMarks = formatted.reduce((sum, s) => sum + s.marks, 0);
    const averageMarksGiven =
      formatted.length > 0
        ? parseFloat((totalMarks / formatted.length).toFixed(2))
        : 0;

    const marker = await Member.findById(markerId).select('name _id bdNo');

    return {
      success: true,
      data: {
        submissions: formatted,
        marker: marker,
        averageMarks: averageMarksGiven
      }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSubmissionsForRecipient(recipientId: string): Promise<
  ActionResponse<{
    submissions: IGetSubmissionsForRecipient[];
    averageMarks: number;
    recipient: IMember;
  }>
> {
  try {
    await dbConnect();

    const submissions = await Submission.find({ recipient: recipientId })
      .populate({
        path: 'marker',
        select: 'name bdNo rank',
        model: Member
      })
      .sort({ submitted: -1 });

    if (!submissions) {
      throw new Error('No submissions found');
    }

    const formatted = submissions.map((submission) => ({
      marker: {
        name: submission.marker.name,
        bdNo: submission.marker.bdNo,
        rank: submission.marker.rank
      },
      marks: submission.marks,
      submitted: submission.createdAt
    }));

    const totalMarks = formatted.reduce((sum, s) => sum + s.marks, 0);
    const averageMarks =
      formatted.length > 0
        ? parseFloat((totalMarks / formatted.length).toFixed(2))
        : 0;

    const recipient = await Member.findById(recipientId).select(
      'name _id bdNo'
    );

    return {
      success: true,
      data: {
        submissions: formatted,
        averageMarks,
        recipient: recipient
      }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

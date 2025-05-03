'use server';

import handleError from '../handlers/error';
import action from '../handlers/action';
import Member, { IMember } from '@/database/member.model';
import dbConnect from '../db/mongoose';
import {
  CreateBatchMemberParams,
  GetAllMembersByBatchIdParams
} from '@/types/actions';
import Batch from '@/database/batch.model';
import { revalidatePath } from 'next/cache';

import { batchMemberformSchema } from '../validation/memberSchema';

export async function getAllMembersByBatchId(
  params: GetAllMembersByBatchIdParams
): Promise<ActionResponse<{ members: IMember[] }>> {
  const validationResult = await action({
    params
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  try {
    await dbConnect();
    const { batchId } = params;
    const members = await Member.find({ batchId: batchId }).sort({
      createdAt: 1
    });
    return {
      success: true,
      data: { members: JSON.parse(JSON.stringify(members)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// Create a new batch
export async function createBatchMember(data: CreateBatchMemberParams): Promise<
  ActionResponse<{
    member: IMember;
  }>
> {
  const validationResult = await action({
    params: data,
    schema: batchMemberformSchema
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    await dbConnect();
    const member = await Member.create(data);
    if (!member) {
      throw new Error('Failed to create batch');
    }
    // push memberId to batch members array
    const batch = await Batch.findOneAndUpdate(
      { _id: data.batchId },
      { $push: { members: member._id }, $inc: { memberCount: 1 } },
      { new: true }
    );
    if (!batch) {
      throw new Error('Failed to update batch member count');
    }
    revalidatePath(`/admin/batches/${data.batchId}`);

    return {
      success: true,
      data: { member: JSON.parse(JSON.stringify(member)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const updateBatchMember = async (
  params: Partial<IMember>
): Promise<ActionResponse<{ member: IMember }>> => {
  const validationResult = await action({
    params,
    schema: batchMemberformSchema
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    await dbConnect();
    const { _id, ...updateData } = params;

    const member = await Member.findByIdAndUpdate(_id, updateData, {
      new: true,

      runValidators: true
    });

    if (!member) {
      throw new Error('Batch not found or update failed');
    }

    revalidatePath('/admin/batches');
    revalidatePath('/batches');

    return {
      success: true,
      data: { member: JSON.parse(JSON.stringify(member)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  } finally {
  }
};

// get single member by memberId and batchId
// get single batch by batchId
export async function getBatchMemberById(
  memberId: string
): Promise<ActionResponse<{ member: IMember }>> {
  const validationResult = await action({
    params: { _id: memberId }
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  try {
    await dbConnect();
    const member = await Member.findById(memberId);
    if (!member) {
      throw new Error('Batch not found');
    }
    return {
      success: true,
      data: { member: JSON.parse(JSON.stringify(member)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

interface IDeleteBatchMemberParams {
  memberId: string;
  path: string;
}

export async function deleteBatchMember({
  memberId,
  path
}: IDeleteBatchMemberParams): Promise<ActionResponse<{ member: IMember }>> {
  const validationResult = await action({
    params: { _id: memberId, path }
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    await dbConnect();
    const member = await Member.findByIdAndDelete(memberId);
    if (!member) {
      throw new Error('Failed to delete member');
    }
    // remove memberId from batch members array

    const batch = await Batch.findOneAndUpdate(
      { _id: member.batchId },
      { $pull: { members: member._id }, $inc: { memberCount: -1 } },
      { new: true }
    );

    if (!batch) {
      throw new Error('Failed to update batch member count');
    }

    revalidatePath(path);

    return {
      success: true,
      data: { member: JSON.parse(JSON.stringify(member)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

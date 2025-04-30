'use server';

import handleError from '../handlers/error';
import mongoose from 'mongoose';
import action from '../handlers/action';
import Member, { IMember } from '@/database/member.model';
import dbConnect from '../db/mongoose';
import {
  CreateBatchMemberParams,
  GetAllMembersByBatchIdParams
} from '@/types/actions';
import Batch, { IBatch } from '@/database/batch.model';
import { revalidatePath } from 'next/cache';
import {
  BatchFormSchemaValues,
  batchFormSchema
} from '../validation/batchSchema';
import { batchMemberformSchema } from '../validation/memberSchema';
import { stringify } from 'querystring';

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
      createdAt: -1
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
}: IDeleteBatchMemberParams): Promise<ActionResponse<{ member: IMemeber }>> {
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
    revalidatePath(path);

    return {
      success: true,
      data: { member: JSON.parse(JSON.stringify(member)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

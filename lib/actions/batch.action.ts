'use server';

import Batch, { IBatch } from '@/database/batch.model';
import { revalidatePath } from 'next/cache';
import handleError from '../handlers/error';
import mongoose from 'mongoose';
import action from '../handlers/action';
import {
  batchFormSchema,
  BatchFormSchemaValues
} from '../validation/batchSchema';
import dbConnect from '../db/mongoose';

// get all Batches
export async function getAllBatches(): Promise<
  ActionResponse<{ batches: IBatch[] }>
> {
  const validationResult = await action({});
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  try {
    await dbConnect();
    const batches = await Batch.find({}).sort({ createdAt: -1 });
    return {
      success: true,
      data: { batches: JSON.parse(JSON.stringify(batches)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// Create a new batch
export async function createBatch(data: BatchFormSchemaValues): Promise<
  ActionResponse<{
    batch: IBatch;
  }>
> {
  const validationResult = await action({
    params: data,
    schema: batchFormSchema
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await dbConnect();
    const batch = await Batch.create(data);
    if (!batch) {
      throw new Error('Failed to create batch');
    }
    revalidatePath('/admin/batches');
    revalidatePath('/admin');

    return {
      success: true,
      data: JSON.parse(JSON.stringify(batch))
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// get single batch by batchId
export async function getBatchById(
  batchId: string
): Promise<ActionResponse<{ batch: IBatch }>> {
  const validationResult = await action({
    params: { _id: batchId }
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  try {
    await dbConnect();
    const batch = await Batch.findById(batchId);
    if (!batch) {
      throw new Error('Batch not found');
    }
    return {
      success: true,
      data: { batch: JSON.parse(JSON.stringify(batch)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const updateBatch = async (
  params: Partial<IBatch>
): Promise<ActionResponse<{ batch: IBatch }>> => {
  const validationResult = await action({
    params,
    schema: batchFormSchema
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    await dbConnect();
    const { _id, ...updateData } = params;

    const batch = await Batch.findByIdAndUpdate(_id, updateData, {
      new: true,

      runValidators: true
    });

    if (!batch) {
      throw new Error('Batch not found or update failed');
    }

    revalidatePath('/admin/batches');
    revalidatePath('/batches');

    return {
      success: true,
      data: { batch: JSON.parse(JSON.stringify(batch)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  } finally {
  }
};

// Delete a batch

interface IDeleteBatchParams {
  batchId: string;
  path: string;
}

export async function deleteBatch({
  batchId,
  path
}: IDeleteBatchParams): Promise<ActionResponse<{ batch: IBatch }>> {
  const validationResult = await action({
    params: { _id: batchId, path }
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    await dbConnect();
    const batch = await Batch.findByIdAndDelete(batchId);
    if (!batch) {
      throw new Error('Failed to delete batch');
    }
    revalidatePath(path);

    return {
      success: true,
      data: { batch: JSON.parse(JSON.stringify(batch)) }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

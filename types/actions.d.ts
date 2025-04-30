import { BatchMemberFormSchemaValues } from '@/lib/validation/memberSchema';

export interface createBatchParams {
  name: string;
  description: string;
}

export interface GetAllMembersByBatchIdParams {
  batchId: string;
}

export interface CreateBatchMemberParams extends BatchMemberFormSchemaValues {
  batchId: string;
}

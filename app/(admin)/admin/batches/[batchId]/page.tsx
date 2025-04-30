import { BatchMembersTable } from '@/components/tables/batch-member-table';
import { Button } from '@/components/ui/button';
import { getBatchById } from '@/lib/actions/batch.action';
import { getAllMembersByBatchId } from '@/lib/actions/member.action';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface BatchPageProps {
  params: {
    batchId: string;
  };
}

export default async function BatchPage({ params }: BatchPageProps) {
  const response = await getAllMembersByBatchId({
    batchId: params.batchId
  });
  const batchMembers = response.data?.members || [];

  const batchResult = await getBatchById(params.batchId);
  const batch = batchResult.data?.batch;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batch Members</h1>
          <p className="text-muted-foreground">
            View and manage members in this batch.
          </p>
        </div>
        <Button asChild>
          <Link href={`/admin/batches/${params.batchId}/add-member`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Member
          </Link>
        </Button>
      </div>
      <BatchMembersTable
        batch={batch}
        members={batchMembers}
        batchId={params.batchId}
      />
    </div>
  );
}

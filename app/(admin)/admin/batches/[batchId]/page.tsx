import { BatchMembersTable } from '@/components/tables/batch-member-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface BatchPageProps {
  params: {
    batchId: string;
  };
}

export default function BatchPage({ params }: BatchPageProps) {
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
      <BatchMembersTable batchId={params.batchId} />
    </div>
  );
}

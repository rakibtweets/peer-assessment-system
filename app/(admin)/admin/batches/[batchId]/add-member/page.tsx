import { BatchMemberForm } from '@/components/forms/BatchMemeberForm';
import { getBatchById } from '@/lib/actions/batch.action';

interface AddMemberPageProps {
  params: {
    batchId: string;
  };
}

export default async function AddMemberPage({ params }: AddMemberPageProps) {
  const response = await getBatchById(params.batchId);
  const batch = response.data?.batch;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Member</h1>
        <p className="text-muted-foreground">Add a new member to this batch.</p>
      </div>
      <div className="max-w-2xl">
        <BatchMemberForm type="create" batchId={params.batchId} batch={batch} />
      </div>
    </div>
  );
}

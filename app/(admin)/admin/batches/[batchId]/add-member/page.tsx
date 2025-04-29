import { BatchMemberForm } from '@/components/forms/BatchMemeberForm';

interface AddMemberPageProps {
  params: {
    batchId: string;
  };
}

export default function AddMemberPage({ params }: AddMemberPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Member</h1>
        <p className="text-muted-foreground">Add a new member to this batch.</p>
      </div>
      <div className="max-w-2xl">
        <BatchMemberForm batchId={params.batchId} />
      </div>
    </div>
  );
}

import BatchForm from '@/components/forms/BatchForm';
import { BatchMemberForm } from '@/components/forms/BatchMemeberForm';
import { getBatchById } from '@/lib/actions/batch.action';
import { getBatchMemberById } from '@/lib/actions/member.action';

interface BatchMemberEditPageProps {
  params: {
    batchId: string;
    memberId: string;
  };
}

export default async function BatchMemberEditPage({
  params
}: BatchMemberEditPageProps) {
  const response = await getBatchById(params.batchId);
  const batch = response.data?.batch;
  const memberResult = await getBatchMemberById(params.memberId);
  const member = memberResult.data?.member;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Batch Member</h1>
        <p className="text-muted-foreground">Update batch information.</p>
      </div>
      <div className="max-w-md">
        <BatchMemberForm
          type="update"
          batchId={params.batchId}
          batch={batch}
          member={member}
        />
      </div>
    </div>
  );
}

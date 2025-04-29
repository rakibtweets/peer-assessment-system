import BatchForm from '@/components/forms/BatchForm';
import { getBatchById } from '@/lib/actions/batch.action';

interface BatchEditPageProps {
  params: {
    batchId: string;
  };
}

export default async function BatchEditPage({ params }: BatchEditPageProps) {
  const response = await getBatchById(params.batchId);
  const batch = response.data?.batch;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Batch</h1>
        <p className="text-muted-foreground">Update batch information.</p>
      </div>
      <div className="max-w-md">
        <BatchForm type="edit" batchId={batch?._id as string} batch={batch} />
      </div>
    </div>
  );
}

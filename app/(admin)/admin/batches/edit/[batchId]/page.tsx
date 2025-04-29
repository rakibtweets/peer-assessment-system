import BatchForm from '@/components/forms/BatchForm';

interface BatchEditPageProps {
  params: {
    batchId: string;
  };
}

export default function BatchEditPage({ params }: BatchEditPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Batch</h1>
        <p className="text-muted-foreground">Update batch information.</p>
      </div>
      <div className="max-w-md">
        <BatchForm type="edit" batchId={params.batchId} />
      </div>
    </div>
  );
}

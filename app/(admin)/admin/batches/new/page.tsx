import BatchForm from '@/components/forms/BatchForm';

export default function NewBatchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Batch</h1>
        <p className="text-muted-foreground">Add a new batch to the system.</p>
      </div>
      <div className="max-w-md">
        <BatchForm type="create" />
      </div>
    </div>
  );
}

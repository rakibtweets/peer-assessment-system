import { BatchCards } from '@/components/cards/BatchCard';
import { getAllBatches } from '@/lib/actions/batch.action';

export default async function AdminPage() {
  const res = await getAllBatches();
  const batches = res.data?.batches || [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage batches and view marking data.
        </p>
      </div>
      <BatchCards batches={batches} />
    </div>
  );
}

import { BatchCards } from '@/components/cards/BatchCard';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage batches and view marking data.
        </p>
      </div>
      <BatchCards />
    </div>
  );
}

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import BatchesTable from '@/components/tables/batches-table';

export default function BatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batches</h1>
          <p className="text-muted-foreground">
            Manage all batches in the system.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/batches/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Batch
          </Link>
        </Button>
      </div>
      <BatchesTable />
    </div>
  );
}

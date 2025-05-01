import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSubmissionByMarker } from '@/lib/actions/submission.action';
import MarkerMarksheetAdmin from '@/components/tables/marker-marksheet-admin';

interface MarkerMarksheetPageProps {
  params: {
    markerId: string;
  };
}

export default async function MarkerMarksheetPage({
  params
}: MarkerMarksheetPageProps) {
  const response = await getSubmissionByMarker(params.markerId);
  const submissions = response.data?.submissions || [];
  const marker = response.data?.marker;
  const averageMarks = response.data?.averageMarks;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/batches">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batches
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Marks Given by {marker?.name} ({marker?.bdNo})
        </h1>
        <p className="text-muted-foreground">
          Admin view of all marks given by this member. This information is only
          visible to administrators.
        </p>
      </div>

      <MarkerMarksheetAdmin
        markerId={params.markerId}
        markerName={marker?.name}
        bdNo={marker?.bdNo}
        submissions={submissions}
        averageMarks={averageMarks}
        isAdminView={true}
      />
    </div>
  );
}

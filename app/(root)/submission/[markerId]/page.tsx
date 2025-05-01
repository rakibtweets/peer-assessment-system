import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSubmissionByMarker } from '@/lib/actions/submission.action';
import { MarkerMarksheet } from '@/components/tables/marker-marksheet';

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
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Batch Marking
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold">Your Marking Summary</h1>
        <p className="text-muted-foreground">
          Review the marks you have given to other members.
        </p>

        <MarkerMarksheet
          markerId={params.markerId}
          markerName={marker?.name}
          submissions={submissions}
          averageMarks={averageMarks}
          bdNo={marker?.bdNo}
        />
      </div>
    </div>
  );
}

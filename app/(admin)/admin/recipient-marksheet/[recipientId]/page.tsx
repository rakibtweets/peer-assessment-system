import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSubmissionsForRecipient } from '@/lib/actions/submission.action';
import RecipientMarksheet from '@/components/tables/RecipientMarksheet';

interface RecipientMarksheetPageProps {
  params: {
    recipientId: string;
  };
}

export default async function RecipientMarksheetPage({
  params
}: RecipientMarksheetPageProps) {
  const response = await getSubmissionsForRecipient(params.recipientId);
  const submissions = response.data?.submissions || [];
  const recipient = response.data?.recipient;
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
          Marks Received by {recipient?.name} ({recipient?.bdNo})
        </h1>
        <p className="text-muted-foreground">
          Admin view of all marks received by this member. This information is
          only visible to administrators.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-10">Loading marking data...</div>
        }
      >
        <RecipientMarksheet
          recipientName={recipient?.name}
          recipientId={params.recipientId}
          averageMarks={averageMarks as number}
          submissions={submissions}
        />
      </Suspense>
    </div>
  );
}

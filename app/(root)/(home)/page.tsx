import { BatchMarkingForm } from '@/components/forms/BatchMarkingForm';
import { getAllBatches } from '@/lib/actions/batch.action';

export default async function Home() {
  const response = await getAllBatches();
  const batches = response.data?.batches || [];
  return (
    <>
      <div className=" mx-auto">
        <h1 className="text-3xl font-bold mb-6">Peer Marking System</h1>
        <p className="text-muted-foreground mb-8">
          Fill out the form below to mark your batch mates. Each person can mark
          others.
        </p>
        <BatchMarkingForm batches={batches} />
      </div>
    </>
  );
}

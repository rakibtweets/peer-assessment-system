// import MarkForm from '@/components/forms/MarkForm';

import { HorizontalBatchMarkingForm } from '@/components/forms/HorizontalBatchMarkingForm';

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Batch Marking System</h1>
        <p className="text-muted-foreground mb-8">
          Fill out the form below to mark your batch mates. Each person can mark
          others with a score between 1 and 26.
        </p>
        {/* <MarkForm /> */}
        <HorizontalBatchMarkingForm />
      </div>
    </main>
  );
}

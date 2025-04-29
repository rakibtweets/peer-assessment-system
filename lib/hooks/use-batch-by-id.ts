'use client';

import { useState, useEffect } from 'react';
import { useBatches } from './use-batches';

export function useBatchById(batchId: string) {
  const { batches, loading: batchesLoading } = useBatches();
  const [batch, setBatch] = useState<(typeof batches)[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchesLoading) {
      const foundBatch = batches.find((b) => b.id === batchId) || null;
      setBatch(foundBatch);
      setLoading(false);

      if (!foundBatch) {
        setError('Batch not found');
      }
    }
  }, [batchId, batches, batchesLoading]);

  return {
    batch,
    loading,
    error
  };
}

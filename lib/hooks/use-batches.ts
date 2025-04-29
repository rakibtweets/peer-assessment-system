'use client';

import { useState, useEffect } from 'react';

// Mock batch data
const mockBatches = [
  {
    id: '1',
    name: 'Batch 2023',
    description: 'This is the batch for 2023.',
    memberCount: 26,
    createdAt: '2023-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Batch 2022',
    description: 'This is the batch for 2022.',
    memberCount: 24,
    createdAt: '2022-01-10T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Batch 2021',
    description: 'This is the batch for 2021.',
    memberCount: 25,
    createdAt: '2021-01-05T00:00:00.000Z'
  }
];

export function useBatches() {
  const [batches, setBatches] = useState(mockBatches);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real app, you would fetch batches from an API
  useEffect(() => {
    // Simulating API fetch
    setLoading(true);

    // Simulate API delay
    const timer = setTimeout(() => {
      setBatches(mockBatches);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    batches,
    loading,
    error
  };
}

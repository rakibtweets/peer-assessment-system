'use client';

import { useState, useEffect } from 'react';
import { batchMembers } from '@/lib/data';

// Add average marks and submission count to each member
const enhancedMembers = batchMembers.map((member) => ({
  ...member,
  averageMarks: Math.floor(Math.random() * 10) + 16, // Random average between 16-25
  submissionCount: Math.floor(Math.random() * 10) + 5 // Random count between 5-14
}));

// Mock batch data mapping
const batchMemberMap = {
  '1': enhancedMembers.slice(0, 26), // All 26 members for Batch 2023
  '2': enhancedMembers.slice(0, 24), // First 24 members for Batch 2022
  '3': enhancedMembers.slice(1, 26) // Members 2-26 for Batch 2021
};

const batchNames = {
  '1': 'Batch 2023',
  '2': 'Batch 2022',
  '3': 'Batch 2021'
};

export function useBatchMembers(batchId: string) {
  const [members, setMembers] = useState(
    batchMemberMap[batchId as keyof typeof batchMemberMap] || []
  );
  const [batchName, setBatchName] = useState(
    batchNames[batchId as keyof typeof batchNames] || 'Unknown Batch'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real app, you would fetch members from an API based on batchId
  useEffect(() => {
    setLoading(true);

    // Simulate API delay
    const timer = setTimeout(() => {
      setMembers(batchMemberMap[batchId as keyof typeof batchMemberMap] || []);
      setBatchName(
        batchNames[batchId as keyof typeof batchNames] || 'Unknown Batch'
      );
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [batchId]);

  return {
    members,
    batchName,
    loading,
    error
  };
}

'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getAllBatches } from '@/lib/actions/batch.action';
import { IBatch } from '@/database/batch.model';

interface BatchSelectorProps {
  onBatchSelect: (batchId: string, batchName: string) => void;
}

export function BatchSelector({ onBatchSelect }: BatchSelectorProps) {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState<IBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<IBatch | null>(null);

  useEffect(() => {
    async function fetchBatches() {
      try {
        setLoading(true);
        const response = await getAllBatches();
        const batches = response.data?.batches || [];
        setBatches(batches);
      } catch (error) {
        console.error('Failed to fetch batches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBatches();
  }, []);

  const handleSelect = (batchId: string) => {
    const batch = batches.find((b) => b._id === batchId);
    if (batch) {
      setSelectedBatch(batch);
      onBatchSelect(batch._id as string, batch.name);
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <label
        htmlFor="batch-select"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Select Batch
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            disabled={loading}
          >
            {selectedBatch
              ? selectedBatch.name
              : loading
              ? 'Loading batches...'
              : 'Select a batch'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]">
          <Command>
            <CommandInput placeholder="Search batches..." />
            <CommandList>
              <CommandEmpty>No batches found.</CommandEmpty>
              <CommandGroup>
                {batches.map((batch) => (
                  <CommandItem
                    key={batch._id as string}
                    value={batch._id as string}
                    onSelect={() => handleSelect(batch._id as string)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedBatch?._id === batch._id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {batch.name} ({batch.memberCount} members)
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useBatchById } from '@/lib/hooks/use-batch-by-id';

const formSchema = z.object({
  bdNo: z.string().min(1, 'BD Number is required'),
  bupNo: z.string().min(1, 'BUP Number is required'),
  rank: z.string().min(1, 'Rank is required'),
  name: z.string().min(1, 'Name is required'),
  branch: z.string().min(1, 'Branch is required')
});

interface BatchMemberFormProps {
  batchId: string;
}

export function BatchMemberForm({ batchId }: BatchMemberFormProps) {
  const router = useRouter();
  const { batch, loading } = useBatchById(batchId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bdNo: '',
      bupNo: '',
      rank: '',
      name: '',
      branch: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      //   await addMemberToBatch(batchId, values);
      //   router.push(`/admin/batches/${batchId}`);
      //   router.refresh();
      console.log('Adding member:', values);
    } catch (error) {
      console.error('Failed to add member:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Fetching batch information.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!batch) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Batch not found</CardTitle>
          <CardDescription>
            The requested batch could not be found.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => router.push('/admin/batches')}
          >
            Back to Batches
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const rankOptions = [
    'officer cadet',
    'Lieutenant',
    'Captain',
    'Major',
    'Colonel',
    'General'
  ];
  const branchOptions = ['GD(P)', 'Log', 'ATC/ADWC'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Member to {batch.name}</CardTitle>
        <CardDescription>
          Enter the details for the new batch member.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="bdNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BD Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. BD001" {...field} />
                    </FormControl>
                    <FormDescription>
                      The unique BD number for this member.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bupNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BUP Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. BUP001" {...field} />
                    </FormControl>
                    <FormDescription>
                      The unique BUP number for this member.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rank</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rankOptions.map((rank) => (
                          <SelectItem key={rank} value={rank}>
                            {rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The military rank of this member.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The full name of this member.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branchOptions.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The military branch of this member.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push(`/admin/batches/${batchId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

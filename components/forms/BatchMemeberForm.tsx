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
import { batchMemberformSchema } from '@/lib/validation/memberSchema';
import {
  createBatchMember,
  updateBatchMember
} from '@/lib/actions/member.action';
import { useToast } from '@/hooks/use-toast';
import { IBatch } from '@/database/batch.model';
import { IMember } from '@/database/member.model';

interface BatchMemberFormProps {
  batchId: string;
  type?: 'create' | 'update';
  batch?: IBatch;
  member?: IMember;
}

export function BatchMemberForm({
  batchId,
  type,
  batch,
  member
}: BatchMemberFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  // const { batch, loading } = useBatchById(batchId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof batchMemberformSchema>>({
    resolver: zodResolver(batchMemberformSchema),
    defaultValues: {
      bdNo: member?.bdNo || '',
      bupNo: member?.bupNo || '',
      rank: member?.rank || '',
      name: member?.name || '',
      branch: member?.branch || ''
    }
  });

  async function onSubmit(values: z.infer<typeof batchMemberformSchema>) {
    setIsSubmitting(true);

    try {
      if (type === 'create') {
        const res = await createBatchMember({
          ...values,
          batchId: batchId
        });
        if (res.success) {
          console.log('Create batch Meber values', values);
          toast({
            title: 'Batch member created',
            description: 'Batch member created successfully.',
            variant: 'default'
          });
          setIsSubmitting(false);
          router.push(`/admin/batches/${batchId}`);
        } else {
          toast({
            title: 'Batch Member Creation Failed',
            description: res.error?.message,
            variant: 'destructive'
          });
          setIsSubmitting(false);
        }
      } else {
        const res = await updateBatchMember({
          _id: member?._id,
          ...values
        });
        if (res.success) {
          toast({
            title: 'Batch member updated',
            description: 'Batch member updated successfully.',
            variant: 'default'
          });
          setIsSubmitting(false);
          router.push(`/admin/batches/${batchId}`);
        } else {
          toast({
            title: 'Batch Member Update Failed',
            description: res.error?.message,
            variant: 'destructive'
          });
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      toast({
        title: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <CardTitle>Add Member to {batch?.name}</CardTitle>
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
              {isSubmitting ? (
                <>{type === 'create' ? 'Adding...' : 'Updating...'}</>
              ) : (
                <>{type === 'create' ? 'Add Member' : 'Update Member'}</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

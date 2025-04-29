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
import { Textarea } from '@/components/ui/textarea';
import { useBatches } from '@/lib/hooks/use-batches';
// import { createBatch } from '@/lib/actions/batch-actions';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Batch name must be at least 2 characters.'
  }),
  description: z.string().min(10, {
    message: 'Batch description must be at least 10 characters.'
  })
});

interface BatchFormProps {
  type?: 'edit' | 'create';
  batchId?: string;
}

export default function BatchForm({ batchId, type }: BatchFormProps) {
  const router = useRouter();
  const { batches } = useBatches();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const batch = batches.find((b) => b.id === batchId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: batch?.id
      ? {
          name: batch.name,
          description: batch.description
        }
      : {
          name: '',
          description: ''
        }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // In a real app, this would be a server action to create a batch
      //   await createBatch(values.name);
      //   router.push('/admin');
      console.log('Create batch values', values);

      //   router.refresh();
    } catch (error) {
      console.error('Failed to create batch:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Information</CardTitle>
        <CardDescription>Enter the details for the new batch.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed for this batch.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter batch description.."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {type === 'create'
                    ? 'Creating Batch...'
                    : 'Updating Batch...'}
                </>
              ) : (
                <>{type === 'create' ? 'Create Batch' : 'Update Batch'}</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

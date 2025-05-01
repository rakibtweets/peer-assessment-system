'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  batchFormSchema,
  BatchFormSchemaValues
} from '@/lib/validation/batchSchema';
import { createBatch, updateBatch } from '@/lib/actions/batch.action';
import { useToast } from '@/hooks/use-toast';
import { IBatch } from '@/database/batch.model';
// import { createBatch } from '@/lib/actions/batch-actions';

interface BatchFormProps {
  type?: 'edit' | 'create';
  batchId?: string;
  batch?: IBatch;
}

export default function BatchForm({ batchId, type, batch }: BatchFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BatchFormSchemaValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: batch?._id
      ? {
          name: batch.name,
          description: batch?.description
        }
      : {
          name: '',
          description: ''
        }
  });

  async function onSubmit(values: BatchFormSchemaValues) {
    setIsSubmitting(true);

    try {
      if (type === 'create') {
        const res = await createBatch(values);
        if (res.success) {
          console.log('Create batch values', values);
          toast({
            title: 'Batch Created',
            description: 'Batch created successfully.',
            variant: 'default'
          });
          setIsSubmitting(false);
          router.push('/admin/batches');
        } else {
          toast({
            title: 'Batch Creation Failed',
            description: res.error?.message,
            variant: 'destructive'
          });
          setIsSubmitting(false);
        }
      } else {
        const res = await updateBatch({
          _id: batchId,
          ...values
        });
        if (res.success) {
          toast({
            title: 'Batch updated',
            description: 'Batch updated successfully.',
            variant: 'default'
          });
          setIsSubmitting(false);
          router.push('/admin/batches');
        } else {
          toast({
            title: 'Batch Update Failed',
            description: res.error?.message,
            variant: 'destructive'
          });
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Failed to create batch:', error);
      toast({
        title: 'An unexpected error occurred',
        variant: 'destructive'
      });
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

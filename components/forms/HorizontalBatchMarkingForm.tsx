'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
// import { submitBatchMarks } from '@/lib/actions/submission-actions';
import { getAllMembersByBatchId } from '@/lib/actions/member.action';
import { IMember } from '@/database/member.model';
import { BatchSelector } from '../batch-selector';
import { Form } from '../ui/form';

// Create a schema for the marks
const createMarkingSchema = (members: IMember[], currentMemberId: string) => {
  const schema: Record<string, z.ZodType<any>> = {};

  members.forEach((member) => {
    // Skip the current member (can't mark themselves)
    if (member._id !== currentMemberId) {
      schema[member._id as string] = z.number();
    }
  });

  return z.object(schema);
};

export function HorizontalBatchMarkingForm() {
  const { toast } = useToast();
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [selectedBatchName, setSelectedBatchName] = useState<string>('');
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentMember, setCurrentMember] = useState<IMember | null>(null);

  // Create a dynamic form schema based on members
  const formSchema = createMarkingSchema(
    members,
    (currentMember?._id as string) || ''
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  });

  // Handle batch selection
  const handleBatchSelect = async (batchId: string, batchName: string) => {
    setSelectedBatchId(batchId);
    setSelectedBatchName(batchName);
    setLoading(true);

    try {
      const response = await getAllMembersByBatchId({
        batchId: batchId
      });
      const membersData = response.data?.members || [];
      setMembers(membersData);

      // Reset the form with empty values
      const defaultValues: Record<string, number | undefined> = {};
      membersData.forEach((member) => {
        defaultValues[member._id as string] = undefined;
      });

      form.reset(defaultValues);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load batch members. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle marking member selection
  const handleMarkingMemberSelect = (member: IMember) => {
    setCurrentMember(member);

    // Reset the form when changing the marking member
    const defaultValues: Record<string, number | undefined> = {};
    members.forEach((m) => {
      if (m._id !== member._id) {
        defaultValues[m._id as string] = undefined;
      }
    });

    form.reset(defaultValues);
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentMember || !selectedBatchId) {
      toast({
        title: 'Error',
        description: 'Please select a batch and marking member first.',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    console.log('form values', values);

    try {
      // Convert form values to submission format
      const submissions = Object.entries(values)
        .filter(([_, value]) => value !== undefined)
        .map(([memberId, marks]) => {
          const member = members.find((m) => m._id === memberId);
          if (!member) return null;

          return {
            batchId: selectedBatchId,
            marker: currentMember._id,
            markerBdNo: currentMember.bdNo,
            recipient: member._id,
            recipientBDNo: member.bdNo,
            marks: marks as number
          };
        })
        .filter(Boolean);

      console.log('submissions:', submissions);

      if (submissions.length === 0) {
        toast({
          title: 'Error',
          description: 'Please provide marks for at least one member.',
          variant: 'destructive'
        });
        setSubmitting(false);
        return;
      }

      // await submitBatchMarks(submissions);

      toast({
        title: 'Success',
        description: `Successfully submitted marks for ${submissions.length} members.`
      });

      // Reset the form
      form.reset();
    } catch (error) {
      console.error('Failed to submit marks:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit marks. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Marking System</CardTitle>
          <CardDescription>
            Select a batch and then mark all members at once. You cannot mark
            yourself.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BatchSelector onBatchSelect={handleBatchSelect} />

            {selectedBatchId && members.length > 0 && (
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Select Who Is Marking
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => {
                    const memberId = e.target.value;
                    const member = members.find((m) => m._id === memberId);
                    if (member) {
                      handleMarkingMemberSelect(member);
                    }
                  }}
                  value={(currentMember?._id as string) || ''}
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option
                      key={member._id as string}
                      value={member._id as string}
                    >
                      {member.name} ({member.rank})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {loading && (
            <div className="text-center py-4">Loading members...</div>
          )}

          {!loading && selectedBatchId && currentMember && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>BD No</TableHead>
                        <TableHead>BUP No</TableHead>
                        <TableHead>Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Marks (1-26)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members?.map((member) => (
                        <TableRow
                          key={member._id as string}
                          className={
                            member._id === currentMember._id
                              ? 'bg-muted/50'
                              : ''
                          }
                        >
                          <TableCell>{member.bdNo}</TableCell>
                          <TableCell>{member.bupNo}</TableCell>
                          <TableCell>{member.rank}</TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.branch}</TableCell>
                          <TableCell>
                            {member._id === currentMember._id ? (
                              <span className="text-muted-foreground italic">
                                Cannot mark yourself
                              </span>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Select
                                  onValueChange={(value) =>
                                    form.setValue(
                                      member._id as string,
                                      Number.parseInt(value),
                                      { shouldValidate: true }
                                    )
                                  }
                                  value={
                                    form
                                      .watch(member._id as string)
                                      ?.toString() || ''
                                  }
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue placeholder="1-26" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from(
                                      { length: 26 },
                                      (_, i) => i + 1
                                    ).map((mark) => (
                                      <SelectItem
                                        key={mark}
                                        value={mark.toString()}
                                      >
                                        {mark}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {form.formState.errors[
                                  member._id as string
                                ] && (
                                  <p className="text-sm font-medium text-destructive ml-2">
                                    {
                                      form.formState.errors[
                                        member._id as string
                                      ]?.message as string
                                    }
                                  </p>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6">
                  <Button type="submit" disabled={submitting || !currentMember}>
                    {submitting ? 'Submitting...' : 'Submit All Marks'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

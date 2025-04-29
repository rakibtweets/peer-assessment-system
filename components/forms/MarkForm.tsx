'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { batchMembers } from '@/lib/data';

const formSchema = z.object({
  bdNo: z.string({
    required_error: 'Please select a BD number.'
  }),
  bupNo: z.string({
    required_error: 'Please select a BUP number.'
  }),
  rank: z.string({
    required_error: 'Please select a rank.'
  }),
  name: z.string({
    required_error: 'Please select a name.'
  }),
  branch: z.string({
    required_error: 'Please select a branch.'
  }),
  marks: z.coerce
    .number()
    .min(1, 'Marks must be at least 1')
    .max(26, 'Marks cannot exceed 26'),
  markedBy: z.string({
    required_error: 'Please select who is marking.'
  })
});

export default function MarkForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marks: undefined
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // In a real application, you would send this data to your backend
    console.log(values);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    form.reset();

    // Show success message or redirect
    alert('Form submitted successfully!');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="bdNo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>BD Number</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? batchMembers.find(
                              (member) => member.bdNo === field.value
                            )?.bdNo
                          : 'Select BD Number'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search BD number..." />
                      <CommandList>
                        <CommandEmpty>No BD number found.</CommandEmpty>
                        <CommandGroup>
                          {batchMembers.map((member) => (
                            <CommandItem
                              key={member.bdNo}
                              value={member.bdNo}
                              onSelect={() => {
                                form.setValue('bdNo', member.bdNo);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  member.bdNo === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {member.bdNo}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bupNo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>BUP Number</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? batchMembers.find(
                              (member) => member.bupNo === field.value
                            )?.bupNo
                          : 'Select BUP Number'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search BUP number..." />
                      <CommandList>
                        <CommandEmpty>No BUP number found.</CommandEmpty>
                        <CommandGroup>
                          {batchMembers.map((member) => (
                            <CommandItem
                              key={member.bupNo}
                              value={member.bupNo}
                              onSelect={() => {
                                form.setValue('bupNo', member.bupNo);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  member.bupNo === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {member.bupNo}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rank"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Rank</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? batchMembers.find(
                              (member) => member.rank === field.value
                            )?.rank
                          : 'Select Rank'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search rank..." />
                      <CommandList>
                        <CommandEmpty>No rank found.</CommandEmpty>
                        <CommandGroup>
                          {Array.from(
                            new Set(batchMembers.map((member) => member.rank))
                          ).map((rank) => (
                            <CommandItem
                              key={rank}
                              value={rank}
                              onSelect={() => {
                                form.setValue('rank', rank);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  rank === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {rank}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Name</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? batchMembers.find(
                              (member) => member.name === field.value
                            )?.name
                          : 'Select Name'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search name..." />
                      <CommandList>
                        <CommandEmpty>No name found.</CommandEmpty>
                        <CommandGroup>
                          {batchMembers.map((member) => (
                            <CommandItem
                              key={member.id}
                              value={member.name}
                              onSelect={() => {
                                form.setValue('name', member.name);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  member.name === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {member.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Branch</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? batchMembers.find(
                              (member) => member.branch === field.value
                            )?.branch
                          : 'Select Branch'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search branch..." />
                      <CommandList>
                        <CommandEmpty>No branch found.</CommandEmpty>
                        <CommandGroup>
                          {Array.from(
                            new Set(batchMembers.map((member) => member.branch))
                          ).map((branch) => (
                            <CommandItem
                              key={branch}
                              value={branch}
                              onSelect={() => {
                                form.setValue('branch', branch);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  branch === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {branch}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marks (1-26)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={26}
                    placeholder="Enter marks"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter a number between 1 and 26.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="markedBy"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Marked By</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? batchMembers.find(
                              (member) => member.name === field.value
                            )?.name
                          : 'Select Marker'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search marker..." />
                      <CommandList>
                        <CommandEmpty>No marker found.</CommandEmpty>
                        <CommandGroup>
                          {batchMembers.map((member) => (
                            <CommandItem
                              key={member.id + '-marker'}
                              value={member.name}
                              onSelect={() => {
                                form.setValue('markedBy', member.name);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  member.name === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {member.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}

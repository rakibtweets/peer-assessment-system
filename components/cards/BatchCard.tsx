'use client';

import Link from 'next/link';
import { Layers, Users, ArrowRight, PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IBatch } from '@/database/batch.model';

interface IBatchCardProps {
  batches: IBatch[];
}

export function BatchCards({ batches }: IBatchCardProps) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Batches</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {batches?.map((batch) => (
          <Card key={batch._id as string}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {batch.name}
              </CardTitle>
              <Layers className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {batch.memberCount} members
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Created on {new Date(batch.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/admin/batches/${batch._id}`}>
                  View Members
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Create New Batch
            </CardTitle>
            <PlusCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>
              Add a new batch to the system to start tracking member marks.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/admin/batches/new">
                Create Batch
                <PlusCircle className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

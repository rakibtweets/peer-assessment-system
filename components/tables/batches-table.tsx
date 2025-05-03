'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MoreHorizontal,
  ArrowUpDown,
  Pencil,
  Trash,
  Eye,
  Users,
  Plus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// import { useBatches } from '@/lib/hooks/use-batches';
import { IBatch } from '@/database/batch.model';
import { formatDate } from '@/lib/utils';
import DeleteBatchButton from '../buttons/DeleteBatchButton';
import { usePathname } from 'next/navigation';

interface IBatchTableProps {
  batches: IBatch[];
}

export default function BatchesTable({ batches }: IBatchTableProps) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof batches)[0] | null;
    direction: 'ascending' | 'descending';
  }>({
    key: 'createdAt',
    direction: 'descending'
  });

  // Filter batches based on search term
  const filteredBatches = batches?.filter((batch) =>
    batch?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort batches based on sort config
  const sortedBatches = [...filteredBatches].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Handle sort request
  const requestSort = (key: keyof (typeof batches)[0]) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Batches</CardTitle>
        <CardDescription>
          View and manage all batches in the system. Click on a batch to see its
          members.
        </CardDescription>
        <div className="flex items-center gap-4 pt-4">
          <Input
            placeholder="Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => requestSort('name')}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Batch Name
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => requestSort('memberCount')}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Members
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => requestSort('createdAt')}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Created
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No batches found.
                </TableCell>
              </TableRow>
            ) : (
              sortedBatches?.map((batch, index) => (
                <TableRow key={batch._id as string}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{batch?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {batch?.memberCount}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(batch?.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/batches/${batch._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Members
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/batches/${batch._id}/add-member`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Members
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/batches/edit/${batch._id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteBatchButton
                          batchId={batch._id as string}
                          pathname={pathname}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

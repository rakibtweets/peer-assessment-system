'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IMember } from '@/database/member.model';
import { IBatch } from '@/database/batch.model';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import DeleteBatchMemberButton from '../buttons/DeleteBatchMemberButton';
import Link from 'next/link';

interface BatchMembersTableProps {
  batchId: string;
  members: IMember[];
  batch?: IBatch;
}

export function BatchMembersTable({
  batchId,
  members,
  batch
}: BatchMembersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(members);
  const pathname = usePathname();

  useEffect(() => {
    const filtered = members?.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.bdNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.bupNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, members]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{batch?.name} - Members</CardTitle>
        <CardDescription>A list of all members in this batch.</CardDescription>
        <div className="mt-4">
          <Input
            placeholder="Search by name, BD number, BUP number, rank, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of all members in {batch?.name}.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>BD Number</TableHead>
              <TableHead>BUP Number</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Average Marks</TableHead>
              <TableHead>Submissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((member) => (
                <TableRow key={member._id as string}>
                  <TableCell>{member.bdNo}</TableCell>
                  <TableCell>{member.bupNo}</TableCell>
                  <TableCell>{member.rank}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.branch}</TableCell>
                  <TableCell>{member.averageMarks}</TableCell>
                  <TableCell>{member.submissionCount}</TableCell>
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
                          <Link
                            href={`/admin/batches/${batchId}/edit/${member._id}`}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteBatchMemberButton
                          memberId={member._id as string}
                          pathname={pathname}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

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
import { useBatchMembers } from '@/lib/hooks/use-batch-members';

interface BatchMembersTableProps {
  batchId: string;
}

export function BatchMembersTable({ batchId }: BatchMembersTableProps) {
  const { members, batchName } = useBatchMembers(batchId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(members);

  useEffect(() => {
    const filtered = members.filter(
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
        <CardTitle>{batchName} - Members</CardTitle>
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
          <TableCaption>A list of all members in {batchName}.</TableCaption>
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
                <TableRow key={member.id}>
                  <TableCell>{member.bdNo}</TableCell>
                  <TableCell>{member.bupNo}</TableCell>
                  <TableCell>{member.rank}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.branch}</TableCell>
                  <TableCell>{member.averageMarks}</TableCell>
                  <TableCell>{member.submissionCount}</TableCell>
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

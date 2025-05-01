'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { IGetSubmissionsForRecipient } from '@/types/actions';

interface RecipientMarksheetWithDataProps {
  recipientId: string;
  submissions: IGetSubmissionsForRecipient[];
  averageMarks: number | undefined;
  recipientName: string | undefined;
}

export default function RecipientMarksheet({
  recipientId,
  submissions,
  averageMarks,
  recipientName
}: RecipientMarksheetWithDataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marks Received by {recipientName}</CardTitle>
        <CardDescription>
          Admin view of all marks received by this member
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This member hasn&apos;t received any marks yet.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md bg-muted/30">
                <p className="text-sm font-medium">Total marks received</p>
                <p className="text-2xl font-bold mt-1">{submissions.length}</p>
              </div>
              <div className="p-4 border rounded-md bg-muted/30">
                <p className="text-sm font-medium">Average mark received</p>
                <p className="text-2xl font-bold mt-1">{averageMarks}</p>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marker</TableHead>
                    <TableHead>BD No</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions?.map((submission, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {submission.marker.name}
                      </TableCell>
                      <TableCell>{submission.marker.bdNo}</TableCell>
                      <TableCell>{submission.marker.rank}</TableCell>
                      <TableCell className="font-medium">
                        {submission.marks}
                      </TableCell>
                      <TableCell>
                        {new Date(submission.submitted).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={3}>Average</TableCell>
                    <TableCell colSpan={2}>{averageMarks}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

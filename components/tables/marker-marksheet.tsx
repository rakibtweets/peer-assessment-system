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
import { IGetSubmissionByMarker } from '@/types/actions';

interface MarkerMarksheetProps {
  markerId: string | undefined;
  markerName: string | undefined;
  bdNo: string | undefined;
  submissions: IGetSubmissionByMarker[];
}

export function MarkerMarksheet({
  markerId,
  markerName,
  submissions,
  bdNo
}: MarkerMarksheetProps) {
  // Calculate average marks given
  const averageMarks =
    submissions.length > 0
      ? Math.round(
          (submissions.reduce((sum, sub) => sum + sub.marks, 0) /
            submissions.length) *
            100
        ) / 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Marks Given by {markerName} {`(BdNo: ${bdNo})`}
        </CardTitle>
        <CardDescription>
          View all marks given by this member to others
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-4">
            No marking data available for this member.
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Total marks given:</span>{' '}
                {submissions.length}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Average mark given:</span>{' '}
                {averageMarks}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>BD No</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {submission.recipient.name}
                    </TableCell>
                    <TableCell>{submission.recipient.bdNo}</TableCell>
                    <TableCell>{submission.recipient.rank}</TableCell>
                    <TableCell>{submission.marks}</TableCell>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}

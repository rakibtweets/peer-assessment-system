'use client';

import { useState, useEffect } from 'react';
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

interface MarkerMarksheetWithDataProps {
  markerId: string | undefined;
  markerName: string | undefined;
  bdNo: string | undefined;
  averageMarks: number | undefined;
  submissions: IGetSubmissionByMarker[];
  isAdminView?: boolean;
}

export default function MarkerMarksheetAdmin({
  markerId,
  bdNo,
  markerName,
  submissions,
  averageMarks,
  isAdminView = false
}: MarkerMarksheetWithDataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Marks Given by {markerName} {`(BdNo: ${bdNo})`}{' '}
        </CardTitle>
        <CardDescription>
          {isAdminView
            ? 'Admin view of all marks given by this member'
            : 'Review all marks you have given to other members'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isAdminView
                ? "This member hasn't marked anyone yet."
                : "You haven't marked any members yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md bg-muted/30">
                <p className="text-sm font-medium">Total marks given</p>
                <p className="text-2xl font-bold mt-1">{submissions.length}</p>
              </div>
              <div className="p-4 border rounded-md bg-muted/30">
                <p className="text-sm font-medium">Average mark given</p>
                <p className="text-2xl font-bold mt-1">{averageMarks}</p>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
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

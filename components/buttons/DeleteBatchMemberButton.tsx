'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteBatchMember } from '@/lib/actions/member.action';

interface IDeleteMemberButtonProps {
  memberId: string;
  pathname: string;
}

const DeleteBatchMemberButton = ({
  memberId,
  pathname
}: IDeleteMemberButtonProps) => {
  const { toast } = useToast();
  const handleDeleteBatch = async (memberId: string) => {
    const res = await deleteBatchMember({
      memberId,
      path: pathname
    });
    if (res.success) {
      toast({
        title: 'Batch member deleted',
        description: 'The batch member has been deleted successfully.',
        variant: 'default'
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            member and all associated member data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteBatch(memberId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteBatchMemberButton;

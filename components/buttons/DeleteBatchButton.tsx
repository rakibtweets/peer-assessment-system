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
import { deleteBatch } from '@/lib/actions/batch.action';
import { useToast } from '@/hooks/use-toast';

interface IDeleteBatchButtonProps {
  batchId: string;
  pathname: string;
}

const DeleteBatchButton = ({ batchId, pathname }: IDeleteBatchButtonProps) => {
  const { toast } = useToast();
  const handleDeleteBatch = async (batchId: string) => {
    const res = await deleteBatch({
      batchId,
      path: pathname
    });
    if (res.success) {
      toast({
        title: 'Batch deleted',
        description: 'The batch has been deleted successfully.',
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
            This action cannot be undone. This will permanently delete the batch
            and all associated member data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteBatch(batchId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteBatchButton;

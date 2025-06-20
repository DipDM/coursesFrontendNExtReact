"use client"

import React from 'react';
import type { CourseInstanceResponse } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface DeleteInstanceDialogProps {
  instance: CourseInstanceResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (instance: CourseInstanceResponse) => Promise<void>;
}

export function DeleteInstanceDialog({ instance, isOpen, onClose, onConfirm }: DeleteInstanceDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    if (instance) {
      setIsDeleting(true);
      await onConfirm(instance);
      setIsDeleting(false);
    }
  };

  if (!isOpen || !instance) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-card shadow-xl rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the instance for 
            <span className="font-semibold"> {instance.course.name} ({instance.year} - Semester {instance.semester})</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              variant="destructive" 
              onClick={handleConfirm} 
              disabled={isDeleting}
            >
              {isDeleting ? <LoadingSpinner size={20} /> : 'Delete Instance'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

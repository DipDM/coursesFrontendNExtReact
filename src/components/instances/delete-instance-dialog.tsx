"use client";

import React, { useEffect, useState } from 'react';
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

interface DeleteInstanceDialogProps {
  instance: CourseInstanceResponse | null;
  isOpen: boolean;
  onConfirm: (instance: CourseInstanceResponse) => Promise<void>;
  onDone: () => void;
  onClose?: () => void; // Optional, for consistency with other dialogs
}

export function DeleteInstanceDialog({ instance, isOpen, onConfirm, onDone }: DeleteInstanceDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    if (isDeleting) {
      const interval = setInterval(() => {
        setDotCount(prev => (prev % 3) + 1);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [isDeleting]);

  const handleConfirm = async () => {
    if (instance) {
      setIsDeleting(true);
      await onConfirm(instance);
      setIsDeleting(false);
      onDone(); // Close dialog after deletion
    }
  };

  if (!isOpen || !instance) return null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-card shadow-xl rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the instance for
            <span className="font-semibold"> {instance.course_name} ({instance.year} - Semester {instance.semester})</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={onDone}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="font-semibold bg-red-700 hover:bg-red-800 text-white"
            >
              {isDeleting ? `Deleting${'.'.repeat(dotCount)}` : 'Delete Instance'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client"

import React from 'react';
import type { Course } from '@/types';
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
import { LoadingSpinner } from '../ui/loading-spinner';

interface DeleteCourseDialogProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (courseId: number) => Promise<void>;
}

export function DeleteCourseDialog({ course, isOpen, onClose, onConfirm }: DeleteCourseDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    if (course) {
      setIsDeleting(true);
      await onConfirm(course.id);
      setIsDeleting(false);
    }
  };
  
  if (!isOpen || !course) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-card shadow-xl rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the course 
            <span className="font-semibold"> {course.name} ({course.code})</span> and all its associated instances.
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
              {isDeleting ? <LoadingSpinner size={20} /> : 'Delete Course'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

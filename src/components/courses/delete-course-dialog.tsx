"use client";

import React, { useEffect, useState } from 'react';
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

interface DeleteCourseDialogProps {
  course: Course | null;
  isOpen: boolean;
  onDone: () => void;
  onConfirm: (courseId: number) => Promise<void>;
}

export function DeleteCourseDialog({ course, isOpen, onDone , onConfirm }: DeleteCourseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isDeleting) {
      interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 5);
      }, 600);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDeleting]);

  const handleConfirm = async () => {
    if (course) {
      setIsDeleting(true);
      await onConfirm(course.id);
      setIsDeleting(false);
    onDone(); // 
    }
  };


  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      onDone();
    }
  };

  if (!isOpen || !course) return null;

  return (
    <AlertDialog open={isOpen} >
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
            <Button variant="outline" onClick={onDone} disabled={isDeleting}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting
                ? `Deleting${'.'.repeat(dotCount)}`
                : 'Delete Course'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

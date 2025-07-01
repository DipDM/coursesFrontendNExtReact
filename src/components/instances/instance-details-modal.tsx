"use client"

import React from 'react';
import type { CourseInstanceResponse } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface InstanceDetailsModalProps {
  instance: CourseInstanceResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InstanceDetailsModal({ instance, isOpen, onClose }: InstanceDetailsModalProps) {
  if (!isOpen || !instance) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-card shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Instance Details</DialogTitle>
          <DialogDescription>
            Detailed information for the selected course instance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Course</h3>
            <p className="text-lg font-semibold">{instance.course_name} ({instance.course_code})</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Year</h3>
              <p className="text-lg">{instance.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Semester</h3>
              <p className="text-lg">{instance.semester}</p>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Instructor</h3>
            <p className="text-lg">{instance.instructor}</p>
          </div>
           {instance.course_description && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Course Description</h3>
                <p className="text-base text-foreground/80 whitespace-pre-wrap">{instance.course_description}</p>
              </div>
            </>
          )}
        </div>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="mt-4 w-full font-bold bg-green-600" onClick={onClose}>
            Okay
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

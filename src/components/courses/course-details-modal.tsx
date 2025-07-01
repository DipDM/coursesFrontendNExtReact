"use client";

import React, { useEffect, useState } from 'react';
import type { Course } from '@/types';
import { getCourseById, fetchCourses } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface CourseDetailsModalProps {
  courseId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CourseDetailsModal({ courseId, isOpen, onClose }: CourseDetailsModalProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]); // ✅ moved inside the component
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && courseId !== null) {
      const fetchCourseDetails = async () => {
        setLoading(true);
        try {
          const courseList = await fetchCourses();
          setAllCourses(courseList);
          const data = await getCourseById(courseId);
          setCourse(data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
          toast({
            title: "Error",
            description: `Failed to fetch course details: ${errorMessage}`,
            variant: "destructive",
          });
          onClose(); // Close modal on error
        } finally {
          setLoading(false);
        }
      };
      fetchCourseDetails();
    }
  }, [courseId, isOpen, onClose, toast]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-card shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Course Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size={40} />
          </div>
        ) : course ? (
          <div className="space-y-4 py-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
              <p className="text-lg font-semibold">{course.code}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-lg">{course.name}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="text-base text-foreground/80 whitespace-pre-wrap">{course.description}</p>
            </div>
            {(course?.prerequisites ?? []).length > 0 && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Prerequisites</h3>
                <div className="flex flex-wrap gap-2">
                  {(course?.prerequisites ?? []).map((pid) => {
                    const prereq = allCourses.find(c => c.id === pid);
                    return prereq ? (
                      <Badge key={pid} variant="outline">
                        {prereq.code} - {prereq.name}
                      </Badge>
                    ) : (
                      <Badge key={pid} variant="destructive">
                        Unknown Course ({pid})
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <DialogDescription>No course details found.</DialogDescription>
        )}
        <DialogClose asChild>
          <Button type="button" variant="outline" className="mt-4 w-full" onClick={onClose}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

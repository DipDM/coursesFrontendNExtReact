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

interface CourseDetailsModalProps {
  courseId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CourseDetailsModal({ courseId, isOpen, onClose }: CourseDetailsModalProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
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
          onClose();
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
            
            {/* Prerequisites (display-only, no links) */}
            {(course?.prerequisites ?? []).length > 0 && (
              <div className="bg-muted/30 border rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  You must complete the following courses first:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {course.prerequisites?.map((pid) => {
                    const prereq = allCourses.find(c => c.id === pid);
                    return prereq ? (
                      <span
                        key={pid}
                        className="bg-orange-500 text-white font-medium rounded-full px-4 py-1 text-sm shadow"
                      >
                        {prereq.name}
                      </span>
                    ) : (
                      <span
                        key={pid}
                        className="bg-red-500 text-white font-medium rounded-full px-4 py-1 text-sm shadow"
                      >
                        Unknown Course ({pid})
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Course Name */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Course Name</h3>
              <p className="text-lg font-semibold">{course.name}</p>
            </div>


            <Separator />

            {/* Course Code */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
              <p className="text-base">{course.code}</p>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="text-base text-foreground/80 whitespace-pre-wrap">{course.description}</p>
            </div>
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

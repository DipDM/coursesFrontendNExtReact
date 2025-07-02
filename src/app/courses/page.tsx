"use client"

import React, { useState, useEffect, useCallback } from 'react';
import type { Course } from '@/types';
import { fetchCourses, deleteCourse as apiDeleteCourse } from '@/lib/api';
import { AppLayout } from '@/components/layout/app-layout';
import { CourseList } from '@/components/courses/course-list';
import { CourseForm } from '@/components/courses/course-form';
import { CourseDetailsModal } from '@/components/courses/course-details-modal';
import { DeleteCourseDialog } from '@/components/courses/delete-course-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [viewingCourseId, setViewingCourseId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const { toast } = useToast();

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Failed to load courses: ${errorMessage}`);
      toast({ title: "Error", description: `Failed to load courses: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleCreateNew = () => {
    setEditingCourse(null); // Ensure it's a create operation
    setIsCreateModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsCreateModalOpen(true);
  };

  const handleFormSuccess = () => {
    loadCourses(); // Refresh list on success
  };

  const handleViewDetails = (courseId: number) => {
    setViewingCourseId(courseId);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setDeletingCourse(course);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteCourse = async (id: number) => {
    const isUsedAsPrerequisite = courses.some(course =>
      course.prerequisites?.includes(id)
    );

    if (isUsedAsPrerequisite) {
      toast({
        title: "Cannot Delete Course",
        description: "This course is a prerequisite for other courses. Remove it from those courses before deleting.",
        variant: "destructive",
      });
      setIsDeleteAlertOpen(false);
      setDeletingCourse(null);
      return;
    }

    // Proceed with deletion
    try {
      await apiDeleteCourse(id);
      toast({ title: "Success", description: "Course deleted successfully." });
      loadCourses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: `Failed to delete course: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };


  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Courses Management</h1>
            <p className="text-muted-foreground">
              Oversee all academic courses offered.
            </p>
          </div>
          <Button onClick={handleCreateNew} className="shadow-md hover:shadow-lg transition-shadow">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Course
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="shadow-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Loading Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CourseList
          courses={courses}
          onViewDetails={handleViewDetails}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
          isLoading={isLoading}
        />
      </div>

      <CourseForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleFormSuccess}
        courseToEdit={editingCourse}
        allCourses={courses}
      />

      <CourseDetailsModal
        courseId={viewingCourseId}
        isOpen={isDetailsModalOpen}
        onClose={() => { setIsDetailsModalOpen(false); setViewingCourseId(null); }}
      />

      <DeleteCourseDialog
        course={deletingCourse}
        isOpen={isDeleteAlertOpen}
        onConfirm={confirmDeleteCourse}
        onDone={() => {
          setIsDeleteAlertOpen(false); 
          setDeletingCourse(null);
        }}
      />

    </AppLayout>
  );
}

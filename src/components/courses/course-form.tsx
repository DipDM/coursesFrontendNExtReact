"use client"

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseSchema, CourseFormValues } from '@/zod-schemas';
import type { Course, CoursePayload } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createCourse, updateCourse } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseToEdit?: Course | null;
}

export function CourseForm({ isOpen, onClose, onSuccess, courseToEdit }: CourseFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (courseToEdit) {
      form.reset({
        code: courseToEdit.code,
        name: courseToEdit.name,
        description: courseToEdit.description,
      });
    } else {
      form.reset({
        code: '',
        name: '',
        description: '',
      });
    }
  }, [courseToEdit, form, isOpen]); 
  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CoursePayload = values;
      if (courseToEdit) {
        await updateCourse(courseToEdit.id, payload);
        toast({ title: "Success", description: "Course updated successfully." });
      } else {
        await createCourse(payload);
        toast({ title: "Success", description: "Course created successfully." });
      }
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: `Failed to ${courseToEdit ? 'update' : 'create'} course: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] bg-card shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{courseToEdit ? 'Edit Course' : 'Create New Course'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CS101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Programming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed description of the course content..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner size={20} /> : (courseToEdit ? 'Save Changes' : 'Create Course')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

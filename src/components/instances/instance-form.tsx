"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InstanceSchema, InstanceFormValues } from '@/zod-schemas';
import type { Course, CourseInstancePayload, CourseInstanceResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { createInstance, updateInstance } from '@/lib/api';

interface InstanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courses: Course[];
  instanceToEdit?: CourseInstanceResponse | null;
  currentFilters?: { year?: number; semester?: number };
}

export function InstanceForm({
  isOpen,
  onClose,
  onSuccess,
  courses,
  instanceToEdit,
  currentFilters
}: InstanceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dotCount, setDotCount] = useState(1);

  const form = useForm<InstanceFormValues>({
    resolver: zodResolver(InstanceSchema),
    defaultValues: {
      course_id: 0,
      year: (currentFilters ?? {}).year ?? new Date().getFullYear(),
      semester: (currentFilters ?? {}).semester ?? 1,
      instructor: '',
    },
  });

  useEffect(() => {
    if (instanceToEdit) {
      form.reset({
        course_id: instanceToEdit.course_id,
        year: instanceToEdit.year,
        semester: instanceToEdit.semester,
        instructor: instanceToEdit.instructor,
      });
    } else {
      form.reset({
        course_id: courses.length > 0 ? courses[0].id : 0,
        year: (currentFilters ?? {}).year ?? new Date().getFullYear(),
        semester: (currentFilters ?? {}).semester ?? 1,
        instructor: '',
      });
    }
  }, [instanceToEdit, form, courses, currentFilters, isOpen]);

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev % 4) + 1);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isSubmitting]);

  const courseOptions = useMemo(() => courses.map(course => (
    <SelectItem key={course.id} value={String(course.id)}>
      {course.name} ({course.code})
    </SelectItem>
  )), [courses]);

  const onSubmit = async (values: InstanceFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CourseInstancePayload = {
        course_id: Number(values.course_id),
        year: values.year,
        semester: values.semester,
        instructor: values.instructor,
      };

      if (instanceToEdit) {
        await updateInstance(instanceToEdit.year, instanceToEdit.semester, instanceToEdit.id, payload);
        toast({ title: "Success", description: "Instance updated successfully." });
      } else {
        await createInstance(payload);
        toast({ title: "Success", description: "Instance created successfully." });
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: `Failed to ${instanceToEdit ? 'update' : 'create'} instance: ${errorMessage}`,
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
          <DialogTitle className="text-2xl font-headline">
            {instanceToEdit ? 'Edit Instance' : 'Create New Instance'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="course_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseOptions}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input type="value" placeholder="e.g., 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    <Input type="value" placeholder="e.g., 1 or 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dr. Gangadhar Sashtri" {...field} />
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
                {isSubmitting ? `Saving${'.'.repeat(dotCount)}` : (instanceToEdit ? 'Save Changes' : 'Create Instance')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

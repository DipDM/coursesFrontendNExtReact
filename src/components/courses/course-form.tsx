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
  allCourses: Course[];
}

export function CourseForm({ isOpen, onClose, onSuccess, courseToEdit, allCourses }: CourseFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dots, setDots] = React.useState('');


  const form = useForm<CourseFormValues>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      prerequisites: [],
    },
  });

  useEffect(() => {
    if (!isSubmitting) {
      setDots('');
      return;
    }

    const dotCycle = ['', '.', '..', '...'];
    let index = 0;

    const interval = setInterval(() => {
      setDots(dotCycle[index]);
      index = (index + 1) % dotCycle.length;
    }, 600);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  useEffect(() => {
    if (courseToEdit) {
      form.reset({
        code: courseToEdit.code,
        name: courseToEdit.name,
        description: courseToEdit.description,
        prerequisites: courseToEdit.prerequisites ?? [],
      });
    } else {
      form.reset({
        code: '',
        name: '',
        description: '',
        prerequisites: [],
      });
    }
  }, [courseToEdit, form, isOpen]);
  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CoursePayload = {
        code: values.code,
        name: values.name,
        description: values.description,
        prerequisites: values.prerequisites || [],
      };
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
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{courseToEdit ? 'Edit Course' : 'Create New Course'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1 sm:p-4">
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
            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisites</FormLabel>

                  {/* ✅ Live Preview Above */}
                  {field.value?.length > 0 && (
                    <div
                      className="mb-4 p-3 rounded-lg bg-muted/30 border transition-all duration-300 ease-in-out"
                    >
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        Selected Prerequisites
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((id) => {
                          const selected = allCourses.find((c) => c.id === id);
                          return selected ? (
                            <span
                              key={id}
                              className="bg-orange-500 text-white font-medium rounded-full px-4 py-1 text-sm shadow transition-transform transform hover:scale-105"
                            >
                              {selected.code} - {selected.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* ✅ Checkbox Grid Below */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2 transition-opacity duration-300">
                    {allCourses
                      .filter((c) => c.id !== courseToEdit?.id)
                      .map((course) => (
                        <label key={course.id} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            value={course.id}
                            checked={field.value?.includes(course.id)}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (e.target.checked) {
                                field.onChange([...(field.value || []), value]);
                              } else {
                                field.onChange((field.value || []).filter((id) => id !== value));
                              }
                            }}
                          />
                          <span>{course.name}</span>
                        </label>
                      ))}
                  </div>
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
                {isSubmitting
                  ? (
                    <span className="flex items-center gap-2">
                      
                      <span className='text-white bg-blue-800'>Saving{dots}</span>
                    </span>
                  )
                  : (courseToEdit ? 'Save Changes' : 'Create Course')
                }
              </Button>

            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

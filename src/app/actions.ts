"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import * as api from '@/lib/api';
import type { CourseFormData, CourseInstanceFormData } from '@/types';

const courseFormSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  
});

export async function createCourseAction(formData: CourseFormData) {
  const validatedFields = courseFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid data provided.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const newCourse = await api.createCourse(validatedFields.data);
    revalidatePath('/courses');
    return { success: true, data: newCourse };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create course." };
  }
}

export async function deleteCourseAction(id: number) {
  try {
    await api.deleteCourse(id);
    revalidatePath('/courses');
    return { success: true, message: "Course deleted successfully." };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete course." };
  }
}


const instanceFormSchema = z.object({
  courseId: z.string().min(1, "Course selection is required"),
  year: z.coerce.number().min(new Date().getFullYear() - 5, "Year is too far in the past").max(new Date().getFullYear() + 5, "Year is too far in the future"),
  semester: z.coerce
    .number({ invalid_type_error: "Semester must be a number" })
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
  instructor: z.string().min(3, "Instructor name must be at least 3 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
});


export async function createInstanceAction(formData: CourseInstanceFormData) {
  const validatedFields = instanceFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid data provided.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const payload = {
      course_id: Number(validatedFields.data.courseId),
      year: validatedFields.data.year,
      semester: validatedFields.data.semester,
      instructor: validatedFields.data.instructor,
    };
    const newInstance = await api.createInstance(payload);
    revalidatePath(`/instances/${newInstance.year}/${newInstance.semester}`);
    revalidatePath('/instances');
    return { success: true, data: newInstance };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create instance." };
  }
}

export async function deleteInstanceAction(year: number, semester: number, course_id: number) {
  try {
    await api.deleteInstance(year, semester, course_id);
    revalidatePath(`/instances/${year}/${semester}`);
    revalidatePath('/instances');
    return { success: true, message: "Instance deleted successfully." };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete instance." };
  }
}
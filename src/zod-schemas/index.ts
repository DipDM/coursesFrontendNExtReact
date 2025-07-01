import { z } from 'zod';

export const CourseSchema = z.object({
  code: z.string().min(1, { message: "Course code is required." }).max(10, { message: "Code must be 10 characters or less." }),
  name: z.string().min(1, { message: "Course name is required." }).max(100),
  description: z.string().min(1, { message: "Description is required." }),
  prerequisites: z.array(z.number()).optional().default([]),
});

export type CourseFormValues = z.infer<typeof CourseSchema>;

export const InstanceSchema = z.object({
  course_id: z.coerce.number().min(1, { message: "Please select a course." }),
  year: z.coerce.number({ invalid_type_error: "Year must be a number." }).min(2000, { message: "Year must be 2000 or later." }).max(2100, { message: "Year must be 2100 or earlier." }),
  semester: z.coerce.number({ invalid_type_error: "Semester must be a number." }).min(1, { message: "Semester is required (e.g., 1 for Spring, 2 for Fall)." }).max(8, { message: "Semester must be between 1 and 4." }), // Assuming numeric semester, e.g., 1, 2
  instructor: z.string().min(1, { message: "Instructor name is required." }).max(100),
});

export type InstanceFormValues = z.infer<typeof InstanceSchema>;


export const InstanceFilterSchema = z
  .object({
    year: z
      .union([z.string().regex(/^\d+$/), z.literal('')])
      .transform((val) => (val === '' ? undefined : Number(val))),
    
    semester: z
      .union([z.string().regex(/^\d+$/), z.literal('')])
      .transform((val) => (val === '' ? undefined : Number(val))),
  })
  .refine(
    (data) =>
      (data.year === undefined || (data.year >= 2000 && data.year <= 2100)) &&
      (data.semester === undefined || (data.semester >= 1 && data.semester <= 8)),
    {
      message: "Invalid filter values",
    }
  );

 export type InstanceFilterValues = z.infer<typeof InstanceFilterSchema>;

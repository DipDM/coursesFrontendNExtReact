export interface Course {
  prerequisites?: number[];
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface CoursePayload {
  code: string;
  name: string;
  description: string;
}

export type CourseFormData = {
  code: string;
  name: string;
  description: string;
};

export interface CourseInstance {
  id: number;
  course_id: number;
  year: number;
  semester: number;
  instructor: string;
}

export interface CourseInstanceResponse {
  id: number;
  course_id: number;
  course_name: string;
  course_code: string;
  course_description: string;
  year: number;
  semester: number;
  instructor: string;
}

export interface CourseInstancePayload {
  course_id: number;
  year: number;
  semester: number;
  instructor: string;
}

export type CourseInstanceFormData = {
  courseId: string;
  year: number;
  semester: number;
};

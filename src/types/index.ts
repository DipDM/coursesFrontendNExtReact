export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface CoursePayload {
  code: string;
  name: string;
  description: string;
}

export interface CourseInstance {
  id: number;
  course_id: number; 
  year: number;
  semester: number; 
  instructor: string;
}

export interface CourseInstanceResponse {
  id: number;
  course: Course;        // ✅ full course object from backend
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

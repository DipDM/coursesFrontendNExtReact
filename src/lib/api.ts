
import type { Course, CoursePayload, CourseInstancePayload, CourseInstanceResponse } from '@/types';

const API_BASE_URL = 'https://coursesapiinternship.onrender.com/api'; 


async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Could not parse error JSON, stick with status code message
    }
    throw new Error(errorMessage);
  }
  if (response.status === 204) { // No Content
    return undefined as T;
  }
  return response.json();
}

// Courses API
export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE_URL}/courses`);
  return handleResponse<Course[]>(response);
}

export async function createCourse(payload: CoursePayload): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Course>(response);
}

export async function getCourseById(id: number): Promise<Course | null> {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`);
  return handleResponse<Course | null>(response);
}

export async function updateCourse(id: number, payload: Partial<CoursePayload>): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/courses/${id}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Course>(response);
}

export async function deleteCourse(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response);
}

// Instances API
export async function fetchInstances(year?: number, semester?: number): Promise<CourseInstanceResponse[]> {
  const queryParams = new URLSearchParams();
  if (year !== undefined) {
    queryParams.append('year', String(year));
  }
  if (semester !== undefined) {
    queryParams.append('semester', String(semester));
  }
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/instances${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  return handleResponse<CourseInstanceResponse[]>(response);
}

export async function fetchAllInstances() {
  const res = await fetch(`${API_BASE_URL}/instances`);
  if (!res.ok) throw new Error("Failed to fetch all instances.");
  return res.json();
}


export async function createInstance(payload: CourseInstancePayload): Promise<CourseInstanceResponse> {
  const response = await fetch(`${API_BASE_URL}/instances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<CourseInstanceResponse>(response);
}

export async function fetchInstancesByYearSemester(year: number, semester: number): Promise<CourseInstanceResponse[]> {
  const response = await fetch(`${API_BASE_URL}/instances/${year}/${semester}`);
  return handleResponse<CourseInstanceResponse[]>(response);
}


export async function getInstanceById(year: number, semester: number, id: number): Promise<CourseInstanceResponse | null> {
  // Assuming instance ID is unique within a given year and semester
  const response = await fetch(`${API_BASE_URL}/instances/${year}/${semester}/${id}`);
  return handleResponse<CourseInstanceResponse | null>(response);
}

export async function updateInstance(year: number, semester: number, id: number, payload: Partial<CourseInstancePayload>): Promise<CourseInstanceResponse> {
  const response = await fetch(`${API_BASE_URL}/instances/${id}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<CourseInstanceResponse>(response);
}

export async function deleteInstance(year: number, semester: number, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/instances/${year}/${semester}/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response);
}

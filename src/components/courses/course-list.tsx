
"use client"

import type { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit3, Trash2, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from 'next/image';

interface CourseListProps {
  courses: Course[];
  onViewDetails: (courseId: number) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  isLoading: boolean;
}

export function CourseList({ courses, onViewDetails, onEdit, onDelete, isLoading }: CourseListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="shadow-lg animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6 mt-2"></div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <div className="h-8 w-20 bg-muted rounded"></div>
              <div className="h-8 w-20 bg-muted rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <Card className="col-span-full flex flex-col items-center justify-center p-10 border-dashed border-2 rounded-lg shadow-none">
        <Image src="https://placehold.co/300x200.png" alt="No courses" width={300} height={200} className="mb-6 rounded-md opacity-70 w-full max-w-[240px] h-auto sm:max-w-[300px]" data-ai-hint="empty state illustration" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Courses Yet</h3>
        <p className="text-muted-foreground text-center">Looks like there are no courses available. <br/> Why not add the first one?</p>
      </Card>
    );
  }
  
  // Using Table for a more structured list view
  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Available Courses</CardTitle>
        <CardDescription>Browse, manage, and organize all registered courses.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Description (Snippet)</TableHead>
              <TableHead className="text-right w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">{course.code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-xs">
                  {course.description.length > 80 ? `${course.description.substring(0, 80)}...` : course.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onViewDetails(course.id)} aria-label={`View details for ${course.name}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(course)} aria-label={`Edit ${course.name}`}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(course)} aria-label={`Delete ${course.name}`} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

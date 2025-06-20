
"use client"

import type { CourseInstanceResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit3, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface InstanceListProps {
  instances: CourseInstanceResponse[];
  onViewDetails: (instance: CourseInstanceResponse) => void;
  onEdit: (instance: CourseInstanceResponse) => void;
  onDelete: (instance: CourseInstanceResponse) => void;
  isLoading: boolean;
}

export function InstanceList({ instances, onViewDetails, onEdit, onDelete, isLoading }: InstanceListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <Card key={i} className="shadow-lg animate-pulse">
            <CardHeader>
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
              <div className="h-4 bg-muted rounded w-1/3 mt-1"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full"></div>
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

  if (instances.length === 0) {
    return (
       <Card className="col-span-full flex flex-col items-center justify-center p-10 border-dashed border-2 rounded-lg shadow-none">
        <Image src="https://placehold.co/300x200.png" alt="No instances" width={300} height={200} className="mb-6 rounded-md opacity-70 w-full max-w-[240px] h-auto sm:max-w-[300px]" data-ai-hint="empty state calendar" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Instances Found</h3>
        <p className="text-muted-foreground text-center">Try adjusting the filters or add a new instance.</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Course Instances</CardTitle>
        <CardDescription>View and manage scheduled course instances.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead className="hidden sm:table-cell">Year</TableHead>
              <TableHead className="hidden sm:table-cell">Semester</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead className="text-right w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.map((instance) => (
              <TableRow key={instance.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="font-medium">{instance.course.name}</div>
                  <div className="text-xs text-muted-foreground">{instance.course.code}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{instance.year}</TableCell>
                <TableCell className="hidden sm:table-cell">{instance.semester}</TableCell>
                <TableCell>{instance.instructor}</TableCell>
                <TableCell className="text-right">
                   <div className="flex justify-end items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onViewDetails(instance)} aria-label={`View details for ${instance.course.name} instance`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(instance)} aria-label={`Edit ${instance.course.name} instance`}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(instance)} aria-label={`Delete ${instance.course.name} instance`} className="text-destructive hover:text-destructive hover:bg-destructive/10">
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

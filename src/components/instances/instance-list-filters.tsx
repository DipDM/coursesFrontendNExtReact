
"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InstanceFilterSchema, InstanceFilterValues } from '@/zod-schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, RotateCcw } from 'lucide-react';
import { fetchInstancesByYearSemester } from '@/lib/api'; 

interface InstanceListFiltersProps {
  onFilterChange: (filters: InstanceFilterValues) => void;
  onClearFilters: () => void;
  initialYear?: number;
  initialSemester?: number;
}

export function InstanceListFilters({ 
  onFilterChange, 
  onClearFilters,
  initialYear = new Date().getFullYear(), 
  initialSemester = 1 
}: InstanceListFiltersProps) {
  const form = useForm<InstanceFilterValues>({
    resolver: zodResolver(InstanceFilterSchema),
    defaultValues: {
      year: initialYear,
      semester: initialSemester,
    },
  });

  const onSubmit = (values: InstanceFilterValues) => {
    onFilterChange(values);
  };

  const handleClear = () => {
    form.reset({ year: initialYear, semester: initialSemester });
    onClearFilters();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Instances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2024" {...field} />
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
                      <Input type="number" placeholder="e.g., 1 or 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-2 sm:col-span-2 md:col-span-1 md:self-end">
                <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-shadow">
                  Apply Filters
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClear} 
                  className="w-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

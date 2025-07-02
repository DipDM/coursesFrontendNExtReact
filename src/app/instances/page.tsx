"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { CourseInstanceResponse, Course } from '@/types';
import {
  fetchInstancesByYearSemester,
  fetchAllInstances,
  fetchCourses,
  deleteInstance as apiDeleteInstance
} from '@/lib/api';
import { AppLayout } from '@/components/layout/app-layout';
import { InstanceListFilters } from '@/components/instances/instance-list-filters';
import { InstanceList } from '@/components/instances/instance-list';
import { InstanceForm } from '@/components/instances/instance-form';
import { InstanceDetailsModal } from '@/components/instances/instance-details-modal';
import { DeleteInstanceDialog } from '@/components/instances/delete-instance-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { InstanceFilterValues } from '@/zod-schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const defaultFilters: InstanceFilterValues = {
  year: undefined,
  semester: undefined,
};

export default function InstancesPage() {
  const [instances, setInstances] = useState<CourseInstanceResponse[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAll, setShowAll] = useState(false);

  const [filters, setFilters] = useState<InstanceFilterValues>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingInstance, setEditingInstance] = useState<CourseInstanceResponse | null>(null);

  const [viewingInstance, setViewingInstance] = useState<CourseInstanceResponse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [deletingInstance, setDeletingInstance] = useState<CourseInstanceResponse | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const { toast } = useToast();

  const loadInstances = useCallback(async (filtersToApply?: InstanceFilterValues) => {
    setIsLoading(true);
    setError(null);
    try {
      let data: CourseInstanceResponse[];

      if (!showAll && filtersToApply?.year && filtersToApply?.semester) {
        data = await fetchInstancesByYearSemester(filtersToApply.year, filtersToApply.semester);
      } else {
        data = await fetchAllInstances();
      }

      setInstances(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Failed to load instances: ${errorMessage}`);
      toast({ title: "Error", description: `Failed to load instances: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast, showAll]);

  const loadCoursesForForm = useCallback(async () => {
    try {
      const coursesData = await fetchCourses();
      setCourses(coursesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({ title: "Error", description: `Failed to load courses for form: ${errorMessage}`, variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    loadInstances();
  }, [loadInstances]);

  useEffect(() => {
    loadCoursesForForm();
  }, [loadCoursesForForm]);

  const handleFilterChange = useCallback((newFilters: InstanceFilterValues) => {
    const hasValidFilter = newFilters.year || newFilters.semester;
    if (hasValidFilter) {
      setShowAll(false);
      setFilters(newFilters);
      loadInstances(newFilters);
    }
  }, [loadInstances]);

  const handleClearFilters = useCallback(() => {
    setShowAll(true);
    setFilters({});
    loadInstances();
  }, [loadInstances]);

  const handleCreateNew = () => {
    if (courses.length === 0) {
      toast({ title: "Cannot Add Instance", description: "Please create courses first before adding instances.", variant: "destructive" });
      return;
    }
    setEditingInstance(null);
    setIsCreateModalOpen(true);
  };

  const handleEditInstance = (instance: CourseInstanceResponse) => {
    setEditingInstance(instance);
    setIsCreateModalOpen(true);
  };

  const handleFormSuccess = () => {
    loadInstances(filters);
  };

  const handleViewDetails = (instance: CourseInstanceResponse) => {
    setViewingInstance(instance);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteInstance = (instance: CourseInstanceResponse) => {
    setDeletingInstance(instance);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteInstance = async (instance: CourseInstanceResponse) => {
    try {
      await apiDeleteInstance(instance.year, instance.semester, instance.course_id);
      toast({ title: "Success", description: "Instance deleted successfully." });
      loadInstances(filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({ title: "Error", description: `Failed to delete instance: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsDeleteAlertOpen(false);
      setDeletingInstance(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Instance Management</h1>
            <p className="text-muted-foreground">Manage and schedule course delivery instances.</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="shadow-md hover:shadow-lg transition-shadow"
            disabled={courses.length === 0 && !isLoading}
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Instance
          </Button>
        </div>

        <InstanceListFilters
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initialYear={defaultFilters.year}
          initialSemester={defaultFilters.semester}
        />

        {error && (
          <Alert variant="destructive" className="shadow-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Loading Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <InstanceList
          instances={instances}
          onViewDetails={handleViewDetails}
          onEdit={handleEditInstance}
          onDelete={handleDeleteInstance}
          isLoading={isLoading}
        />
      </div>

      <InstanceForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setShowAll(false);
          handleFormSuccess();
        }}
        courses={courses}
        instanceToEdit={editingInstance}
        currentFilters={filters}
      />

      <InstanceDetailsModal
        instance={viewingInstance}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setViewingInstance(null);
        }}
      />

      <DeleteInstanceDialog
        instance={deletingInstance}
        isOpen={isDeleteAlertOpen}
        onConfirm={confirmDeleteInstance}
        onDone={() => {
          setIsDeleteAlertOpen(false);
          setDeletingInstance(null);
        }}
      />
    </AppLayout>
  );
}

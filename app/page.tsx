'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Job, getAllJobs, updateJobStatus, searchJobs, updateJobOrder } from '@/app/lib/storage';
import JobColumn from '@/app/components/JobColumn';
import AddJobForm from '@/app/components/AddJobForm';
import DarkModeToggle from '@/app/components/DarkModeToggle';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Load jobs from storage
  const loadJobs = useCallback(() => {
    if (searchQuery.trim()) {
      setJobs(searchJobs(searchQuery));
    } else {
      setJobs(getAllJobs());
    }
  }, [searchQuery]);

  useEffect(() => {
    setIsMounted(true);
    loadJobs();

    // Listen for storage changes from other tabs
    const handleStorageChange = () => {
      loadJobs();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadJobs]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside droppable area
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Update the job status
    updateJobStatus(draggableId, destination.droppableId as Job['status']);

    // Reload jobs
    loadJobs();
  };

  const handleJobAdded = () => {
    loadJobs();
  };

  const handleJobDelete = (jobId: string) => {
    loadJobs();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Get jobs grouped by status
  const getJobsByStatus = (status: Job['status']) => {
    return jobs.filter(job => job.status === status);
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-white dark:bg-gray-900" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                🎯 Job Tracker
              </h1>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search by company or position..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <AddJobForm onJobAdded={handleJobAdded} />
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <JobColumn
              title="Wishlist"
              status="wishlist"
              jobs={getJobsByStatus('wishlist')}
              onJobDelete={handleJobDelete}
            />
            <JobColumn
              title="Applied"
              status="applied"
              jobs={getJobsByStatus('applied')}
              onJobDelete={handleJobDelete}
            />
            <JobColumn
              title="Interview"
              status="interview"
              jobs={getJobsByStatus('interview')}
              onJobDelete={handleJobDelete}
            />
            <JobColumn
              title="Rejected"
              status="rejected"
              jobs={getJobsByStatus('rejected')}
              onJobDelete={handleJobDelete}
            />
          </div>
        </DragDropContext>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery ? 'No jobs found matching your search.' : 'No jobs yet. Add your first job to get started!'}
            </p>
          </div>
        )}

        {/* Stats Footer */}
        {jobs.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Wishlist</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {getJobsByStatus('wishlist').length}
                </p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Applied</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {getJobsByStatus('applied').length}
                </p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Interview</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {getJobsByStatus('interview').length}
                </p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {getJobsByStatus('rejected').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

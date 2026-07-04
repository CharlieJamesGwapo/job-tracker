'use client';

import { Job } from '@/app/lib/storage';
import { Droppable } from 'react-beautiful-dnd';
import JobCard from './JobCard';

interface JobColumnProps {
  title: string;
  status: Job['status'];
  jobs: Job[];
  onJobDelete: (jobId: string) => void;
}

const statusColors: Record<Job['status'], string> = {
  wishlist: 'bg-purple-100 dark:bg-purple-900/30',
  applied: 'bg-blue-100 dark:bg-blue-900/30',
  interview: 'bg-yellow-100 dark:bg-yellow-900/30',
  rejected: 'bg-red-100 dark:bg-red-900/30',
};

const statusBorderColors: Record<Job['status'], string> = {
  wishlist: 'border-purple-300 dark:border-purple-700',
  applied: 'border-blue-300 dark:border-blue-700',
  interview: 'border-yellow-300 dark:border-yellow-700',
  rejected: 'border-red-300 dark:border-red-700',
};

export default function JobColumn({
  title,
  status,
  jobs,
  onJobDelete,
}: JobColumnProps) {
  return (
    <div className={`flex-1 min-w-80 rounded-lg border-2 ${statusBorderColors[status]} ${statusColors[status]} p-4`}>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              min-h-96 rounded-lg p-3 space-y-3
              ${snapshot.isDraggingOver ? 'bg-gray-200/50 dark:bg-gray-700/50' : 'bg-transparent'}
              transition-colors duration-200
            `}
          >
            {jobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                index={index}
                onDelete={onJobDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

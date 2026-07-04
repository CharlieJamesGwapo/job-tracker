'use client';

import { Job, deleteJob } from '@/app/lib/storage';
import { Draggable } from 'react-beautiful-dnd';

interface JobCardProps {
  job: Job;
  index: number;
  onDelete: (jobId: string) => void;
}

export default function JobCard({ job, index, onDelete }: JobCardProps) {
  const handleDelete = () => {
    if (confirm(`Delete "${job.position}" at ${job.company}?`)) {
      deleteJob(job.id);
      onDelete(job.id);
    }
  };

  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
            shadow-sm hover:shadow-md transition-shadow duration-200
            ${snapshot.isDragging ? 'shadow-lg bg-blue-50 dark:bg-blue-900' : ''}
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {job.position}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.company}
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="ml-2 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
              aria-label="Delete job"
            >
              ✕
            </button>
          </div>

          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              View Post →
            </a>
          )}

          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
}

'use client';

import { useState } from 'react';
import { addJob } from '@/app/lib/storage';

interface AddJobFormProps {
  onJobAdded: () => void;
}

export default function AddJobForm({ onJobAdded }: AddJobFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim() || !position.trim()) {
      alert('Please fill in company and position');
      return;
    }

    setIsSubmitting(true);
    try {
      addJob(company, position, link);
      setCompany('');
      setPosition('');
      setLink('');
      setIsOpen(false);
      onJobAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white
          font-semibold rounded-lg hover:shadow-lg transition-shadow duration-200"
      >
        {isOpen ? '✕ Close' : '+ Add Job'}
      </button>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200
            dark:border-gray-700 shadow-lg space-y-4"
        >
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Apple, Microsoft"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Position *
            </label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., Senior Frontend Engineer"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Link (Optional)
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/jobs/123"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold
              rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50
              disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? 'Adding...' : 'Add Job'}
          </button>
        </form>
      )}
    </>
  );
}

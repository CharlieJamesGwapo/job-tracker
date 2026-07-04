export interface Job {
  id: string;
  company: string;
  position: string;
  link: string;
  status: 'wishlist' | 'applied' | 'interview' | 'rejected';
  createdAt: string;
}

const STORAGE_KEY = 'job-tracker-jobs';

// Initialize with some sample jobs if storage is empty
function initializeStorage() {
  if (typeof window === 'undefined') return;

  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const sampleJobs: Job[] = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleJobs));
  }
}

export function getAllJobs(): Job[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getJobsByStatus(status: Job['status']): Job[] {
  const allJobs = getAllJobs();
  return allJobs.filter(job => job.status === status);
}

export function addJob(company: string, position: string, link: string): Job {
  const jobs = getAllJobs();

  const newJob: Job = {
    id: `job-${Date.now()}`,
    company,
    position,
    link,
    status: 'wishlist',
    createdAt: new Date().toISOString(),
  };

  jobs.push(newJob);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));

  return newJob;
}

export function updateJobStatus(jobId: string, newStatus: Job['status']): void {
  const jobs = getAllJobs();
  const job = jobs.find(j => j.id === jobId);

  if (job) {
    job.status = newStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }
}

export function updateJobOrder(sourceStatus: Job['status'], destStatus: Job['status'], sourceIndex: number, destIndex: number, draggedJobId: string): void {
  const jobs = getAllJobs();

  // Find the job being dragged
  const draggedJob = jobs.find(j => j.id === draggedJobId);
  if (!draggedJob) return;

  // Remove from source
  const sourceJobs = jobs.filter(j => j.status === sourceStatus);
  const destJobs = jobs.filter(j => j.status === destStatus);

  // Update status
  draggedJob.status = destStatus;

  // Reorder if needed
  if (sourceStatus === destStatus) {
    sourceJobs.splice(sourceIndex, 1);
    sourceJobs.splice(destIndex, 0, draggedJob);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function deleteJob(jobId: string): void {
  const jobs = getAllJobs();
  const filtered = jobs.filter(job => job.id !== jobId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function searchJobs(query: string): Job[] {
  const allJobs = getAllJobs();
  const lowerQuery = query.toLowerCase();

  return allJobs.filter(job =>
    job.company.toLowerCase().includes(lowerQuery) ||
    job.position.toLowerCase().includes(lowerQuery)
  );
}

// Initialize on import
if (typeof window !== 'undefined') {
  initializeStorage();
}

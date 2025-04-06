import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobDescription, JobApplication, Candidate } from '@/types';
import { jobsCache, applicationsCache } from '@/services/cacheService';

// Function to fetch all jobs
export const fetchJobs = async (): Promise<JobDescription[]> => {
  // First try to get from cache
  const cachedJobs = jobsCache.get();
  if (cachedJobs) {
    console.log('Using cached jobs data');
    return cachedJobs;
  }

  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }

  // Map the raw data to our JobDescription type with proper type casting
  const jobs = data.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    department: job.department,
    location: job.location,
    employmentType: job.employment_type as "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote",
    responsibilities: job.responsibilities,
    qualifications: job.qualifications,
    skillsRequired: job.skills_required,
    experienceLevel: job.experience_level,
    salaryRange: {
      min: job.salary_min,
      max: job.salary_max,
      currency: job.salary_currency,
    },
    deadline: job.deadline,
    status: job.status as "active" | "closed" | "draft" | "processing" | "error",
    createdAt: job.created_at,
    updatedAt: job.updated_at,
    summary: job.summary,
    externalId: job.external_id,
    requestData: job.request_data
  }));

  // Cache the results
  jobsCache.set(jobs);
  
  return jobs;
};

// Function to fetch jobs with sorting
export const fetchJobsSorted = async (sortBy: string = 'newest'): Promise<JobDescription[]> => {
  let jobs = await fetchJobs();
  
  switch (sortBy) {
    case 'oldest':
      return jobs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'most-applications':
      // This would ideally be handled on the server side for efficiency
      // For now we'll fetch application counts separately
      return jobs; // Will be sorted later after counts are retrieved
    case 'newest':
    default:
      return jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

// Function to fetch a specific job by ID
export const fetchJobById = async (jobId: string): Promise<JobDescription> => {
  // First try to get from cache
  const cachedJob = jobsCache.getJob(jobId);
  if (cachedJob) {
    console.log('Using cached job data for ID:', jobId);
    return cachedJob;
  }

  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    console.error(`Error fetching job with ID ${jobId}:`, error);
    throw new Error('Failed to fetch job');
  }

  const job = {
    id: data.id,
    title: data.title,
    company: data.company,
    department: data.department,
    location: data.location,
    employmentType: data.employment_type as "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote",
    responsibilities: data.responsibilities,
    qualifications: data.qualifications,
    skillsRequired: data.skills_required,
    experienceLevel: data.experience_level,
    salaryRange: {
      min: data.salary_min,
      max: data.salary_max,
      currency: data.salary_currency,
    },
    deadline: data.deadline,
    status: data.status as "active" | "closed" | "draft" | "processing" | "error",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    summary: data.summary,
    externalId: data.external_id,
    requestData: data.request_data
  };

  // Cache the job
  jobsCache.setJob(job);
  
  return job;
};

// Function to fetch user applications by email
export const fetchUserApplications = async (userEmail: string): Promise<JobApplication[]> => {
  if (!userEmail) return [];
  
  // Try to get from cache
  const cachedApplications = applicationsCache.get();
  if (cachedApplications) {
    return cachedApplications.filter(app => app.candidate?.email === userEmail);
  }
  
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      job_descriptions:job_id(*)
    `)
    .eq('candidate_email', userEmail);
    
  if (error) {
    console.error('Error fetching user applications:', error);
    throw new Error('Failed to fetch applications');
  }
  
  // Map the Supabase data structure to our JobApplication type
  const mappedApplications: JobApplication[] = data.map(app => ({
    id: app.id,
    jobId: app.job_id,
    candidate: {
      id: app.id, // Using application ID as candidate ID
      name: app.candidate_name,
      email: app.candidate_email,
      phone: app.candidate_phone,
      resumeUrl: app.resume_url,
      coverLetter: app.cover_letter || undefined,
      skills: app.skills || [],
    },
    appliedAt: app.applied_at,
    status: app.status as 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired' | 'processing',
    matchScore: app.match_score,
    notes: app.notes,
    summary: app.summary,
    externalId: app.external_id,
  }));
  
  // Cache the results
  applicationsCache.set(mappedApplications);
  
  return mappedApplications;
};

// Function to fetch applications count for a job
export const fetchApplicationsCount = async (jobId?: string) => {
  let query = supabase.from('job_applications').select('*', { count: 'exact' });
  
  if (jobId) {
    query = query.eq('job_id', jobId);
  }
  
  const { count, error } = await query;
  
  if (error) {
    console.error('Error fetching applications count:', error);
    return 0;
  }
  
  return count || 0;
};

// Function to fetch application counts for all jobs
export const fetchAllJobsApplicationsCounts = async (): Promise<Record<string, number>> => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('job_id');
    
  if (error) {
    console.error('Error fetching application counts:', error);
    return {};
  }
  
  const counts: Record<string, number> = {};
  data.forEach(app => {
    if (!counts[app.job_id]) {
      counts[app.job_id] = 0;
    }
    counts[app.job_id]++;
  });
  
  return counts;
};

// Custom hook that uses React Query to fetch all jobs with optional sorting
export function useJobs(sortBy?: string) {
  return useQuery({
    queryKey: ['jobs', sortBy],
    queryFn: () => sortBy ? fetchJobsSorted(sortBy) : fetchJobs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook that uses React Query to fetch a specific job by ID
export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobById(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook for job details page
export function useJobById(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobById(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook to fetch user applications by email
export function useUserApplications(userEmail: string) {
  return useQuery({
    queryKey: ['applications', userEmail],
    queryFn: () => fetchUserApplications(userEmail),
    enabled: !!userEmail,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook to fetch applications count
export function useApplicationsCount(jobId?: string) {
  return useQuery({
    queryKey: ['applications-count', jobId],
    queryFn: () => fetchApplicationsCount(jobId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook to fetch job application counts for all jobs
export function useAllJobsApplicationsCounts() {
  return useQuery({
    queryKey: ['all-applications-counts'],
    queryFn: fetchAllJobsApplicationsCounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

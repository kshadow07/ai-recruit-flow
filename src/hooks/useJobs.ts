
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobDescription } from '@/types';

// Function to fetch all jobs
export const fetchJobs = async (): Promise<JobDescription[]> => {
  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }

  // Map the raw data to our JobDescription type
  return data.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    department: job.department,
    location: job.location,
    employmentType: job.employment_type,
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
};

// Function to fetch a specific job by ID
export const fetchJobById = async (jobId: string): Promise<JobDescription> => {
  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    console.error(`Error fetching job with ID ${jobId}:`, error);
    throw new Error('Failed to fetch job');
  }

  return {
    id: data.id,
    title: data.title,
    company: data.company,
    department: data.department,
    location: data.location,
    employmentType: data.employment_type,
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
};

// Custom hook that uses React Query to fetch all jobs
export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs
  });
}

// Custom hook that uses React Query to fetch a specific job by ID
export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobById(jobId),
    enabled: !!jobId,
  });
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobDescription } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_descriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching jobs: ${error.message}`);
      }

      // Transform data to match our JobDescription type
      const formattedJobs: JobDescription[] = data.map(job => ({
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
        status: job.status,
        createdAt: job.created_at,
        updatedAt: job.updated_at,
        summary: job.summary || undefined,
        externalId: job.external_id || undefined,
        requestData: job.request_data
      }));

      return formattedJobs;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJobById = (jobId?: string) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      if (!jobId) return null;

      const { data, error } = await supabase
        .from('job_descriptions')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        throw new Error(`Error fetching job: ${error.message}`);
      }

      // Transform data to match our JobDescription type
      const formattedJob: JobDescription = {
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
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        summary: data.summary || undefined,
        externalId: data.external_id || undefined,
        requestData: data.request_data
      };

      return formattedJob;
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useApplicationsCount = (jobId?: string) => {
  return useQuery({
    queryKey: ['applications-count', jobId],
    queryFn: async () => {
      let query = supabase.from('job_applications').select('id', { count: 'exact' });
      
      if (jobId) {
        query = query.eq('job_id', jobId);
      }
      
      const { count, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return count || 0;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useApplications = (jobId?: string) => {
  return useQuery({
    queryKey: ['applications', jobId],
    queryFn: async () => {
      let query = supabase.from('job_applications').select('*');
      
      if (jobId) {
        query = query.eq('job_id', jobId);
      }
      
      const { data, error } = await query.order('applied_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      status 
    }: { 
      applicationId: string; 
      status: string;
    }) => {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', data.job_id] });
      
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${data.status}.`
      });
    },
    onError: (error) => {
      console.error("Error updating application:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update application status. Please try again."
      });
    }
  });
};

export const useUserApplications = (userEmail: string) => {
  return useQuery({
    queryKey: ['user-applications', userEmail],
    queryFn: async () => {
      if (!userEmail) return [];

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_descriptions:job_id (
            id,
            title,
            company,
            location,
            department,
            deadline
          )
        `)
        .eq('candidate_email', userEmail)
        .order('applied_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
    enabled: !!userEmail,
    staleTime: 60 * 1000, // 1 minute
  });
};

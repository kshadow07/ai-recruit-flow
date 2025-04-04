import { mockDataService } from './mockData';
import { JobDescription, JobApplication, Candidate, User } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// This service acts as a central API layer that could later be replaced with real API calls
export const api = {
  // Jobs
  getJobs: async () => {
    try {
      // First try to get from Supabase
      const { data: supabaseJobs, error } = await supabase
        .from('job_descriptions')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        // Fallback to mock data
        return await mockDataService.getJobs();
      }
      
      // Transform Supabase data to match our types
      if (supabaseJobs && supabaseJobs.length > 0) {
        return supabaseJobs.map(mapSupabaseJobToJobDescription);
      }
      
      // If no data in Supabase yet, get from mock data
      return await mockDataService.getJobs();
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },
  
  getActiveJobs: async () => {
    try {
      // First try to get from Supabase
      const { data: supabaseJobs, error } = await supabase
        .from('job_descriptions')
        .select('*')
        .eq('status', 'active');
      
      if (error) {
        console.error('Supabase error:', error);
        // Fallback to mock data
        return await mockDataService.getActiveJobs();
      }
      
      // Transform Supabase data to match our types
      if (supabaseJobs && supabaseJobs.length > 0) {
        return supabaseJobs.map(mapSupabaseJobToJobDescription);
      }
      
      // If no data in Supabase yet, get from mock data
      return await mockDataService.getActiveJobs();
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },
  
  getJobById: async (id: string) => {
    try {
      // First try to get from Supabase
      const { data: supabaseJob, error } = await supabase
        .from('job_descriptions')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Supabase error:', error);
        // Fallback to mock data
        return await mockDataService.getJobById(id);
      }
      
      // Transform Supabase data to match our types
      if (supabaseJob) {
        return mapSupabaseJobToJobDescription(supabaseJob);
      }
      
      // If no data in Supabase, get from mock data
      return await mockDataService.getJobById(id);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  processJobWithExternalApi: async (jobData: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/process-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Log the complete response from the backend API
      console.log('Backend API Response:', responseData);
      
      return responseData;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  createJob: async (job: Omit<JobDescription, "id" | "createdAt" | "updatedAt" | "status" | "summary">) => {
    try {
      // Format job data for API
      const formattedJobData = {
        jobTitle: job.title,
        department: job.department,
        employmentType: job.employmentType,
        minimumSalary: job.salaryRange.min,
        maximumSalary: job.salaryRange.max,
        requiredSkills: job.skillsRequired.join(', '),
        applicationDeadline: new Date(job.deadline).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        jobResponsibilities: job.responsibilities,
        qualifications: job.qualifications,
        company: job.company,
        location: job.location,
        experienceLevel: job.experienceLevel
      };

      // Immediately save to Supabase with processing status
      const { data: initialJob, error: initialError } = await supabase
        .from('job_descriptions')
        .insert({
          title: job.title,
          company: job.company,
          department: job.department,
          location: job.location,
          employment_type: job.employmentType,
          responsibilities: job.responsibilities,
          qualifications: job.qualifications,
          skills_required: job.skillsRequired,
          experience_level: job.experienceLevel,
          salary_min: job.salaryRange.min,
          salary_max: job.salaryRange.max,
          salary_currency: job.salaryRange.currency,
          deadline: new Date(job.deadline).toISOString(),
          status: 'processing', // Set initial status as processing
          request_data: formattedJobData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (initialError) throw initialError;

      // Show immediate feedback
      toast({
        title: "Job Created",
        description: "Job posting created. Processing details...",
        variant: "default",
      });

      // Process with external API in the background
      const processInBackground = async () => {
        try {
          console.log('Processing job with external API...');
          const apiResponse = await api.processJobWithExternalApi(formattedJobData);
          console.log('Received API response:', apiResponse);

          // Update job with AI-generated data
          const { data: updatedJob, error: updateError } = await supabase
            .from('job_descriptions')
            .update({
              external_id: apiResponse.id,
              summary: apiResponse.summary,
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', initialJob.id)
            .select()
            .single();

          if (updateError) throw updateError;

          console.log('Job updated with AI data:', updatedJob);
          toast({
            title: "Processing Complete",
            description: "Job details have been processed and updated.",
            variant: "default",
          });

          return mapSupabaseJobToJobDescription(updatedJob);
        } catch (error) {
          console.error('Background processing error:', error);
          // Update status to error if processing fails
          await supabase
            .from('job_descriptions')
            .update({
              status: 'error',
              updated_at: new Date().toISOString()
            })
            .eq('id', initialJob.id);

          toast({
            title: "Processing Error",
            description: "Job was created but processing failed. Please try again later.",
            variant: "destructive",
          });
        }
      };

      // Start background processing
      processInBackground();

      // Return initial job immediately
      return mapSupabaseJobToJobDescription(initialJob);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  updateJob: async (id: string, updates: Partial<JobDescription>) => {
    try {
      // Update in mock data for backward compatibility
      const updatedMockJob = await mockDataService.updateJob(id, updates);
      
      // Prepare data for Supabase update
      const supabaseUpdates: any = {};
      
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.company) supabaseUpdates.company = updates.company;
      if (updates.department) supabaseUpdates.department = updates.department;
      if (updates.location) supabaseUpdates.location = updates.location;
      if (updates.employmentType) supabaseUpdates.employment_type = updates.employmentType;
      if (updates.responsibilities) supabaseUpdates.responsibilities = updates.responsibilities;
      if (updates.qualifications) supabaseUpdates.qualifications = updates.qualifications;
      if (updates.skillsRequired) supabaseUpdates.skills_required = updates.skillsRequired;
      if (updates.experienceLevel) supabaseUpdates.experience_level = updates.experienceLevel;
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.summary) supabaseUpdates.summary = updates.summary;
      if (updates.externalId) supabaseUpdates.external_id = updates.externalId;
      if (updates.requestData) supabaseUpdates.request_data = updates.requestData;
      
      if (updates.salaryRange) {
        supabaseUpdates.salary_min = updates.salaryRange.min;
        supabaseUpdates.salary_max = updates.salaryRange.max;
        supabaseUpdates.salary_currency = updates.salaryRange.currency;
      }
      
      if (updates.deadline) {
        supabaseUpdates.deadline = new Date(updates.deadline).toISOString();
      }
      
      // Always update the updated_at field
      supabaseUpdates.updated_at = new Date().toISOString();
      
      // Update in Supabase
      const { data: supabaseJob, error } = await supabase
        .from('job_descriptions')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Error updating in Supabase:', error);
        // Continue with mock data if Supabase fails
        toast({
          title: "Job Updated",
          description: `${updatedMockJob.title} has been successfully updated (mock data only).`,
          variant: "default",
        });
        return updatedMockJob;
      }
      
      toast({
        title: "Job Updated",
        description: `${supabaseJob ? supabaseJob.title : 'Job'} has been successfully updated in Supabase.`,
        variant: "default",
      });
      
      return supabaseJob ? mapSupabaseJobToJobDescription(supabaseJob) : updatedMockJob;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  deleteJob: async (id: string) => {
    try {
      // Delete from mock data for backward compatibility
      await mockDataService.deleteJob(id);
      
      // Delete from Supabase
      const { error } = await supabase
        .from('job_descriptions')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting from Supabase:', error);
        toast({
          title: "Job Deleted",
          description: "The job has been deleted from mock data only.",
          variant: "default",
        });
        return { success: true };
      }
      
      toast({
        title: "Job Deleted",
        description: "The job has been successfully deleted from Supabase.",
        variant: "default",
      });
      
      return { success: true };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Applications
  getApplications: async (jobId?: string) => {
    try {
      return await mockDataService.getApplications(jobId);
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },
  
  getApplicationById: async (id: string) => {
    try {
      return await mockDataService.getApplicationById(id);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  submitApplication: async (jobId: string, candidate: Omit<Candidate, "id">) => {
    try {
      const newApplication = await mockDataService.createApplication(jobId, candidate);
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
        variant: "default",
      });
      return newApplication;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  updateApplicationStatus: async (id: string, status: JobApplication['status'], notes?: string) => {
    try {
      const updatedApplication = await mockDataService.updateApplicationStatus(id, status, notes);
      toast({
        title: "Application Updated",
        description: `Application status changed to ${status}.`,
        variant: "default",
      });
      return updatedApplication;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Users
  getCurrentUser: async () => {
    try {
      return await mockDataService.getCurrentUser();
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }
};

// Helper for error handling
function handleApiError(error: any) {
  console.error('API Error:', error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}

// Helper function to map Supabase job format to our JobDescription type
function mapSupabaseJobToJobDescription(supabaseJob: any): JobDescription {
  return {
    id: supabaseJob.id,
    title: supabaseJob.title,
    company: supabaseJob.company,
    department: supabaseJob.department,
    location: supabaseJob.location,
    employmentType: supabaseJob.employment_type as any, // Type casting to match our enum
    responsibilities: supabaseJob.responsibilities,
    qualifications: supabaseJob.qualifications,
    skillsRequired: supabaseJob.skills_required,
    experienceLevel: supabaseJob.experience_level,
    salaryRange: {
      min: supabaseJob.salary_min,
      max: supabaseJob.salary_max,
      currency: supabaseJob.salary_currency,
    },
    deadline: supabaseJob.deadline,
    status: supabaseJob.status as any, // Type casting to match our enum
    createdAt: supabaseJob.created_at,
    updatedAt: supabaseJob.updated_at,
    summary: supabaseJob.summary,
    externalId: supabaseJob.external_id,
    requestData: supabaseJob.request_data,
  };
}

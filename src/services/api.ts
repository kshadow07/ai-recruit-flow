
import { mockDataService } from './mockData';
import { JobDescription, JobApplication, Candidate, User } from '@/types';
import { toast } from '@/components/ui/use-toast';

// This service acts as a central API layer that could later be replaced with real API calls
export const api = {
  // Jobs
  getJobs: async () => {
    try {
      return await mockDataService.getJobs();
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },
  
  getActiveJobs: async () => {
    try {
      return await mockDataService.getActiveJobs();
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },
  
  getJobById: async (id: string) => {
    try {
      return await mockDataService.getJobById(id);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  createJob: async (job: Omit<JobDescription, "id" | "createdAt" | "updatedAt" | "status" | "summary">) => {
    try {
      const newJob = await mockDataService.createJob(job);
      toast({
        title: "Job Created",
        description: `${job.title} has been successfully created.`,
        variant: "default",
      });
      return newJob;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  updateJob: async (id: string, updates: Partial<JobDescription>) => {
    try {
      const updatedJob = await mockDataService.updateJob(id, updates);
      toast({
        title: "Job Updated",
        description: `${updatedJob.title} has been successfully updated.`,
        variant: "default",
      });
      return updatedJob;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  deleteJob: async (id: string) => {
    try {
      await mockDataService.deleteJob(id);
      toast({
        title: "Job Deleted",
        description: "The job has been successfully deleted.",
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

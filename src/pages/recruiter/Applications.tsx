
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FilterIcon, 
  ArrowLeft, 
  UserIcon,
  MailIcon,
  PhoneIcon,
  FileTextIcon,
  CheckIcon,
  XIcon,
  AlertTriangleIcon,
  BuildingIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import ApplicationItem from "@/components/applications/ApplicationItem";
import { api } from "@/services/api";
import { JobApplication, JobDescription } from "@/types";
import { formatDate, formatTimeFromNow } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { applicationsCache } from "@/services/cacheService";

const HIGH_MATCH_SCORE = 80; // The threshold for high match scores

const Applications = () => {
  const { jobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>(jobId || "all");
  const [job, setJob] = useState<JobDescription | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("job_descriptions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching jobs:", error);
          return [];
        }

        const jobsData: JobDescription[] = data.map(job => ({
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

        setJobs(jobsData);
        return jobsData;
      } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
      }
    };
    
    fetchJobs();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to get from cache first
        const cachedApplications = applicationsCache.get();
        
        if (jobId) {
          const jobData = await api.getJobById(jobId);
          setJob(jobData);
          setSelectedJob(jobId);
          
          // If we have cached data and it's for this job, use it
          if (cachedApplications && jobId) {
            const jobSpecificApps = cachedApplications.filter(app => app.jobId === jobId);
            if (jobSpecificApps.length > 0) {
              setApplications(jobSpecificApps);
              if (jobSpecificApps.length > 0) {
                setSelectedApplication(jobSpecificApps[0]);
              }
              setLoading(false);
              return;
            }
          }
        }
        
        // If we reach here, we need to fetch from Supabase
        let query = supabase.from('job_applications').select('*');
        
        if (jobId) {
          query = query.eq('job_id', jobId);
        } else if (selectedJob !== "all") {
          query = query.eq('job_id', selectedJob);
        }
        
        const { data: applicationsData, error } = await query;
        
        if (error) {
          console.error("Error fetching applications from Supabase:", error);
          toast({
            variant: "destructive",
            title: "Error fetching applications",
            description: "Please try again later."
          });
          
          const apiApplications = await api.getApplications(jobId);
          
          if (apiApplications && apiApplications.length > 0) {
            const formattedApplications = apiApplications.map(app => ({
              ...app,
            }));
            setApplications(formattedApplications);
            setSelectedApplication(formattedApplications[0]);
          }
        } else if (applicationsData) {
          const formattedApplications: JobApplication[] = applicationsData.map(app => ({
            id: app.id,
            jobId: app.job_id,
            appliedAt: app.applied_at,
            status: app.status as JobApplication['status'],
            matchScore: app.match_score !== null ? app.match_score : undefined,
            notes: app.notes || undefined,
            summary: app.summary || undefined,
            externalId: app.external_id || undefined,
            candidate: {
              id: app.id,
              name: app.candidate_name,
              email: app.candidate_email,
              phone: app.candidate_phone,
              resumeUrl: app.resume_url,
              coverLetter: app.cover_letter || undefined,
              skills: app.skills || []
            }
          }));
          
          // Cache the applications
          applicationsCache.set(formattedApplications);
          
          setApplications(formattedApplications);
          
          if (formattedApplications.length > 0) {
            setSelectedApplication(formattedApplications[0]);
          } else {
            setSelectedApplication(null);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load applications. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    const channel = supabase
      .channel('applications-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'job_applications',
          filter: jobId ? `job_id=eq.${jobId}` : selectedJob !== "all" ? `job_id=eq.${selectedJob}` : undefined
        }, 
        () => {
          // Invalidate cache on realtime updates
          applicationsCache.clear();
          fetchData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, selectedJob]);
  
  const handleApplicationSelect = (application: JobApplication) => {
    setSelectedApplication(application);
  };
  
  const handleJobFilterChange = (value: string) => {
    setSelectedJob(value);
    if (value !== "all") {
      const selectedJobData = jobs.find(j => j.id === value);
      if (selectedJobData) {
        setJob(selectedJobData);
      }
    } else {
      setJob(null);
    }
  };
  
  const sendNotificationEmail = async (application: JobApplication, status: string) => {
    try {
      setUpdatingStatus(true); // Start loading to prevent multiple clicks
      
      const jobDetails = jobs.find(j => j.id === application.jobId);
      
      if (!jobDetails) {
        console.error("Could not find job details for email notification");
        return;
      }
      
      // Send the email notification via edge function
      console.log("Sending email notification...");
      const { data, error } = await supabase.functions.invoke('send-application-email', {
        body: {
          candidate: application.candidate,
          status: status,
          jobTitle: jobDetails.title,
          company: jobDetails.company
        }
      });
      
      if (error) {
        console.error("Error sending email notification:", error);
        toast({
          variant: "destructive",
          title: "Email Notification Failed",
          description: "The application status was updated but we couldn't send the email notification."
        });
        return false;
      }
      
      console.log("Email notification sent successfully:", data);
      return true;
    } catch (error) {
      console.error("Error sending email notification:", error);
      return false;
    }
  };
  
  const handleStatusChange = async (status: JobApplication["status"]) => {
    if (!selectedApplication) return;
    
    setUpdatingStatus(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', selectedApplication.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      try {
        await api.updateApplicationStatus(selectedApplication.id, status);
      } catch (apiError) {
        console.error("API update failed, but Supabase update succeeded:", apiError);
      }
      
      const updatedApplication = {
        ...selectedApplication,
        status
      };
      
      setApplications(applications.map(app => 
        app.id === updatedApplication.id ? updatedApplication : app
      ));
      setSelectedApplication(updatedApplication);
      
      // Send email notification
      if (status === "shortlisted" || status === "rejected" || status === "hired") {
        await sendNotificationEmail(updatedApplication, status);
      }
      
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${status}.`
      });
      
      // Clear cache to ensure data is fresh on next load
      applicationsCache.clear();
      
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update application status. Please try again."
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  const getStatusColor = (status: JobApplication["status"]) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  useEffect(() => {
    const checkHighMatchScores = async () => {
      for (const app of applications) {
        if (
          app.matchScore && 
          app.matchScore >= HIGH_MATCH_SCORE && 
          app.status === "pending"
        ) {
          console.log("High match score detected:", app.matchScore);
          
          await sendNotificationEmail(app, "high_match");
          
          try {
            await supabase
              .from('job_applications')
              .update({ status: "reviewing" })
              .eq('id', app.id);
              
            setApplications(prev => 
              prev.map(a => a.id === app.id ? { ...a, status: "reviewing" as JobApplication["status"] } : a)
            );
            
            if (selectedApplication && selectedApplication.id === app.id) {
              setSelectedApplication({ ...selectedApplication, status: "reviewing" });
            }
            
            toast({
              title: "High match detected",
              description: `${app.candidate.name}'s application has a high match score of ${app.matchScore}%`
            });
          } catch (error) {
            console.error("Error updating high match application:", error);
          }
        }
      }
    };
    
    checkHighMatchScores();
  }, [applications]);
  
  const filteredApplications = applications.filter(app => {
    if (filter !== "all" && app.status !== filter) {
      return false;
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const nameMatch = app.candidate.name.toLowerCase().includes(term);
      const skillsMatch = app.candidate.skills.some(skill => 
        skill.toLowerCase().includes(term)
      );
      return nameMatch || skillsMatch;
    }
    
    return true;
  });
  
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    return (b.matchScore || 0) - (a.matchScore || 0);
  });
  
  return (
    <RecruiterLayout title={job ? `Applications for ${job.title}` : "All Applications"}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(jobId ? `/recruiter/job/${jobId}` : "/recruiter")}
          className="mb-4 w-fit sm:mb-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {jobId ? "Back to Job Details" : "Back to Dashboard"}
        </Button>
        
        {!loading && (
          <div className="text-muted-foreground text-sm">
            Showing {sortedApplications.length} {sortedApplications.length === 1 ? "application" : "applications"}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <FilterIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Filters</span>
                </div>
                
                {!jobId && jobs.length > 0 && (
                  <div className="mb-3">
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Filter by Job
                    </label>
                    <Select 
                      value={selectedJob} 
                      onValueChange={handleJobFilterChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Jobs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Filter by Status
                  </label>
                  <Select 
                    value={filter} 
                    onValueChange={setFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Applications</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Search Candidates
                  </label>
                  <Input 
                    placeholder="Search candidates..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingAnimation size="md" text="Loading applications..." />
              </div>
            ) : sortedApplications.length > 0 ? (
              sortedApplications.map((application) => (
                <ApplicationItem 
                  key={application.id} 
                  application={application}
                  selected={selectedApplication?.id === application.id}
                  onSelect={handleApplicationSelect}
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <AlertTriangleIcon className="w-8 h-8 mb-2" />
                    <p>No applications found</p>
                    {searchTerm && (
                      <Button 
                        variant="ghost" 
                        className="mt-2" 
                        onClick={() => setSearchTerm("")}
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedApplication ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedApplication.candidate.name}</CardTitle>
                    {job && <CardDescription>{job.title}</CardDescription>}
                  </div>
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Match Score</span>
                      <span className="font-medium">
                        {selectedApplication.status === "processing" 
                          ? "Processing..." 
                          : `${selectedApplication.matchScore || 0}%`}
                      </span>
                    </div>
                    <Progress 
                      value={selectedApplication.status === "processing" ? 0 : (selectedApplication.matchScore || 0)}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MailIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedApplication.candidate.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedApplication.candidate.phone}</span>
                    </div>
                  </div>
                  
                  {!job && selectedApplication.jobId && (
                    <div className="flex items-center space-x-2 pb-2">
                      <BuildingIcon className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {jobs.find(j => j.id === selectedApplication.jobId)?.title || "Unknown Position"}
                      </span>
                    </div>
                  )}
                  
                  {selectedApplication.candidate.coverLetter && (
                    <div>
                      <h3 className="font-medium mb-2">Cover Letter</h3>
                      <div className="bg-muted p-4 rounded-md text-sm">
                        {selectedApplication.candidate.coverLetter}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Resume</h3>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={() => window.open(selectedApplication.candidate.resumeUrl)}
                    >
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Application Details</h3>
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Applied:</span>
                        <span>{formatTimeFromNow(selectedApplication.appliedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application Status:</span>
                        <span className="capitalize">{selectedApplication.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedApplication.notes && (
                    <div>
                      <h3 className="font-medium mb-2">Recruiter Notes</h3>
                      <div className="bg-muted p-4 rounded-md text-sm">
                        {selectedApplication.notes}
                      </div>
                    </div>
                  )}
                  
                  {selectedApplication.summary && (
                    <div>
                      <h3 className="font-medium mb-2">AI Resume Summary</h3>
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-sm text-blue-900">
                        {selectedApplication.summary}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <Separator />
              
              <CardFooter className="pt-6">
                <div className="w-full">
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedApplication.status === "reviewing" || updatingStatus || selectedApplication.status === "processing"}
                      onClick={() => handleStatusChange("reviewing")}
                      className={selectedApplication.status === "reviewing" ? "bg-blue-100 text-blue-800" : ""}
                    >
                      Reviewing
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedApplication.status === "shortlisted" || updatingStatus || selectedApplication.status === "processing"}
                      onClick={() => handleStatusChange("shortlisted")}
                      className={selectedApplication.status === "shortlisted" ? "bg-green-100 text-green-800" : ""}
                    >
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Shortlist
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedApplication.status === "rejected" || updatingStatus || selectedApplication.status === "processing"}
                      onClick={() => handleStatusChange("rejected")}
                      className={selectedApplication.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                    >
                      <XIcon className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedApplication.status === "hired" || updatingStatus || selectedApplication.status === "processing"}
                      onClick={() => handleStatusChange("hired")}
                      className={selectedApplication.status === "hired" ? "bg-purple-100 text-purple-800" : ""}
                    >
                      Hire
                    </Button>
                    
                    {(updatingStatus || selectedApplication.status === "processing") && (
                      <div className="flex items-center ml-2 text-yellow-600">
                        <LoadingAnimation size="sm" className="mr-2" />
                        {updatingStatus ? "Updating status..." : "Processing application..."}
                      </div>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No Application Selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select an application from the list to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default Applications;

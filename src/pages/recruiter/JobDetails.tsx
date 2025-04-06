import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeftIcon, 
  EditIcon, 
  Briefcase, 
  Building, 
  MapPin, 
  Calendar, 
  Clock,
  ListChecks,
  GraduationCap,
  Lightbulb,
  DollarSign,
  AlertTriangleIcon,
  Loader2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { api } from "@/services/api";
import { JobDescription } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useJobById, useApplicationsCount } from "@/hooks/useJobs";

const JobDetails = () => {
  const { jobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: fetchedJob, isLoading: isJobLoading, isError: isJobError } = useJobById(jobId || "");
  const { data: applicationsCount, isLoading: isApplicationsCountLoading } = useApplicationsCount(jobId);
  
  useEffect(() => {
    if (fetchedJob) {
      setJob(fetchedJob);
    }
  }, [fetchedJob]);
  
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        const jobData = await api.getJobById(jobId);
        setJob(jobData);
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load job details. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (!fetchedJob && jobId) {
      fetchJob();
    }
  }, [jobId, fetchedJob, toast]);
  
  if (isJobLoading) {
    return (
      <RecruiterLayout title="Loading Job Details">
        <div className="container mx-auto max-w-4xl p-4">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </RecruiterLayout>
    );
  }
  
  if (isJobError) {
    return (
      <RecruiterLayout title="Error Loading Job">
        <div className="container mx-auto max-w-4xl p-4">
          <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-center text-red-500">Failed to load job details.</p>
        </div>
      </RecruiterLayout>
    );
  }
  
  if (!job) {
    return (
      <RecruiterLayout title="Job Not Found">
        <div className="container mx-auto max-w-4xl p-4">
          <AlertTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-center text-yellow-500">Job not found.</p>
        </div>
      </RecruiterLayout>
    );
  }
  
  return (
    <RecruiterLayout title={job.title}>
      <div className="container mx-auto max-w-5xl p-4">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/recruiter")}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate(`/recruiter/job/edit/${job.id}`)}
          >
            <EditIcon className="w-4 h-4 mr-2" />
            Edit Job
          </Button>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <div className="text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {job.company}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isApplicationsCountLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <Badge>
                    {applicationsCount} Applications
                  </Badge>
                )}
                <Badge variant="secondary">{job.status}</Badge>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Job Overview</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{job.employmentType}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Published on {formatDate(job.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Deadline: {formatDate(job.deadline)}</span>
                  </div>
                  <div className="flex items-center">
                    <ListChecks className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Experience: {job.experienceLevel}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Department: {job.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Skills: {job.skillsRequired.join(", ")}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>
                      Salary: {formatCurrency(job.salaryRange.min)} - {formatCurrency(job.salaryRange.max)} {job.salaryRange.currency}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Job Summary</h2>
                <p className="text-muted-foreground">
                  {job.summary || "No summary available."}
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
              <p className="text-muted-foreground">
                {job.responsibilities || "No responsibilities listed."}
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Qualifications</h2>
              <p className="text-muted-foreground">
                {job.qualifications || "No qualifications listed."}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Button onClick={() => navigate(`/recruiter/applications/${job.id}`)}>
          View Applications
        </Button>
      </div>
    </RecruiterLayout>
  );
};

export default JobDetails;


import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  CalendarIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  ClockIcon, 
  UsersIcon,
  PencilIcon,
  TrashIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  LoaderIcon
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatSalary } from "@/utils/formatters";
import { JobDescription } from "@/types";
import { api } from "@/services/api";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationCount, setApplicationCount] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (!id) return;
        
        const jobData = await api.getJobById(id);
        setJob(jobData);
        
        // Fetch applications count directly from Supabase for real-time data
        const { count, error } = await supabase
          .from('job_applications')
          .select('id', { count: 'exact' })
          .eq('job_id', id);
        
        if (error) {
          console.error("Error fetching application count:", error);
          return;
        }
        
        setApplicationCount(count || 0);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
    
    // Set up real-time subscription for applications
    const channel = supabase
      .channel('job-applications-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'job_applications',
          filter: `job_id=eq.${id}`
        }, 
        (payload) => {
          console.log('Application change detected:', payload);
          // Update the application count
          fetchJobDetails();
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);
  
  const handleDelete = async () => {
    try {
      if (!id) return;
      setDeleteLoading(true);
      
      // Check if there are any applications for this job
      const { count, error: countError } = await supabase
        .from('job_applications')
        .select('id', { count: 'exact' })
        .eq('job_id', id);
      
      if (countError) {
        throw new Error("Failed to check applications: " + countError.message);
      }
      
      if (count && count > 0) {
        // Delete all applications for this job first
        const { error: deleteAppsError } = await supabase
          .from('job_applications')
          .delete()
          .eq('job_id', id);
        
        if (deleteAppsError) {
          throw new Error("Failed to delete applications: " + deleteAppsError.message);
        }
      }
      
      // Now delete the job
      const { error: deleteJobError } = await supabase
        .from('job_descriptions')
        .delete()
        .eq('id', id);
      
      if (deleteJobError) {
        throw new Error("Failed to delete job: " + deleteJobError.message);
      }
      
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      
      navigate("/recruiter");
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete job. Please try again.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const handleEdit = () => {
    if (!id) return;
    navigate(`/recruiter/edit-job/${id}`);
  };
  
  if (loading) {
    return (
      <RecruiterLayout title="Job Details">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse-slow">Loading job details...</div>
        </div>
      </RecruiterLayout>
    );
  }
  
  if (!job) {
    return (
      <RecruiterLayout title="Job Details">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangleIcon className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/recruiter")}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </RecruiterLayout>
    );
  }
  
  const hasDeadlinePassed = new Date(job.deadline) < new Date();
  const deadlineText = hasDeadlinePassed
    ? "Application deadline has passed"
    : `Application deadline: ${formatDate(job.deadline)}`;
  
  return (
    <RecruiterLayout title="Job Details">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate("/recruiter")}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Badge className={hasDeadlinePassed ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
            {hasDeadlinePassed ? "Closed" : "Active"}
          </Badge>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={handleEdit}
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TrashIcon className="w-4 h-4 mr-2" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the job posting
                  and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600" disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
                <div className="text-muted-foreground">{job.company} • {job.department}</div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span>{job.location}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <BriefcaseIcon className="w-5 h-5 mr-2" />
                  <span>{job.employmentType} • {job.experienceLevel}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>{deadlineText}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {job.summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">AI-Generated Summary</h2>
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <p className="text-blue-900">{job.summary}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3">Responsibilities</h2>
                  <div className="whitespace-pre-line">{job.responsibilities}</div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-3">Qualifications</h2>
                  <div className="whitespace-pre-line">{job.qualifications}</div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-3">Salary Range</h2>
                  <p>{formatSalary(job.salaryRange)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{applicationCount}</div>
                  <p className="text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to={`/recruiter/applications/${job.id}`} className="w-full">
                <Button className="w-full">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge className={hasDeadlinePassed ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                    {hasDeadlinePassed ? "Closed" : "Active"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Closing Date:</span>
                  <span>{formatDate(job.deadline)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Created:</span>
                  <span>{formatDate(job.createdAt)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Last Updated:</span>
                  <span>{formatDate(job.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {hasDeadlinePassed ? (
                <div className="flex items-center text-red-600 w-full justify-center">
                  <AlertTriangleIcon className="w-4 h-4 mr-2" />
                  This job posting has expired
                </div>
              ) : (
                <div className="flex items-center text-green-600 w-full justify-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  This job posting is active
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default JobDetails;

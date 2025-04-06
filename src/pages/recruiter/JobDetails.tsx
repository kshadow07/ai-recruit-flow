
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft,
  Calendar,
  Users,
  Building,
  MapPin,
  Clock,
  Briefcase,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import { useJobById, useApplicationsCount } from "@/hooks/useJobs";
import { formatDate } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: job, isLoading, isError } = useJobById(id);
  const { data: applicationsCount = 0 } = useApplicationsCount(id);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!job) return;
    
    setIsDeleting(true);
    try {
      // Check if there are applications for this job
      const { count, error: countError } = await supabase
        .from('job_applications')
        .select('id', { count: 'exact' })
        .eq('job_id', job.id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        toast({
          variant: "destructive",
          title: "Cannot delete job",
          description: `This job has ${count} application(s). Close the job instead.`
        });
        setShowDeleteDialog(false);
        setIsDeleting(false);
        return;
      }
      
      const { error } = await supabase
        .from('job_descriptions')
        .delete()
        .eq('id', job.id);
      
      if (error) throw error;
      
      toast({
        title: "Job deleted",
        description: "The job has been successfully deleted."
      });
      
      navigate('/recruiter');
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete the job. Please try again."
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  const handleStatusToggle = async () => {
    if (!job) return;
    
    const newStatus = job.status === "active" ? "closed" : "active";
    
    try {
      const { error } = await supabase
        .from('job_descriptions')
        .update({ status: newStatus })
        .eq('id', job.id);
      
      if (error) throw error;
      
      toast({
        title: `Job ${newStatus === "active" ? "activated" : "closed"}`,
        description: `The job has been ${newStatus === "active" ? "activated" : "closed"} successfully.`
      });
      
      // Force refetch the job data
      navigate(0);
    } catch (error) {
      console.error("Error updating job status:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update job status. Please try again."
      });
    }
  };
  
  if (isLoading) {
    return (
      <RecruiterLayout title="Job Details">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recruit-primary"></div>
        </div>
      </RecruiterLayout>
    );
  }
  
  if (isError || !job) {
    return (
      <RecruiterLayout title="Job Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/recruiter")}>
            Back to Dashboard
          </Button>
        </div>
      </RecruiterLayout>
    );
  }
  
  return (
    <RecruiterLayout title="Job Details">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/recruiter")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{job.title}</h1>
          <div className="flex items-center gap-2">
            <Badge 
              variant={job.status === "active" ? "default" : "secondary"}
              className="capitalize"
            >
              {job.status}
            </Badge>
            <Link to={`/recruiter/edit-job/${job.id}`}>
              <Button size="sm" variant="outline" className="h-9">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            </Link>
            <Button 
              size="sm" 
              variant={job.status === "active" ? "destructive" : "default"} 
              className="h-9"
              onClick={handleStatusToggle}
            >
              {job.status === "active" ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" /> Close
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" /> Activate
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-9 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Responsibilities</h3>
                      <div className="whitespace-pre-line text-muted-foreground">
                        {job.responsibilities}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Qualifications</h3>
                      <div className="whitespace-pre-line text-muted-foreground">
                        {job.qualifications}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Applications</h2>
                <Link to={`/recruiter/applications/${job.id}`}>
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
              
              {applicationsCount === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>No applications yet</p>
                  <p className="text-sm mt-1">Applications will appear here when candidates apply</p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-bold">{applicationsCount}</p>
                    <p className="text-sm text-muted-foreground">
                      {applicationsCount === 1 ? "Application" : "Applications"} received
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Job Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Building className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Company</p>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{job.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Department</p>
                    <p className="text-muted-foreground">{job.department}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Employment Type</p>
                    <p className="text-muted-foreground">{job.employmentType}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Experience Level</p>
                    <p className="text-muted-foreground">{job.experienceLevel}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Application Deadline</p>
                    <p className="text-muted-foreground">{formatDate(job.deadline)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Preview Job</h2>
              <p className="text-sm text-muted-foreground mb-4">
                See how your job looks to candidates
              </p>
              <Link to={`/jobs/${job.id}`} target="_blank">
                <Button className="w-full" variant="outline">
                  View as Candidate
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RecruiterLayout>
  );
};

export default JobDetails;


import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  FileTextIcon, 
  ArrowLeftIcon,
  AlertTriangleIcon,
  Loader2Icon,
  MailIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import MainLayout from "@/components/layouts/MainLayout";
import { JobApplication, JobDescription } from "@/types";
import { formatDate } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";

const ApplicationStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [job, setJob] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        // Fetch application details from Supabase
        const { data: applicationData, error: applicationError } = await supabase
          .from('job_applications')
          .select('*')
          .eq('id', id)
          .single();
        
        if (applicationError) throw applicationError;
        
        if (!applicationData) {
          console.error("Application not found");
          return;
        }
        
        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from('job_descriptions')
          .select('*')
          .eq('id', applicationData.job_id)
          .single();
        
        if (jobError) throw jobError;
        
        if (!jobData) {
          console.error("Job not found");
          return;
        }
        
        // Format the application data to match our type
        const formattedApplication: JobApplication = {
          id: applicationData.id,
          jobId: applicationData.job_id,
          appliedAt: applicationData.applied_at,
          status: applicationData.status as 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired',
          matchScore: applicationData.match_score || 0,
          notes: null,
          summary: applicationData.summary,
          externalId: applicationData.external_id,
          candidate: {
            id: applicationData.id, // Using the same ID for simplicity
            name: applicationData.candidate_name,
            email: applicationData.candidate_email,
            phone: applicationData.candidate_phone,
            resumeUrl: applicationData.resume_url,
            skills: applicationData.skills,
            coverLetter: applicationData.cover_letter
          }
        };
        
        // Format the job data to match our type
        const formattedJob = {
          id: jobData.id,
          title: jobData.title,
          company: jobData.company,
          department: jobData.department,
          location: jobData.location,
          employmentType: jobData.employment_type as any,
          responsibilities: jobData.responsibilities,
          qualifications: jobData.qualifications,
          skillsRequired: jobData.skills_required,
          experienceLevel: jobData.experience_level,
          salaryRange: {
            min: jobData.salary_min,
            max: jobData.salary_max,
            currency: jobData.salary_currency,
          },
          deadline: jobData.deadline,
          status: jobData.status as any,
          createdAt: jobData.created_at,
          updatedAt: jobData.updated_at,
          summary: jobData.summary,
          externalId: jobData.external_id,
        };
        
        setApplication(formattedApplication);
        setJob(formattedJob);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Calculate match score
  const displayMatchScore = () => {
    if (!application || application.matchScore === undefined || application.matchScore === null) {
      return 0;
    }
    
    // If matchScore is already a percentage (e.g., 85 for 85%)
    if (application.matchScore >= 0 && application.matchScore <= 100) {
      return Math.round(application.matchScore);
    }
    
    // If matchScore is a decimal (e.g., 0.85 for 85%)
    if (application.matchScore >= 0 && application.matchScore <= 1) {
      return Math.round(application.matchScore * 100);
    }
    
    return 0;
  };
  
  if (loading) {
    return (
      <MainLayout title="Application Status">
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2Icon className="w-6 h-6 animate-spin mr-2" />
            <span>Loading application details...</span>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!application || !job) {
    return (
      <MainLayout title="Application Not Found">
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangleIcon className="w-12 h-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Application Not Found</h2>
            <p className="text-muted-foreground mb-4">The application you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/jobs")}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Browse Jobs
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Application Status">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/jobs")}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Application Received!</h2>
              <p className="text-center text-muted-foreground mb-4">
                Your application for <span className="font-medium text-foreground">{job.title}</span> at 
                <span className="font-medium text-foreground"> {job.company}</span> has been successfully submitted.
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>Submitted on {formatDate(application.appliedAt)}</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Application Summary</h3>
                <div className="bg-muted p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Applicant</p>
                      <p className="font-medium">{application.candidate.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{application.candidate.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Position</p>
                      <p className="font-medium">{job.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{job.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Application ID</p>
                      <p className="font-medium">{application.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{application.status}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Match Score</h3>
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Job Match</span>
                    {application.status === "processing" ? (
                      <span className="text-sm font-medium">Processing...</span>
                    ) : (
                      <span className="text-sm font-medium">{displayMatchScore()}%</span>
                    )}
                  </div>
                  {application.status === "processing" ? (
                    <Progress 
                      value={0} 
                      className="h-2 mb-4"
                    />
                  ) : (
                    <Progress 
                      value={displayMatchScore()} 
                      className="h-2 mb-4"
                    />
                  )}
                  <p className="text-sm text-muted-foreground">
                    Our AI has analyzed your skills against the job requirements and calculated a match score.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Next Steps</h3>
                <div className="bg-muted p-4 rounded-md space-y-4">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <MailIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Check Your Email</p>
                      <p className="text-sm text-muted-foreground">
                        We've sent a confirmation to {application.candidate.email}. You'll receive updates about your application status via email.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <ClockIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Application Review</p>
                      <p className="text-sm text-muted-foreground">
                        The recruiting team will review your application. This process typically takes 1-2 weeks.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <FileTextIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Interview Invitation</p>
                      <p className="text-sm text-muted-foreground">
                        If selected, you'll receive an invitation for an interview. Make sure to check your email regularly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-center pt-6 gap-4">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/jobs")}>
              Browse More Jobs
            </Button>
            <Link to={`/jobs/${job.id}`} className="w-full sm:w-auto">
              <Button className="w-full">View Job Posting</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ApplicationStatus;

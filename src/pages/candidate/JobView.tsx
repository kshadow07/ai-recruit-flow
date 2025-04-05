
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  DollarSignIcon, 
  ClockIcon,
  BuildingIcon,
  ShareIcon,
  AlertTriangleIcon,
  BookmarkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/layouts/MainLayout";
import { api } from "@/services/api";
import { JobDescription } from "@/types";
import { formatDate, formatSalary } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";

const JobView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<JobDescription[]>([]);
  const [hasApplied, setHasApplied] = useState(false);
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;
        const data = await api.getJobById(id);
        setJob(data);
        
        // Check if user has already applied for this job
        const { data: applications, error } = await supabase
          .from('job_applications')
          .select('id')
          .eq('job_id', id);
          
        if (!error && applications && applications.length > 0) {
          setHasApplied(true);
        }
        
        // Fetch similar jobs based on the same company or similar skills
        if (data) {
          const { data: similarJobsData } = await supabase
            .from('job_descriptions')
            .select('*')
            .neq('id', id)
            .eq('status', 'active')
            .or(`company.eq.${data.company},skills_required.ov.{${data.skillsRequired.slice(0, 2).join(',')}}`)
            .limit(2);
            
          if (similarJobsData) {
            // Convert to JobDescription format
            const formattedJobs: JobDescription[] = similarJobsData.map(job => ({
              id: job.id,
              title: job.title,
              company: job.company,
              department: job.department,
              location: job.location,
              employmentType: job.employment_type as any,
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
              status: job.status as any,
              createdAt: job.created_at,
              updatedAt: job.updated_at,
              summary: job.summary,
              externalId: job.external_id,
              requestData: job.request_data
            }));
            setSimilarJobs(formattedJobs);
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id]);
  
  if (loading) {
    return (
      <MainLayout title="Job Details">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse-slow">Loading job details...</div>
        </div>
      </MainLayout>
    );
  }
  
  if (!job) {
    return (
      <MainLayout title="Job Not Found">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangleIcon className="w-12 h-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/jobs")}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const hasDeadlinePassed = new Date(job.deadline) < new Date();
  
  return (
    <MainLayout title="">
      <div className="container mx-auto px-4 py-8">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-recruit-primary to-recruit-accent"></div>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
                    <Badge className={hasDeadlinePassed ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                      {hasDeadlinePassed ? "Closed" : "Active"}
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <BuildingIcon className="w-4 h-4 mr-2" />
                    <span>{job.company}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <BriefcaseIcon className="w-5 h-5 mr-2" />
                    <span>{job.employmentType} • {job.experienceLevel}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <DollarSignIcon className="w-5 h-5 mr-2" />
                    <span>{formatSalary(job.salaryRange)}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    <span>
                      {hasDeadlinePassed 
                        ? "Application closed" 
                        : `Apply before ${formatDate(job.deadline)}`}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skillsRequired.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-6">
                  {job.summary && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Job Summary</h2>
                      <p>{job.summary}</p>
                    </div>
                  )}
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
                    <div className="whitespace-pre-line">{job.responsibilities}</div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Qualifications</h2>
                    <div className="whitespace-pre-line">{job.qualifications}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Posted {formatDate(job.createdAt)}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <BookmarkIcon className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Apply Now</h2>
                  
                  <div className="text-muted-foreground flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {hasDeadlinePassed 
                      ? "Application deadline has passed" 
                      : `Application deadline: ${formatDate(job.deadline)}`}
                  </div>
                  
                  {hasDeadlinePassed ? (
                    <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm mt-4 flex items-center">
                      <AlertTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>This job posting has expired and is no longer accepting applications.</span>
                    </div>
                  ) : hasApplied ? (
                    <div className="bg-green-50 text-green-800 p-4 rounded-md text-sm mt-4 flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>You have already applied for this position.</span>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <Link to={`/apply/${job.id}`}>
                        <Button className="w-full">Apply for This Position</Button>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-2">
                        Applying is quick and easy. We'll walk you through the process.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-3">
                    <BuildingIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.company}</h3>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  A leading technology company focused on innovation and growth.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Similar Jobs</h2>
                <div className="space-y-4">
                  {similarJobs.length > 0 ? (
                    similarJobs.map(similarJob => (
                      <Link to={`/jobs/${similarJob.id}`} key={similarJob.id}>
                        <div className="border rounded-md p-3 hover:border-primary/50 transition-colors cursor-pointer">
                          <h3 className="font-medium">{similarJob.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{similarJob.company}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{similarJob.location}</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              {similarJob.employmentType}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No similar jobs found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobView;

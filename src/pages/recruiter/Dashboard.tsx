
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  PlusIcon, 
  Briefcase, 
  Building, 
  MapPin, 
  Calendar,
  Users,
  Clock,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import { api } from "@/services/api";
import { JobDescription } from "@/types";
import { formatDate, formatTimeFromNow } from "@/utils/formatters";
import { useJobs } from "@/hooks/useJobs";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    closedJobs: 0,
    nextDeadline: null as Date | null
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("job_descriptions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching jobs:", error);
          toast({
            variant: "destructive",
            title: "Error fetching jobs",
            description: "Failed to load jobs. Please try again later."
          });
          return;
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
        
        // Calculate dashboard stats
        const active = jobsData.filter(job => job.status === "active").length;
        const closed = jobsData.filter(job => job.status === "closed").length;
        
        // Get applications count
        const { count: applicationsCount } = await supabase
          .from("applications")
          .select("*", { count: "exact" });
          
        // Find next deadline
        const activeJobs = jobsData.filter(job => job.status === "active");
        const futureDeadlines = activeJobs
          .map(job => new Date(job.deadline))
          .filter(date => date > new Date())
          .sort((a, b) => a.getTime() - b.getTime());
          
        setStats({
          activeJobs: active,
          totalApplications: applicationsCount || 0,
          closedJobs: closed,
          nextDeadline: futureDeadlines.length > 0 ? futureDeadlines[0] : null
        });
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load jobs. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
    
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_descriptions' }, payload => {
        console.log('Realtime update:', payload);
        fetchJobs();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const filteredJobs = jobs.filter(job => {
    const term = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term)
    );
  });
  
  const renderJobSkillBadges = (job: JobDescription) => {
    const skills = Array.isArray(job.skillsRequired) ? job.skillsRequired : [];
    return skills.slice(0, 4).map((skill, index) => (
      <Badge key={index} variant="outline" className="mr-1 mb-1">
        {skill}
      </Badge>
    ));
  };

  return (
    <RecruiterLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and applications</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24 mb-1" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="border-l-4 border-l-blue-500 transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    Active Jobs
                    <Briefcase className="h-4 w-4 ml-2 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.activeJobs}</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500 transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    Total Applications
                    <Users className="h-4 w-4 ml-2 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalApplications}</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-orange-500 transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    Closed Jobs
                    <Briefcase className="h-4 w-4 ml-2 text-orange-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.closedJobs}</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500 transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    Next Deadline
                    <Calendar className="h-4 w-4 ml-2 text-purple-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {stats.nextDeadline ? (
                      formatDate(stats.nextDeadline.toISOString().split('T')[0], "MMM d")
                    ) : (
                      "N/A"
                    )}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => navigate("/recruiter/create-job")} 
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Create New Job
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/recruiter/applications")} 
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              View Applications
            </Button>
          </div>
        </div>
        
        {/* Job Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Jobs</h2>
            <div className="w-full max-w-xs">
              <Input 
                placeholder="Search jobs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <Separator className="mb-6" />
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-3 w-full">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <div className="flex flex-wrap gap-4 pt-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            <Link to={`/recruiter/job/${job.id}`}>{job.title}</Link>
                          </h3>
                          <Badge 
                            variant={job.status === "active" ? "default" : 
                                   job.status === "closed" ? "destructive" : 
                                   job.status === "draft" ? "outline" : 
                                   "secondary"}
                            className="ml-3"
                          >
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-2">{job.company}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {renderJobSkillBadges(job)}
                          {Array.isArray(job.skillsRequired) && job.skillsRequired.length > 4 && (
                            <Badge variant="outline">+{job.skillsRequired.length - 4} more</Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          
                          {job.employmentType && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-3.5 w-3.5" />
                              <span>{job.employmentType}</span>
                            </div>
                          )}
                          
                          {job.deadline && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Closes {formatDate(job.deadline)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 sm:flex-col md:flex-row">
                        <Button 
                          size="icon"
                          variant="outline"
                          onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
                          className="h-9 w-9"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        
                        <Button 
                          size="icon"
                          variant="outline" 
                          onClick={() => navigate(`/recruiter/job/${job.id}`)}
                          className="h-9 w-9"
                        >
                          <Users className="h-4 w-4" />
                          <span className="sr-only">View Applications</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-muted/30">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Briefcase className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-lg font-medium mb-1">No job postings found</p>
                <p className="text-sm max-w-md mx-auto">
                  {searchTerm 
                    ? "Try adjusting your search query or create a new job posting"
                    : "Get started by creating your first job posting"}
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setSearchTerm("")}
                  >
                    Clear search
                  </Button>
                )}
                
                <Button 
                  onClick={() => navigate("/recruiter/create-job")} 
                  className="mt-4"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Job
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default Dashboard;

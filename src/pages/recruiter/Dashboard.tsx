
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  PlusIcon, 
  Briefcase, 
  Building, 
  MapPin, 
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import JobItem from "@/components/jobs/JobItem";
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
  const { toast } = useToast();
  const { data: jobsData, isLoading, isError } = useJobs();
  
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
  
  return (
    <MainLayout title="Dashboard">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold animate-fade-in">Job Postings</h1>
          <Button 
            onClick={() => navigate("/recruiter/job/new")} 
            className="transition-all duration-300 hover:shadow-md animate-fade-in"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>
        
        <div className="mb-4 animate-fade-in">
          <Input 
            placeholder="Search job postings..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <Separator className="mb-4" />
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job, index) => (
              <div 
                key={job.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <JobItem job={job} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="animate-fade-in">
            <CardContent className="py-8 text-center">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <AlertTriangle className="w-8 h-8 mb-2" />
                <p>No job postings found</p>
                {searchTerm && (
                  <Button 
                    variant="ghost" 
                    className="mt-2 transition-colors hover:bg-primary/10" 
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
    </MainLayout>
  );
};

export default Dashboard;

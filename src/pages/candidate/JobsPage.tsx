
import { useState, useEffect } from "react";
import { SearchIcon, FilterIcon, BriefcaseIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/layouts/MainLayout";
import JobCard from "@/components/jobs/JobCard";
import { api } from "@/services/api";
import { JobDescription } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";

const JobsPage = () => {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // First fetch all active jobs
        const jobsData = await api.getActiveJobs();
        
        // Then fetch all job applications from Supabase to filter out already applied jobs
        const { data: applications, error } = await supabase
          .from('job_applications')
          .select('job_id');
        
        if (error) {
          console.error("Error fetching applications:", error);
        } else {
          // Extract job IDs from applications
          const appliedIds = applications?.map(app => app.job_id) || [];
          setAppliedJobIds(appliedIds);
          
          // Filter out jobs that user has already applied for
          const availableJobs = jobsData.filter(job => !appliedIds.includes(job.id));
          setJobs(availableJobs);
          setFilteredJobs(availableJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          variant: "destructive", 
          title: "Error",
          description: "Failed to fetch job listings. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  useEffect(() => {
    const applyFilters = () => {
      let results = [...jobs];
      
      // Filter by search term (job title or company)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(job => 
          job.title.toLowerCase().includes(term) || 
          job.company.toLowerCase().includes(term) ||
          job.skillsRequired.some(skill => skill.toLowerCase().includes(term))
        );
      }
      
      // Filter by location
      if (locationFilter !== "all") {
        results = results.filter(job => 
          job.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }
      
      // Filter by job type
      if (typeFilter !== "all") {
        results = results.filter(job => 
          job.employmentType === typeFilter
        );
      }
      
      setFilteredJobs(results);
    };
    
    applyFilters();
  }, [jobs, searchTerm, locationFilter, typeFilter]);
  
  // Get unique locations for filter
  const locations = ["all", ...new Set(jobs.map(job => {
    const locationParts = job.location.split(",")[0].trim();
    return locationParts;
  }))];
  
  // Get unique job types for filter
  const jobTypes = ["all", ...new Set(jobs.map(job => job.employmentType))];
  
  return (
    <MainLayout title="Find Jobs">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  <FilterIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Location</label>
                    <Select 
                      value={locationFilter} 
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location, index) => (
                          <SelectItem key={index} value={location}>
                            {location === "all" ? "All Locations" : location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Job Type</label>
                    <Select 
                      value={typeFilter} 
                      onValueChange={setTypeFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type, index) => (
                          <SelectItem key={index} value={type}>
                            {type === "all" ? "All Types" : type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("all");
                      setTypeFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <BriefcaseIcon className="w-12 h-12 text-recruit-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Get matched instantly</h3>
                  <p className="text-muted-foreground mb-4">
                    Let our AI find the perfect jobs for your skills and experience.
                  </p>
                  <Button className="w-full">Create Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search jobs, skills, or companies..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Results count and sort */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{filteredJobs.length}</span>
                <span className="text-muted-foreground ml-1">jobs found</span>
              </div>
            </div>
            
            {/* Job cards */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2Icon className="w-8 h-8 text-primary animate-spin mb-4" />
                <p>Loading job listings...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center">
                    <SearchIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                    <p className="text-muted-foreground mb-4">
                      {appliedJobIds.length > 0 
                        ? "You've applied to all available jobs that match your criteria!"
                        : "Try adjusting your search or filters to find more jobs"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setLocationFilter("all");
                        setTypeFilter("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobsPage;

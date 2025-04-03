
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BriefcaseIcon, 
  UsersIcon, 
  CalendarIcon, 
  ClockIcon,
  PlusIcon,
  ChevronRightIcon,
  ArrowUpRightIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import JobCard from "@/components/jobs/JobCard";
import { api } from "@/services/api";
import { JobDescription } from "@/types";
import { formatDate } from "@/utils/formatters";

const Dashboard = () => {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getJobs();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  const activeJobs = jobs.filter(job => job.status === "active");
  const closedJobs = jobs.filter(job => job.status === "closed");
  const totalApplications = 42; // This would come from the API in a real app
  
  // Get job with closest deadline
  const upcomingDeadline = activeJobs.length > 0
    ? activeJobs.reduce((prev, current) => 
        new Date(prev.deadline) < new Date(current.deadline) ? prev : current
      )
    : null;
  
  return (
    <RecruiterLayout title="Recruiter Dashboard">
      <div className="grid gap-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Jobs</p>
                  <h3 className="text-3xl font-bold">{activeJobs.length}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-recruit-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Applications</p>
                  <h3 className="text-3xl font-bold">{totalApplications}</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Closed Jobs</p>
                  <h3 className="text-3xl font-bold">{closedJobs.length}</h3>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Next Deadline</p>
                  <h3 className="text-xl font-bold">
                    {upcomingDeadline 
                      ? formatDate(upcomingDeadline.deadline, "MMM dd")
                      : "No deadlines"}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link to="/recruiter/create-job">
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New Job
                </Button>
              </Link>
              <Link to="/recruiter/applications">
                <Button variant="outline">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* All Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Jobs</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse-slow">
                  <CardContent className="h-60"></CardContent>
                </Card>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  showApplyButton={false} 
                  showRecruiterActions={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">You haven't created any jobs yet.</p>
                <Link to="/recruiter/create-job">
                  <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Your First Job
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Recent Applications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
            <Link to="/recruiter/applications" className="text-sm text-recruit-primary flex items-center">
              View all
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <ul className="divide-y">
                <li className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-sm font-medium">
                      AJ
                    </div>
                    <div>
                      <p className="font-medium">Alex Johnson</p>
                      <p className="text-sm text-muted-foreground">Senior React Developer</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        87% Match
                      </span>
                    </div>
                    <Link to="/recruiter/applications/job-1">
                      <Button size="sm" variant="ghost">
                        <ArrowUpRightIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </li>
                <li className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-sm font-medium">
                      TS
                    </div>
                    <div>
                      <p className="font-medium">Taylor Smith</p>
                      <p className="text-sm text-muted-foreground">Data Scientist</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        92% Match
                      </span>
                    </div>
                    <Link to="/recruiter/applications/job-3">
                      <Button size="sm" variant="ghost">
                        <ArrowUpRightIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </li>
                <li className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-sm font-medium">
                      JM
                    </div>
                    <div>
                      <p className="font-medium">Jordan Miller</p>
                      <p className="text-sm text-muted-foreground">Product Manager</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        75% Match
                      </span>
                    </div>
                    <Link to="/recruiter/applications/job-2">
                      <Button size="sm" variant="ghost">
                        <ArrowUpRightIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default Dashboard;

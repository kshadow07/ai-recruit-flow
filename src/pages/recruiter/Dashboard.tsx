
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BriefcaseIcon, 
  UsersIcon, 
  CalendarIcon, 
  ClockIcon,
  PlusIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  FilterIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import JobCard from "@/components/jobs/JobCard";
import { formatDate } from "@/utils/formatters";
import { useJobs, useApplicationsCount } from "@/hooks/useJobs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const { data: jobs = [], isLoading } = useJobs();
  const { data: totalApplications = 0 } = useApplicationsCount();
  const [filterSort, setFilterSort] = useState<string>("newest");
  
  const activeJobs = jobs.filter(job => job.status === "active");
  const closedJobs = jobs.filter(job => job.status === "closed");
  
  // Get job with closest deadline
  const upcomingDeadline = activeJobs.length > 0
    ? activeJobs.reduce((prev, current) => 
        new Date(prev.deadline) < new Date(current.deadline) ? prev : current
      )
    : null;
  
  // Apply sorting to jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    switch (filterSort) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "closing-soon":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default:
        return 0;
    }
  });
  
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
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-muted-foreground" />
              <Select value={filterSort} onValueChange={setFilterSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="closing-soon">Closing Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse-slow">
                  <CardContent className="h-60"></CardContent>
                </Card>
              ))}
            </div>
          ) : sortedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedJobs.map((job) => (
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
        
        {/* Application preview removed as we now have accurate data */}
      </div>
    </RecruiterLayout>
  );
};

export default Dashboard;

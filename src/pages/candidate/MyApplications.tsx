
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, FilesIcon, Briefcase, Building, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layouts/MainLayout";
import { formatDate, formatTimeFromNow } from "@/utils/formatters";
import { useUserApplications } from "@/hooks/useJobs";

const MyApplications = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate authentication - in a real app, this would use proper auth
    const storedEmail = localStorage.getItem("user_email");
    setUserEmail(storedEmail);
  }, []);
  
  const { data: applications, isLoading, isError } = useUserApplications(userEmail || "");
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "shortlisted":
        return <Badge className="bg-green-100 text-green-800">Shortlisted</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "reviewing":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case "hired":
        return <Badge className="bg-purple-100 text-purple-800">Hired</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };
  
  return (
    <MainLayout title="My Applications">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/jobs")}
            className="mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold">My Applications</h1>
            <Link to="/jobs">
              <Button size="sm">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
        
        {!userEmail ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FilesIcon className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-xl font-medium mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-6">
                You need to sign in to view your job applications
              </p>
              <Button onClick={() => navigate("/jobs")}>
                Browse Available Jobs
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recruit-primary"></div>
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-red-500 mb-4">Error loading your applications</p>
              <Button onClick={() => navigate("/jobs")}>
                Browse Available Jobs
              </Button>
            </CardContent>
          </Card>
        ) : applications?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FilesIcon className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-xl font-medium mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't applied for any jobs. Start exploring opportunities now!
              </p>
              <Button onClick={() => navigate("/jobs")}>
                Find Jobs to Apply
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications?.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-start gap-3">
                          <div className="hidden sm:block">
                            <Briefcase className="w-10 h-10 text-recruit-primary bg-blue-50 p-2 rounded-md" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {application.job_descriptions?.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {application.job_descriptions?.company}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {application.job_descriptions?.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(application.status)}
                        <span className="text-sm text-muted-foreground">
                          Applied {formatTimeFromNow(application.applied_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-recruit-primary" />
                          <span className="text-sm">
                            <span className="text-muted-foreground mr-1">Closing date:</span>
                            {formatDate(application.job_descriptions?.deadline)}
                          </span>
                        </div>
                        
                        {application.match_score && (
                          <div className="flex items-center">
                            <div className="w-full max-w-xs">
                              <div className="text-xs flex justify-between">
                                <span>Match Score</span>
                                <span className="font-medium">{application.match_score}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-recruit-primary rounded-full" 
                                  style={{ width: `${application.match_score}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link to={`/application/status/${application.id}`}>
                          <Button variant="outline" size="sm">
                            View Status
                          </Button>
                        </Link>
                        <Link to={`/jobs/${application.job_id}`}>
                          <Button size="sm">
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyApplications;

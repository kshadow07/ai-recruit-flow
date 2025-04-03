
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FilterIcon, 
  ArrowLeftIcon, 
  UserIcon,
  MailIcon,
  PhoneIcon,
  FileTextIcon,
  CheckIcon,
  XIcon,
  AlertTriangleIcon,
  Loader2Icon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import ApplicationItem from "@/components/applications/ApplicationItem";
import { api } from "@/services/api";
import { JobApplication, JobDescription } from "@/types";
import { formatDate, formatTimeFromNow } from "@/utils/formatters";

const Applications = () => {
  const { jobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [job, setJob] = useState<JobDescription | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch applications - if jobId is provided, fetch for that job only
        const applicationsData = await api.getApplications(jobId);
        setApplications(applicationsData);
        
        if (applicationsData.length > 0) {
          setSelectedApplication(applicationsData[0]);
        }
        
        // If jobId is provided, fetch job details
        if (jobId) {
          const jobData = await api.getJobById(jobId);
          setJob(jobData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);
  
  const handleApplicationSelect = (application: JobApplication) => {
    setSelectedApplication(application);
  };
  
  const handleStatusChange = async (status: JobApplication["status"]) => {
    if (!selectedApplication) return;
    
    setUpdatingStatus(true);
    try {
      const updated = await api.updateApplicationStatus(selectedApplication.id, status);
      
      // Update the local state
      setApplications(applications.map(app => 
        app.id === updated.id ? updated : app
      ));
      setSelectedApplication(updated);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  const getStatusColor = (status: JobApplication["status"]) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Filter and search applications
  const filteredApplications = applications.filter(app => {
    // Filter by status
    if (filter !== "all" && app.status !== filter) {
      return false;
    }
    
    // Search by candidate name or skills
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const nameMatch = app.candidate.name.toLowerCase().includes(term);
      const skillsMatch = app.candidate.skills.some(skill => 
        skill.toLowerCase().includes(term)
      );
      return nameMatch || skillsMatch;
    }
    
    return true;
  });
  
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    // Sort by match score (highest first)
    return (b.matchScore || 0) - (a.matchScore || 0);
  });
  
  return (
    <RecruiterLayout title={job ? `Applications for ${job.title}` : "All Applications"}>
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(jobId ? `/recruiter/job/${jobId}` : "/recruiter")}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {jobId ? "Back to Job Details" : "Back to Dashboard"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Filter and search */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FilterIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Filters</span>
                </div>
                
                <Select 
                  value={filter} 
                  onValueChange={setFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <Input 
                  placeholder="Search candidates..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Applications list */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2Icon className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : sortedApplications.length > 0 ? (
              sortedApplications.map((application) => (
                <ApplicationItem 
                  key={application.id} 
                  application={application} 
                  onSelect={handleApplicationSelect}
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <AlertTriangleIcon className="w-8 h-8 mb-2" />
                    <p>No applications found</p>
                    {searchTerm && (
                      <Button 
                        variant="ghost" 
                        className="mt-2" 
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
        </div>
        
        <div className="lg:col-span-2">
          {selectedApplication ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedApplication.candidate.name}</CardTitle>
                    <CardDescription>{job?.title}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Match score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Match Score</span>
                      <span className="font-medium">{selectedApplication.matchScore || 0}%</span>
                    </div>
                    <Progress 
                      value={selectedApplication.matchScore || 0} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* Candidate info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MailIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedApplication.candidate.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedApplication.candidate.phone}</span>
                    </div>
                  </div>
                  
                  {/* Cover letter if available */}
                  {selectedApplication.candidate.coverLetter && (
                    <div>
                      <h3 className="font-medium mb-2">Cover Letter</h3>
                      <div className="bg-muted p-4 rounded-md text-sm">
                        {selectedApplication.candidate.coverLetter}
                      </div>
                    </div>
                  )}
                  
                  {/* Skills */}
                  <div>
                    <h3 className="font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Resume download */}
                  <div>
                    <h3 className="font-medium mb-2">Resume</h3>
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                  
                  {/* Application details */}
                  <div>
                    <h3 className="font-medium mb-2">Application Details</h3>
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Applied:</span>
                        <span>{formatTimeFromNow(selectedApplication.appliedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application Status:</span>
                        <span className="capitalize">{selectedApplication.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes if available */}
                  {selectedApplication.notes && (
                    <div>
                      <h3 className="font-medium mb-2">Recruiter Notes</h3>
                      <div className="bg-muted p-4 rounded-md text-sm">
                        {selectedApplication.notes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <Separator />
              
              <CardFooter className="pt-6">
                <div className="w-full">
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedApplication.status === "reviewing" || updatingStatus}
                      onClick={() => handleStatusChange("reviewing")}
                      className={selectedApplication.status === "reviewing" ? "bg-blue-100 text-blue-800" : ""}
                    >
                      Reviewing
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedApplication.status === "shortlisted" || updatingStatus}
                      onClick={() => handleStatusChange("shortlisted")}
                      className={selectedApplication.status === "shortlisted" ? "bg-green-100 text-green-800" : ""}
                    >
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Shortlist
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedApplication.status === "rejected" || updatingStatus}
                      onClick={() => handleStatusChange("rejected")}
                      className={selectedApplication.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                    >
                      <XIcon className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedApplication.status === "hired" || updatingStatus}
                      onClick={() => handleStatusChange("hired")}
                      className={selectedApplication.status === "hired" ? "bg-purple-100 text-purple-800" : ""}
                    >
                      Hire
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No Application Selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select an application from the list to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default Applications;

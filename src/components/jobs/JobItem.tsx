
import React from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Building,
  MapPin,
  Calendar,
  Users,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobDescription } from "@/types";
import { formatDate, formatTimeFromNow } from "@/utils/formatters";
import { useApplicationsCount } from "@/hooks/useJobs";

interface JobItemProps {
  job: JobDescription;
}

const JobItem = ({ job }: JobItemProps) => {
  const { data: applicationsCount } = useApplicationsCount(job.id);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">Active</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 transition-colors">Closed</Badge>;
      case "draft":
        return <Badge variant="outline" className="hover:bg-gray-100 transition-colors">Draft</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors">Processing</Badge>;
      case "error":
        return <Badge variant="destructive" className="hover:bg-red-700 transition-colors">Error</Badge>;
      default:
        return <Badge variant="outline" className="hover:bg-gray-100 transition-colors">{status}</Badge>;
    }
  };
  
  return (
    <Card className="job-card hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex items-center justify-center w-12 h-12">
                <Briefcase className="w-10 h-10 text-primary bg-primary/10 p-2 rounded-md transition-all duration-300 hover:bg-primary/20" />
              </div>
              <div>
                <Link to={`/recruiter/job/${job.id}`} className="group">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-200">{job.title}</h3>
                  <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-300 origin-left"></div>
                </Link>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center group">
                    <Building className="w-4 h-4 mr-1 group-hover:text-primary transition-colors duration-200" />
                    <span className="group-hover:text-primary transition-colors duration-200">{job.company}</span>
                  </div>
                  <div className="flex items-center group">
                    <MapPin className="w-4 h-4 mr-1 group-hover:text-primary transition-colors duration-200" />
                    <span className="group-hover:text-primary transition-colors duration-200">{job.location}</span>
                  </div>
                  <div className="flex items-center group">
                    <Clock className="w-4 h-4 mr-1 group-hover:text-primary transition-colors duration-200" />
                    <span className="group-hover:text-primary transition-colors duration-200">{formatTimeFromNow(job.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 animate-fade-in">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{applicationsCount || 0} applicants</span>
            </div>
            {getStatusBadge(job.status)}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="hover:bg-gray-100 transition-colors">{job.employmentType}</Badge>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="text-sm">Deadline: {formatDate(job.deadline)}</span>
            </div>
          </div>
          <div>
            <Link to={`/recruiter/job/${job.id}`}>
              <Button size="sm" className="transition-all duration-300 hover:shadow-md">View Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobItem;

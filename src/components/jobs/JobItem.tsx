
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
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card className="job-card hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-start gap-3">
              <div className="hidden sm:block">
                <Briefcase className="w-10 h-10 text-primary bg-primary/10 p-2 rounded-md" />
              </div>
              <div>
                <Link to={`/recruiter/job/${job.id}`} className="hover:underline">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                </Link>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {job.company}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeFromNow(job.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{applicationsCount || 0} applicants</span>
            </div>
            {getStatusBadge(job.status)}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">{job.employmentType}</Badge>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="text-sm">Deadline: {formatDate(job.deadline)}</span>
            </div>
          </div>
          <div>
            <Link to={`/recruiter/job/${job.id}`}>
              <Button size="sm">View Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobItem;

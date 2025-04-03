
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import { JobDescription } from "@/types";
import { formatSalary } from "@/utils/formatters";

interface JobCardProps {
  job: JobDescription;
  showApplyButton?: boolean;
}

const JobCard = ({ job, showApplyButton = true }: JobCardProps) => {
  const hasDeadlinePassed = new Date(job.deadline) < new Date();
  
  return (
    <Card className="job-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-1">
              <Link 
                to={showApplyButton ? `/jobs/${job.id}` : `/recruiter/job/${job.id}`}
                className="hover:text-recruit-primary transition-colors"
              >
                {job.title}
              </Link>
            </h3>
            <p className="text-muted-foreground mb-4">{job.company}</p>
          </div>
          
          <Badge variant={hasDeadlinePassed ? "destructive" : "default"}>
            {hasDeadlinePassed ? "Closed" : job.status === "active" ? "Active" : job.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Briefcase className="w-4 h-4 mr-2" />
            <span>{job.employmentType} • {job.experienceLevel}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>{formatSalary(job.salaryRange)}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {hasDeadlinePassed 
                ? "Deadline passed" 
                : `Closes ${formatDistanceToNow(new Date(job.deadline), { addSuffix: true })}`}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {job.skillsRequired.slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="secondary" className="rounded-md">
              {skill}
            </Badge>
          ))}
          {job.skillsRequired.length > 5 && (
            <Badge variant="secondary" className="rounded-md">
              +{job.skillsRequired.length - 5} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      {showApplyButton && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
          
          <Link to={hasDeadlinePassed ? "#" : `/apply/${job.id}`}>
            <Button 
              variant="default" 
              disabled={hasDeadlinePassed}
            >
              {hasDeadlinePassed ? "Closed" : "Apply Now"}
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default JobCard;

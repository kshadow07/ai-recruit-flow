
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Briefcase, Clock, DollarSign, PencilIcon, TrashIcon } from "lucide-react";
import { JobDescription } from "@/types";
import { formatSalary } from "@/utils/formatters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface JobCardProps {
  job: JobDescription;
  showApplyButton?: boolean;
  showRecruiterActions?: boolean;
}

const JobCard = ({ job, showApplyButton = true, showRecruiterActions = false }: JobCardProps) => {
  const hasDeadlinePassed = new Date(job.deadline) < new Date();
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    try {
      await api.deleteJob(job.id);
      window.location.reload(); // Refresh to show updated list
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };
  
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
          
          <div className="flex items-center">
            <Badge variant={hasDeadlinePassed ? "destructive" : "default"} className="mr-2">
              {hasDeadlinePassed ? "Closed" : job.status === "active" ? "Active" : job.status}
            </Badge>
            
            {showRecruiterActions && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the job posting
                        and remove the data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
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
      
      {showApplyButton ? (
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
          
          <Link to={hasDeadlinePassed ? "#" : `/jobs/${job.id}`}>
            <Button 
              variant="default" 
              disabled={hasDeadlinePassed}
            >
              {hasDeadlinePassed ? "Closed" : "View Details"}
            </Button>
          </Link>
        </CardFooter>
      ) : (
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
          
          <Link to={`/recruiter/applications/${job.id}`}>
            <Button variant="outline">
              View Applications
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default JobCard;

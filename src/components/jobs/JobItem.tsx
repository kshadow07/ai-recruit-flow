
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobDescription } from "@/types";
import { formatDate, formatTimeFromNow } from "@/utils/formatters";
import { Briefcase, MapPin, Calendar, Users, Edit, Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobItemProps {
  job: JobDescription;
  showActions?: boolean;
  isCompact?: boolean;
  onDelete?: (jobId: string) => void;
  refetch?: () => void;
}

const JobItem: React.FC<JobItemProps> = ({ 
  job, 
  showActions = true,
  isCompact = false,
  onDelete,
  refetch
}) => {
  const navigate = useNavigate();
  
  const statusColor = {
    active: "bg-green-100 text-green-800 border-green-200",
    closed: "bg-red-100 text-red-800 border-red-200",
    draft: "bg-gray-100 text-gray-800 border-gray-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    error: "bg-amber-100 text-amber-800 border-amber-200",
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        const { error } = await supabase
          .from('job_descriptions')
          .delete()
          .eq('id', job.id);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Job Deleted",
          description: "Job posting has been deleted successfully",
        });
        
        if (refetch) {
          refetch();
        }
        
        if (onDelete) {
          onDelete(job.id);
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete job posting"
        });
      }
    }
  };
  
  const renderSkillBadges = () => {
    const skills = Array.isArray(job.skillsRequired) ? job.skillsRequired : [];
    const displayCount = isCompact ? 3 : 5;
    
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {skills.slice(0, displayCount).map((skill, idx) => (
          <Badge key={idx} variant="outline" className="text-xs font-normal py-0.5">
            {skill}
          </Badge>
        ))}
        {skills.length > displayCount && (
          <Badge variant="outline" className="text-xs font-normal py-0.5">
            +{skills.length - displayCount}
          </Badge>
        )}
      </div>
    );
  };
  
  return (
    <Card className={`transition-all hover:shadow-md border-l-4 ${
      job.status === 'active' ? 'border-l-purple-500' : 
      job.status === 'closed' ? 'border-l-red-500' : 
      job.status === 'draft' ? 'border-l-gray-500' : 
      job.status === 'processing' ? 'border-l-blue-500' : 'border-l-amber-500'
    }`}>
      <CardContent className={`p-5 ${isCompact ? 'pb-3' : 'pb-4'}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Link 
                to={`/recruiter/job/${job.id}`}
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {job.title}
              </Link>
              
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[job.status]}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
            
            <p className="text-muted-foreground text-sm mb-1">{job.company}</p>
            
            {!isCompact && renderSkillBadges()}
            
            <div className="flex flex-wrap text-xs text-muted-foreground gap-3 mt-2">
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{job.location}</span>
                </div>
              )}
              
              {job.employmentType && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{job.employmentType}</span>
                </div>
              )}
              
              {job.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Closes {formatDate(job.deadline)}</span>
                </div>
              )}
              
              {job.createdAt && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Posted {formatTimeFromNow(job.createdAt)}</span>
                </div>
              )}
            </div>
            
            {isCompact && renderSkillBadges()}
          </div>
          
          {showActions && (
            <div className="flex sm:flex-col gap-2">
              <Button 
                size="sm"
                variant="outline" 
                className="flex gap-1.5 items-center text-xs h-8"
                onClick={() => navigate(`/recruiter/job/edit/${job.id}`)}
              >
                <Edit className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              
              <Button 
                size="sm"
                className="flex gap-1.5 items-center text-xs h-8" 
                onClick={() => navigate(`/recruiter/job/${job.id}`)}
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Applications</span>
              </Button>

              <Button 
                size="sm"
                variant="destructive" 
                className="flex gap-1.5 items-center text-xs h-8"
                onClick={handleDelete}
              >
                <Trash className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobItem;

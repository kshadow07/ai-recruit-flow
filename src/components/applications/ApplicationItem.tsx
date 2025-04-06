
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobApplication } from "@/types";
import { cn } from "@/lib/utils";
import { formatTimeFromNow } from "@/utils/formatters";

interface ApplicationItemProps {
  application: JobApplication;
  selected?: boolean;
  onSelect: (application: JobApplication) => void;
}

const ApplicationItem = ({ application, selected, onSelect }: ApplicationItemProps) => {
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
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getMatchScoreColor = (score?: number) => {
    if (score === undefined) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };
  
  return (
    <Card 
      className={cn(
        "transition-colors cursor-pointer hover:border-primary",
        selected && "border-primary bg-primary/5"
      )}
      onClick={() => onSelect(application)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-medium">{application.candidate.name}</h4>
            <p className="text-sm text-muted-foreground truncate">
              {application.candidate.email}
            </p>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Match Score</span>
            <span className={cn("text-xs font-medium", getMatchScoreColor(application.matchScore))}>
              {application.status === "processing" 
                ? "Processing..." 
                : `${application.matchScore || 0}%`}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {application.candidate.skills.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {application.candidate.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{application.candidate.skills.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
            <span>Applied {formatTimeFromNow(application.appliedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationItem;

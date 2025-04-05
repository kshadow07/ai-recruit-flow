
import { formatDistanceToNow } from "date-fns";
import { JobApplication } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ApplicationItemProps {
  application: JobApplication;
  onSelect: (application: JobApplication) => void;
}

const ApplicationItem = ({ application, onSelect }: ApplicationItemProps) => {
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
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Calculate the match score percentage
  const displayMatchScore = () => {
    if (application.status === "processing") {
      return "Processing";
    }
    
    if (application.matchScore === undefined || application.matchScore === null) {
      return 0;
    }
    
    // If matchScore is already a percentage (e.g., 85 for 85%)
    if (application.matchScore >= 0 && application.matchScore <= 100) {
      return Math.round(application.matchScore);
    }
    
    // If matchScore is a decimal (e.g., 0.85 for 85%)
    if (application.matchScore >= 0 && application.matchScore <= 1) {
      return Math.round(application.matchScore * 100);
    }
    
    return 0;
  };

  // Calculate a numeric value for the progress bar
  const getProgressValue = (): number => {
    if (application.status === "processing" || typeof displayMatchScore() === "string") {
      return 0;
    }
    return displayMatchScore() as number;
  };
  
  return (
    <Card 
      className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
      onClick={() => onSelect(application)}
    >
      <CardContent className="p-4">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${application.candidate.id}`} />
            <AvatarFallback>{getInitials(application.candidate.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{application.candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{application.candidate.email}</p>
              </div>
              
              <Badge className={getStatusColor(application.status)}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
            
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Match Score</span>
                <span className="text-sm font-medium">
                  {application.status === "processing" ? "Processing..." : `${displayMatchScore()}%`}
                </span>
              </div>
              <Progress 
                value={getProgressValue()}
                className="h-2"
              />
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
              </div>
              
              <div className="flex space-x-1">
                {application.candidate.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {application.candidate.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{application.candidate.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationItem;

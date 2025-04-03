
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, Loader2Icon, UploadIcon, FileIcon, XIcon, AlertTriangleIcon } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { api } from "@/services/api";
import { JobDescription } from "@/types";
import { formatDate } from "@/utils/formatters";

// Define the form schema
const applicationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  skills: z.string().min(2, "Please list at least one skill"),
  coverLetter: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const ApplicationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Initialize the form
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      skills: "",
      coverLetter: "",
    },
  });
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;
        const data = await api.getJobById(id);
        
        // Check if job is closed
        if (data.status === "closed" || new Date(data.deadline) < new Date()) {
          navigate(`/jobs/${id}`);
          return;
        }
        
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id, navigate]);
  
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (PDF or DOC)
      const fileType = file.type;
      if (fileType !== "application/pdf" && 
          fileType !== "application/msword" && 
          fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        alert("Please upload a PDF or DOC file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      
      setResumeFile(file);
    }
  };
  
  const removeResumeFile = () => {
    setResumeFile(null);
  };
  
  const onSubmit = async (values: ApplicationFormValues) => {
    if (!resumeFile) {
      alert("Please upload your resume");
      return;
    }
    
    if (!job || !id) return;
    
    setSubmitLoading(true);
    
    try {
      // In a real app, we would upload the resume file to storage
      // and get back a URL to store with the application
      const resumeUrl = URL.createObjectURL(resumeFile);
      
      // Transform skills string into array
      const skillsArray = values.skills.split(",").map(skill => skill.trim());
      
      // Create candidate data
      const candidateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        resumeUrl,
        coverLetter: values.coverLetter,
        skills: skillsArray,
      };
      
      // Submit application
      const application = await api.submitApplication(id, candidateData);
      
      // Navigate to success page
      navigate(`/application/status/${application.id}`);
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout title="Apply for Position">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Loader2Icon className="w-6 h-6 animate-spin mr-2" />
            <span>Loading application form...</span>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!job) {
    return (
      <MainLayout title="Job Not Found">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <AlertTriangleIcon className="w-12 h-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-4">The job you're trying to apply for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/jobs")}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title={`Apply for ${job.title}`}>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/jobs/${id}`)}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Job Details
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Apply for {job.title}</CardTitle>
            <CardDescription>
              Complete the form below to apply for this position at {job.company}.
              Make sure to attach your resume and provide all required information.
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Job Details</h3>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Position:</span>
                      <span>{job.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company:</span>
                      <span>{job.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span>{formatDate(job.deadline)}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Professional Information</h3>
                  
                  <div>
                    <Label htmlFor="resume" className="block mb-2">Resume</Label>
                    {resumeFile ? (
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <FileIcon className="w-5 h-5 text-blue-500 mr-2" />
                          <div>
                            <p className="font-medium text-sm">{resumeFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(resumeFile.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={removeResumeFile}
                          type="button"
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                           onClick={() => document.getElementById("resume")?.click()}>
                        <UploadIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF or DOC (max 5MB)
                        </p>
                        <input 
                          id="resume" 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleResumeUpload}
                        />
                      </div>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List your skills separated by commas (e.g. JavaScript, React, Node.js)"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Letter (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us why you're a good fit for this position..."
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate(`/jobs/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitLoading}>
                  {submitLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ApplicationForm;

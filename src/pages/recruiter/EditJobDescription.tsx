
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import { api } from "@/services/api";
import { JobDescription } from "@/types";

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Internship", "Remote"]),
  responsibilities: z.string().min(30, "Responsibilities must be at least 30 characters"),
  qualifications: z.string().min(30, "Qualifications must be at least 30 characters"),
  skillsRequired: z.string().min(5, "Skills must be at least 5 characters"),
  experienceLevel: z.string().min(2, "Experience level must be at least 2 characters"),
  salaryMin: z.coerce.number().min(1, "Minimum salary is required"),
  salaryMax: z.coerce.number().min(1, "Maximum salary is required"),
  currency: z.string().min(1, "Currency is required"),
  deadline: z.date({
    required_error: "A deadline date is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const EditJobDescription = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [jobData, setJobData] = useState<JobDescription | null>(null);
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      department: "",
      location: "",
      employmentType: "Full-time",
      responsibilities: "",
      qualifications: "",
      skillsRequired: "",
      experienceLevel: "",
      salaryMin: 0,
      salaryMax: 0,
      currency: "USD",
      deadline: new Date(),
    },
  });
  
  // Fetch job data
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (!id) {
          navigate("/recruiter");
          return;
        }
        
        const job = await api.getJobById(id);
        setJobData(job);
        
        // Set form values
        form.reset({
          title: job.title,
          company: job.company,
          department: job.department,
          location: job.location,
          employmentType: job.employmentType,
          responsibilities: job.responsibilities,
          qualifications: job.qualifications,
          skillsRequired: job.skillsRequired.join(", "),
          experienceLevel: job.experienceLevel,
          salaryMin: job.salaryRange.min,
          salaryMax: job.salaryRange.max,
          currency: job.salaryRange.currency,
          deadline: new Date(job.deadline),
        });
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load job data",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();
  }, [id, navigate, form]);
  
  // Submit handler
  const onSubmit = async (data: FormValues) => {
    if (!id || !jobData) return;
    
    setSubmitting(true);
    try {
      // Convert from form values to JobDescription format
      const updatedJob: Partial<JobDescription> = {
        title: data.title,
        company: data.company,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType,
        responsibilities: data.responsibilities,
        qualifications: data.qualifications,
        skillsRequired: data.skillsRequired.split(",").map(skill => skill.trim()),
        experienceLevel: data.experienceLevel,
        salaryRange: {
          min: data.salaryMin,
          max: data.salaryMax,
          currency: data.currency,
        },
        deadline: data.deadline.toISOString(),
      };
      
      await api.updateJob(id, updatedJob);
      
      toast({
        title: "Job Updated",
        description: "Your job posting has been updated successfully",
      });
      
      navigate(`/recruiter/job/${id}`);
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update job posting",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <RecruiterLayout title="Edit Job Description">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading job data...</div>
        </div>
      </RecruiterLayout>
    );
  }
  
  if (!jobData) {
    return (
      <RecruiterLayout title="Edit Job Description">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The job you're trying to edit doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/recruiter")}>
            Return to Dashboard
          </Button>
        </div>
      </RecruiterLayout>
    );
  }
  
  return (
    <RecruiterLayout title="Edit Job Description">
      <Card>
        <CardHeader>
          <CardTitle>Edit Job Description</CardTitle>
          <CardDescription>
            Update your job posting details. Once saved, changes will be reflected immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Engineering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco, CA (Remote)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <FormControl>
                        <Input placeholder="3+ years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="salaryMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Salary</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="salaryMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="skillsRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="React, TypeScript, Node.js, GraphQL" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of skills required for this position
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Application Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detail the day-to-day responsibilities of this role..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List required qualifications, education, and experience..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => navigate(`/recruiter/job/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>Saving Changes...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </RecruiterLayout>
  );
};

export default EditJobDescription;

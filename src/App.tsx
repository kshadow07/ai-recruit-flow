
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/recruiter/Dashboard";
import CreateJobDescription from "./pages/recruiter/CreateJobDescription";
import EditJobDescription from "./pages/recruiter/EditJobDescription";
import JobDetails from "./pages/recruiter/JobDetails";
import Applications from "./pages/recruiter/Applications";
import JobsPage from "./pages/candidate/JobsPage";
import JobView from "./pages/candidate/JobView";
import ApplicationForm from "./pages/candidate/ApplicationForm";
import ApplicationStatus from "./pages/candidate/ApplicationStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Recruiter Routes */}
          <Route path="/recruiter" element={<Dashboard />} />
          <Route path="/recruiter/create-job" element={<CreateJobDescription />} />
          <Route path="/recruiter/edit-job/:id" element={<EditJobDescription />} />
          <Route path="/recruiter/job/:id" element={<JobDetails />} />
          <Route path="/recruiter/applications" element={<Applications />} />
          <Route path="/recruiter/applications/:jobId" element={<Applications />} />
          
          {/* Candidate Routes */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobView />} />
          <Route path="/apply/:id" element={<ApplicationForm />} />
          <Route path="/application/status/:id" element={<ApplicationStatus />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import JobsPage from './pages/candidate/JobsPage';
import JobView from './pages/candidate/JobView';
import ApplicationForm from './pages/candidate/ApplicationForm';
import ApplicationStatus from './pages/candidate/ApplicationStatus';
import MyApplications from './pages/candidate/MyApplications';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import CreateJobDescription from './pages/recruiter/CreateJobDescription';
import EditJobDescription from './pages/recruiter/EditJobDescription';
import JobDetails from './pages/recruiter/JobDetails';
import Applications from './pages/recruiter/Applications';
import LandingPage from './pages/LandingPage';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Landing and Main Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/index" element={<Navigate to="/" replace />} />

          {/* Job Search Routes */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/job/:jobId" element={<JobView />} />
          <Route path="/apply/:jobId" element={<ApplicationForm />} />
          <Route path="/application/status/:applicationId" element={<ApplicationStatus />} />
          <Route path="/my-applications" element={<MyApplications />} />

          {/* Recruiter Routes */}
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/create-job" element={<CreateJobDescription />} />
          <Route path="/recruiter/edit-job/:jobId" element={<EditJobDescription />} />
          <Route path="/recruiter/job/:jobId" element={<JobDetails />} />
          <Route path="/recruiter/applications" element={<Applications />} />
          <Route path="/recruiter/applications/:jobId" element={<Applications />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;

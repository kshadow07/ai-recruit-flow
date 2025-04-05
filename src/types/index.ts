
export interface JobDescription {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  responsibilities: string;
  qualifications: string;
  skillsRequired: string[];
  experienceLevel: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string; // ISO date string
  status: 'active' | 'closed' | 'draft' | 'processing' | 'error';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  summary?: string; // AI-generated summary
  externalId?: string; // ID from external API
  requestData?: any; // Store the original request data sent to the API
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  skills: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidate: Candidate;
  appliedAt: string; // ISO date string
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired' | 'processing';
  matchScore?: number; // 0-100 percentage
  notes?: string;
  summary?: string; // AI-generated summary from resume
  externalId?: string; // ID from external API
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'recruiter' | 'candidate' | 'admin';
  company?: string;
  position?: string;
  avatar?: string;
}

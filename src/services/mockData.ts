
import { JobDescription, JobApplication, Candidate, User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { addDays, format, parseISO, isPast } from "date-fns";

// Mock job descriptions
const mockJobs: JobDescription[] = [
  {
    id: "job-1",
    title: "Senior React Developer",
    company: "TechInnovate Solutions",
    department: "Engineering",
    location: "San Francisco, CA (Remote)",
    employmentType: "Full-time",
    responsibilities: `
      - Lead development of frontend applications using React, TypeScript, and modern web technologies
      - Collaborate with UX designers to implement intuitive user interfaces
      - Conduct code reviews and mentor junior developers
      - Optimize applications for maximum speed and scalability
      - Implement state management solutions using Redux, Context API, or similar
    `,
    qualifications: `
      - Bachelor's degree in Computer Science or related field
      - 5+ years of experience with React.js and frontend development
      - Strong understanding of JavaScript, HTML5, and CSS3
      - Experience with responsive design and cross-browser compatibility
      - Knowledge of modern frontend build pipelines and tools
    `,
    skillsRequired: [
      "React", "TypeScript", "JavaScript", "Redux", "REST APIs", "CSS", "HTML", "Git"
    ],
    experienceLevel: "5+ years",
    salaryRange: {
      min: 120000,
      max: 160000,
      currency: "USD"
    },
    deadline: addDays(new Date(), 14).toISOString(),
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    summary: "Senior React Developer position focusing on building responsive, scalable web applications using modern JavaScript frameworks. Ideal candidates will have extensive experience with React, TypeScript, and frontend architecture. The role involves leading development efforts, mentoring junior developers, implementing UI components, optimizing application performance, and integrating with backend services. Strong problem-solving skills and experience with state management solutions like Redux are essential. The position requires collaboration with cross-functional teams to deliver high-quality software solutions that meet business requirements and provide excellent user experiences."
  },
  {
    id: "job-2",
    title: "Product Manager",
    company: "TechInnovate Solutions",
    department: "Product",
    location: "New York, NY",
    employmentType: "Full-time",
    responsibilities: `
      - Define product vision, strategy, and roadmap in collaboration with stakeholders
      - Gather and analyze customer feedback to inform product decisions
      - Work closely with engineering, design, and marketing teams
      - Prioritize features and create detailed product specifications
      - Track product metrics and KPIs to measure success
    `,
    qualifications: `
      - Bachelor's degree in Business, Computer Science, or related field
      - 3+ years of experience in product management
      - Strong analytical and problem-solving skills
      - Excellent communication and presentation abilities
      - Experience with agile development methodologies
    `,
    skillsRequired: [
      "Product Strategy", "User Stories", "Market Research", "Agile", "Data Analysis", "Wireframing"
    ],
    experienceLevel: "3+ years",
    salaryRange: {
      min: 100000,
      max: 140000,
      currency: "USD"
    },
    deadline: addDays(new Date(), 21).toISOString(),
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    summary: "Product Manager role focused on driving product vision and execution. The ideal candidate will combine strategic thinking with tactical execution to deliver products that meet customer needs and business objectives. This position requires developing product roadmaps, gathering and analyzing market research, and collaborating with cross-functional teams including engineering, design, and marketing. Key responsibilities include defining user stories, prioritizing features based on business value, analyzing product metrics, and making data-driven decisions. Candidates should have experience in agile methodologies, excellent stakeholder management skills, and the ability to translate business requirements into technical specifications. Success in this role depends on balancing customer needs, technical constraints, and business goals to create innovative, competitive products."
  },
  {
    id: "job-3",
    title: "Data Scientist",
    company: "TechInnovate Solutions",
    department: "Data",
    location: "Remote",
    employmentType: "Full-time",
    responsibilities: `
      - Develop machine learning models to solve complex business problems
      - Analyze large datasets to extract actionable insights
      - Collaborate with data engineers and product teams
      - Create data visualizations and dashboards
      - Present findings to stakeholders and executives
    `,
    qualifications: `
      - Master's degree or PhD in Computer Science, Statistics, or related field
      - 2+ years of experience with machine learning and data analysis
      - Proficiency in Python, R, or similar programming languages
      - Experience with data visualization tools
      - Strong mathematical and statistical background
    `,
    skillsRequired: [
      "Python", "Machine Learning", "SQL", "Data Visualization", "Statistics", "TensorFlow", "PyTorch"
    ],
    experienceLevel: "2+ years",
    salaryRange: {
      min: 110000,
      max: 150000,
      currency: "USD"
    },
    deadline: addDays(new Date(), 30).toISOString(),
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    summary: "Data Scientist role focused on developing machine learning models and extracting insights from large datasets. Ideal candidates will have a strong background in statistics, programming, and data analysis. This position involves building and deploying predictive models, conducting exploratory data analysis, and creating visualization tools to communicate findings. The role requires expertise in Python, SQL, and machine learning frameworks like TensorFlow or PyTorch. Candidates should be proficient in statistical analysis, feature engineering, and model evaluation techniques. Experience with big data technologies and cloud computing platforms is a plus. The successful candidate will work cross-functionally with engineering and product teams to translate business problems into data science solutions and present technical findings to non-technical stakeholders in a clear, actionable manner."
  },
  {
    id: "job-4",
    title: "UX/UI Designer",
    company: "TechInnovate Solutions",
    department: "Design",
    location: "Austin, TX (Hybrid)",
    employmentType: "Full-time",
    responsibilities: `
      - Create user-centered designs by understanding business requirements
      - Create wireframes, prototypes, and user flows
      - Conduct user research and usability testing
      - Collaborate with developers to implement designs
      - Maintain design systems and style guides
    `,
    qualifications: `
      - Bachelor's degree in Design, HCI, or related field
      - 3+ years of experience in UX/UI design
      - Proficiency with design tools like Figma, Sketch, or Adobe XD
      - Portfolio demonstrating strong visual design skills
      - Experience with user research and testing methodologies
    `,
    skillsRequired: [
      "Figma", "User Research", "Wireframing", "Prototyping", "Visual Design", "UI Design", "Usability Testing"
    ],
    experienceLevel: "3+ years",
    salaryRange: {
      min: 90000,
      max: 130000,
      currency: "USD"
    },
    deadline: addDays(new Date(), 10).toISOString(),
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    summary: "UX/UI Designer position focusing on creating intuitive and engaging user experiences. The ideal candidate will combine strong visual design skills with user-centered design principles to create exceptional digital products. This role involves the entire design process from research and conceptualization to implementation and iteration. Key responsibilities include conducting user research, creating user flows, developing wireframes and prototypes, and designing polished UI components. The position requires proficiency in design tools like Figma, expertise in responsive design principles, and experience with design systems. Successful candidates will demonstrate both creative and analytical thinking, with the ability to transform complex requirements into simple, beautiful user interfaces while advocating for user needs throughout the product development lifecycle."
  }
];

// Mock candidates
const mockCandidates: Candidate[] = [
  {
    id: "candidate-1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "555-123-4567",
    resumeUrl: "/resumes/alex-johnson-resume.pdf",
    skills: ["React", "JavaScript", "TypeScript", "Redux", "Node.js"]
  },
  {
    id: "candidate-2",
    name: "Taylor Smith",
    email: "taylor.smith@example.com",
    phone: "555-987-6543",
    resumeUrl: "/resumes/taylor-smith-resume.pdf",
    coverLetter: "I am very excited about the opportunity to join your team...",
    skills: ["Python", "Data Analysis", "Machine Learning", "SQL", "TensorFlow"]
  },
  {
    id: "candidate-3",
    name: "Jordan Miller",
    email: "jordan.miller@example.com",
    phone: "555-555-5555",
    resumeUrl: "/resumes/jordan-miller-resume.pdf",
    skills: ["Product Management", "Agile", "User Stories", "Market Research", "Jira"]
  }
];

// Mock applications
const mockApplications: JobApplication[] = [
  {
    id: "application-1",
    jobId: "job-1",
    candidate: mockCandidates[0],
    appliedAt: new Date().toISOString(),
    status: "reviewing",
    matchScore: 87,
    notes: "Strong React experience, good culture fit"
  },
  {
    id: "application-2",
    jobId: "job-3",
    candidate: mockCandidates[1],
    appliedAt: new Date().toISOString(),
    status: "shortlisted",
    matchScore: 92,
    notes: "Excellent machine learning background"
  },
  {
    id: "application-3",
    jobId: "job-2",
    candidate: mockCandidates[2],
    appliedAt: new Date().toISOString(),
    status: "pending",
    matchScore: 75
  }
];

// Mock users
const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Sam Thompson",
    email: "sam.thompson@techinnovate.com",
    role: "recruiter",
    company: "TechInnovate Solutions",
    position: "Technical Recruiter",
    avatar: "https://i.pravatar.cc/150?u=sam"
  },
  {
    id: "user-2",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "candidate",
    avatar: "https://i.pravatar.cc/150?u=alex"
  }
];

// Mock data service
export const mockDataService = {
  // Job descriptions
  getJobs: async () => {
    // Update job statuses based on deadlines
    mockJobs.forEach(job => {
      if (job.status === 'active' && isPast(parseISO(job.deadline))) {
        job.status = 'closed';
      }
    });
    
    return [...mockJobs];
  },
  
  getActiveJobs: async () => {
    return mockJobs.filter(job => job.status === 'active');
  },
  
  getJobById: async (id: string) => {
    const job = mockJobs.find(job => job.id === id);
    if (!job) {
      throw new Error("Job not found");
    }
    return { ...job };
  },
  
  createJob: async (job: Omit<JobDescription, "id" | "createdAt" | "updatedAt" | "status" | "summary">) => {
    const newJob: JobDescription = {
      ...job,
      id: uuidv4(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      summary: await generateJobSummary(job.title, job.responsibilities, job.qualifications)
    };
    
    mockJobs.push(newJob);
    return { ...newJob };
  },
  
  updateJob: async (id: string, updates: Partial<JobDescription>) => {
    const index = mockJobs.findIndex(job => job.id === id);
    if (index === -1) {
      throw new Error("Job not found");
    }
    
    mockJobs[index] = {
      ...mockJobs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockJobs[index] };
  },
  
  deleteJob: async (id: string) => {
    const index = mockJobs.findIndex(job => job.id === id);
    if (index === -1) {
      throw new Error("Job not found");
    }
    
    mockJobs.splice(index, 1);
    return { success: true };
  },
  
  // Applications
  getApplications: async (jobId?: string) => {
    if (jobId) {
      return mockApplications.filter(app => app.jobId === jobId);
    }
    return [...mockApplications];
  },
  
  getApplicationById: async (id: string) => {
    const application = mockApplications.find(app => app.id === id);
    if (!application) {
      throw new Error("Application not found");
    }
    return { ...application };
  },
  
  createApplication: async (jobId: string, candidate: Omit<Candidate, "id">) => {
    const job = mockJobs.find(job => job.id === jobId);
    if (!job) {
      throw new Error("Job not found");
    }
    
    if (job.status !== 'active') {
      throw new Error("This job is no longer accepting applications");
    }
    
    const newCandidate: Candidate = {
      ...candidate,
      id: uuidv4()
    };
    
    const matchScore = calculateMatchScore(job, newCandidate);
    
    const newApplication: JobApplication = {
      id: uuidv4(),
      jobId,
      candidate: newCandidate,
      appliedAt: new Date().toISOString(),
      status: 'pending',
      matchScore
    };
    
    mockApplications.push(newApplication);
    // In a real app, we would send an email confirmation here
    
    return { ...newApplication };
  },
  
  updateApplicationStatus: async (id: string, status: JobApplication['status'], notes?: string) => {
    const index = mockApplications.findIndex(app => app.id === id);
    if (index === -1) {
      throw new Error("Application not found");
    }
    
    mockApplications[index] = {
      ...mockApplications[index],
      status,
      notes: notes || mockApplications[index].notes
    };
    
    // In a real app, we would send email notifications based on status changes
    
    return { ...mockApplications[index] };
  },
  
  // Users
  getCurrentUser: async () => {
    // For demo purposes, default to the recruiter
    return { ...mockUsers[0] };
  }
};

// Utility functions (simulating AI features in frontend for now)
async function generateJobSummary(title: string, responsibilities: string, qualifications: string): Promise<string> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a more comprehensive summary for embedding
  const responsibilitiesExcerpt = responsibilities.substring(0, 150).replace(/\n/g, " ").trim();
  const qualificationsExcerpt = qualifications.substring(0, 150).replace(/\n/g, " ").trim();
  
  const summaryParts = [
    `This ${title} position requires a skilled professional with relevant expertise and experience.`,
    `Key responsibilities include ${responsibilitiesExcerpt}...`,
    `The ideal candidate should possess ${qualificationsExcerpt}...`,
    `This role demands excellent problem-solving abilities, strong communication skills, and the capacity to work effectively in a collaborative environment.`,
    `The position offers opportunities for professional growth while contributing to innovative projects that deliver significant business value.`,
    `The successful candidate will demonstrate technical proficiency, adaptability to changing requirements, and a commitment to continuous learning and improvement.`
  ];
  
  return summaryParts.join(" ");
}

function calculateMatchScore(job: JobDescription, candidate: Candidate): number {
  // Simple matching algorithm based on skills overlap
  const jobSkills = job.skillsRequired.map(skill => skill.toLowerCase());
  const candidateSkills = candidate.skills.map(skill => skill.toLowerCase());
  
  const matchingSkills = candidateSkills.filter(skill => 
    jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
  );
  
  const score = Math.min(100, Math.round((matchingSkills.length / jobSkills.length) * 100));
  return score;
}

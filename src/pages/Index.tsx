import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchIcon, BriefcaseIcon, UsersIcon, RocketIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layouts/MainLayout";
const Index = () => {
  return <MainLayout title="">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-recruit-primary to-recruit-accent text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            AI-Powered Recruitment <span className="block">for the Modern Workforce</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Connect the right talent with the right opportunities using our intelligent matching system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jobs">
              <Button size="lg" variant="default" className="bg-white text-recruit-primary hover:bg-white/90">
                Find Jobs
              </Button>
            </Link>
            <Link to="/recruiter">
              <Button size="lg" variant="outline" className="border-white hover:bg-white/20 font-medium text-orange-200">
                For Recruiters
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-recruit-primary/10 flex items-center justify-center">
                  <SearchIcon className="w-6 h-6 text-recruit-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
                <p className="text-muted-foreground">
                  Our AI engine analyzes resumes and job descriptions to find the perfect matches based on skills, experience, and qualifications.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-recruit-primary/10 flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-recruit-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">JD Summarization</h3>
                <p className="text-muted-foreground">
                  Automatically create concise and effective job descriptions that attract the right candidates while saving time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-recruit-primary/10 flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-recruit-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Candidate Scoring</h3>
                <p className="text-muted-foreground">
                  Get instant candidate match scores to quickly identify the most promising applicants for each position.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="timeline-container pl-12">
                <div className="ml-2 relative mb-8">
                  <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full bg-recruit-primary text-white flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create Job Descriptions</h3>
                  <p className="text-muted-foreground">
                    Recruiters create detailed job descriptions with required qualifications, skills, and experience levels.
                  </p>
                </div>
                
                <div className="ml-2 relative mb-8">
                  <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full bg-recruit-primary text-white flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Summarization</h3>
                  <p className="text-muted-foreground">
                    Our AI system analyzes and summarizes job descriptions to highlight key points and attract qualified candidates.
                  </p>
                </div>
                
                <div className="ml-2 relative mb-8">
                  <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full bg-recruit-primary text-white flex items-center justify-center">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Candidate Applications</h3>
                  <p className="text-muted-foreground">
                    Candidates browse jobs, submit resumes, and complete application forms for positions matching their skills.
                  </p>
                </div>
                
                <div className="ml-2 relative">
                  <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full bg-recruit-primary text-white flex items-center justify-center">
                    4
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
                  <p className="text-muted-foreground">
                    The system analyzes resumes, calculates match scores, and helps recruiters identify top candidates.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border">
                <div className="flex items-center mb-4">
                  <RocketIcon className="w-6 h-6 text-recruit-primary mr-2" />
                  <h3 className="text-xl font-semibold">Benefits</h3>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">✓</span>
                    <span>Save 80% of time spent on screening resumes</span>
                  </li>
                  <li className="flex">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">✓</span>
                    <span>Increase quality of hire through AI-powered matching</span>
                  </li>
                  <li className="flex">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">✓</span>
                    <span>Automatically manage job postings and deadlines</span>
                  </li>
                  <li className="flex">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">✓</span>
                    <span>Reduce bias in the hiring process</span>
                  </li>
                  <li className="flex">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">✓</span>
                    <span>Streamline the entire recruitment workflow</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-recruit-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Recruitment Process?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join organizations using AI-Recruit to find the perfect candidates faster and more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jobs">
              <Button size="lg" variant="default" className="bg-white text-recruit-secondary hover:bg-white/90">
                Browse Jobs
              </Button>
            </Link>
            <Link to="/recruiter">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>;
};
export default Index;
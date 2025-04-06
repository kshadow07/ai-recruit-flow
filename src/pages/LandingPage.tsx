
import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Briefcase, 
  Users, 
  FileText, 
  LightbulbIcon,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero section */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              AI-Powered Recruitment
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Talent Acquisition <span className="text-secondary-foreground">Simplified</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              AI-Recruit uses artificial intelligence to streamline your hiring process, 
              match candidates to positions, and help you build your dream team faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-primary font-medium"
                asChild
              >
                <Link to="/jobs">
                  Find Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                asChild
              >
                <Link to="/recruiter">
                  Recruiter Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-2">Our Platform</Badge>
            <h2 className="text-3xl font-bold mb-4">Recruit Smarter, Not Harder</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Streamline your recruitment process with AI-powered tools designed to save you time and find better matches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-t-4 border-t-blue-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="p-4 bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Job Matching</h3>
                <p className="text-muted-foreground">
                  Our advanced algorithms match candidates with suitable positions based on skills, experience, and preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-t-4 border-t-green-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="p-4 bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Candidate Screening</h3>
                <p className="text-muted-foreground">
                  Automated screening saves you hours by identifying top candidates before you even review their applications.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-t-4 border-t-purple-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="p-4 bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <LightbulbIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Analytics</h3>
                <p className="text-muted-foreground">
                  Gain insights into your hiring process with detailed analytics and reporting on recruitment performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-2">The Process</Badge>
            <h2 className="text-3xl font-bold mb-4">How AI-Recruit Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes recruitment simple, efficient, and effective for both recruiters and job seekers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Create Job Listing</h3>
              <p className="text-muted-foreground">
                Post detailed job descriptions with required skills and qualifications.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">AI Screening</h3>
              <p className="text-muted-foreground">
                Our AI analyzes applications and ranks candidates by match score.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Interview Process</h3>
              <p className="text-muted-foreground">
                Review top candidates and conduct interviews with pre-screened applicants.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">Hire Top Talent</h3>
              <p className="text-muted-foreground">
                Make confident hiring decisions backed by data and AI insights.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="mb-6 lg:mb-0 lg:mr-8">
                <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
                <p className="text-muted-foreground max-w-xl">
                  Join thousands of companies who have streamlined their recruitment process and found better candidates faster with AI-Recruit.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link to="/recruiter">
                    Recruiter Sign Up
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/jobs">
                    Browse Jobs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4">For Recruiters</Badge>
              <h2 className="text-3xl font-bold mb-6">Hire Smarter and Faster</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-lg">80% Time Savings</h3>
                    <p className="text-muted-foreground">
                      Reduce time spent on manual resume screening and focus on high-value candidates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-lg">Better Matches</h3>
                    <p className="text-muted-foreground">
                      AI-powered matching ensures you find candidates who truly fit your requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-lg">Reduced Bias</h3>
                    <p className="text-muted-foreground">
                      Our algorithms focus on skills and qualifications, helping create a more diverse workforce.
                    </p>
                  </div>
                </div>
              </div>
              <Button className="mt-6" asChild>
                <Link to="/recruiter">
                  Start Recruiting
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div>
              <Badge className="mb-4">For Job Seekers</Badge>
              <h2 className="text-3xl font-bold mb-6">Find Your Perfect Role</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-lg">Personalized Matches</h3>
                    <p className="text-muted-foreground">
                      Get matched with jobs that align with your skills, experience, and career goals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-lg">Application Insights</h3>
                    <p className="text-muted-foreground">
                      Understand how your profile matches each job and improve your chances of success.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-lg">Career Growth</h3>
                    <p className="text-muted-foreground">
                      Discover opportunities that help you advance your career and develop new skills.
                    </p>
                  </div>
                </div>
              </div>
              <Button className="mt-6" asChild>
                <Link to="/jobs">
                  Find Jobs
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">AI-Recruit</h2>
              <p className="text-gray-400 mt-2">AI-powered recruitment platform</p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h3 className="font-semibold mb-3">Platform</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
                  <li><Link to="/recruiter" className="hover:text-white transition-colors">Recruiter Portal</Link></li>
                  <li><Link to="/my-applications" className="hover:text-white transition-colors">My Applications</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} AI-Recruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

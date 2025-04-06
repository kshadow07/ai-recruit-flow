
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Users, Award, Globe, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-recruit-primary">AI-Recruit</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/jobs">
              <Button variant="ghost" className="hidden sm:inline-flex">Browse Jobs</Button>
            </Link>
            <Link to="/recruiter">
              <Button variant="outline" className="hidden sm:inline-flex">For Recruiters</Button>
            </Link>
            <Link to="/jobs">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Smart Hiring with <span className="text-recruit-primary">AI-Powered</span> Matching
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-600 leading-relaxed">
                Connect top talent with the perfect roles using our intelligent recruitment platform that matches skills and experience with precision.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/jobs">
                  <Button size="lg" className="w-full sm:w-auto">
                    Find Jobs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/recruiter">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Post a Job
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="ml-4 text-sm text-gray-600">Join thousands of job seekers & recruiters</p>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Recruitment" 
                className="rounded-2xl shadow-2xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How AI-Recruit Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform uses advanced AI to match candidates with positions for the perfect fit
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="h-8 w-8 text-recruit-primary" />,
                title: "AI-Powered Matching",
                description: "Our intelligent algorithm analyzes skills and experience to find the best fit for every position"
              },
              {
                icon: <Users className="h-8 w-8 text-recruit-primary" />,
                title: "Streamlined Applications",
                description: "Simple application process helps candidates showcase their talents efficiently"
              },
              {
                icon: <Award className="h-8 w-8 text-recruit-primary" />,
                title: "Quality Candidates",
                description: "Focus on relevant skills and experience to bring you the best talent"
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-recruit-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Companies" },
              { number: "10,000+", label: "Job Seekers" },
              { number: "2,500+", label: "Jobs Posted" },
              { number: "95%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-bold">{stat.number}</p>
                <p className="mt-2 text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* For Job Seekers & Recruiters */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">For Job Seekers</h3>
              <ul className="space-y-4">
                {[
                  "Discover opportunities matching your skills",
                  "Get insights on your application status",
                  "Receive notifications for high match roles",
                  "Track all your applications in one place"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/jobs">
                  <Button>Browse Open Positions</Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-purple-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">For Recruiters</h3>
              <ul className="space-y-4">
                {[
                  "Post jobs and get AI-matched candidates",
                  "Review applications with intelligent scoring",
                  "Manage hiring workflow efficiently",
                  "Communicate with candidates seamlessly"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/recruiter">
                  <Button>Post a Job</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to Transform Your Hiring?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join AI-Recruit today and experience the future of recruitment with our intelligent matching platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jobs">
              <Button size="lg">
                Find Jobs
              </Button>
            </Link>
            <Link to="/recruiter">
              <Button size="lg" variant="outline">
                For Recruiters
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl text-white">AI-Recruit</span>
              </Link>
              <p className="mt-4 text-gray-400">
                Transforming recruitment with AI-powered matching technology.
              </p>
              <div className="flex space-x-4 mt-6">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">{social}</span>
                    <Globe className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">For Job Seekers</h5>
              <ul className="space-y-3">
                {["Browse Jobs", "Create Profile", "Application Status", "Career Resources"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">For Employers</h5>
              <ul className="space-y-3">
                {["Post a Job", "Browse Candidates", "Pricing", "Enterprise Solutions"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-3">
                {["About Us", "Blog", "Contact", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AI-Recruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

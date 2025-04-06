
import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  Search, 
  Briefcase, 
  Building,
  FilesIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout = ({ children, title = "AI-Recruit" }: MainLayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate authentication - in a real app, this would use proper auth
    const email = localStorage.getItem("user_email");
    setUserEmail(email);
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="mr-4 md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] p-0">
                <div className="px-6 py-8 border-b">
                  <Link to="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl text-recruit-primary">AI-Recruit</span>
                  </Link>
                </div>
                <nav className="p-6">
                  <Link
                    to="/jobs"
                    className={`flex items-center py-3 px-3 rounded-md mb-1 font-medium transition-colors ${
                      location.pathname === "/jobs"
                        ? "bg-recruit-primary text-white"
                        : "text-recruit-secondary hover:bg-recruit-primary/10"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Briefcase className="w-5 h-5 mr-3" />
                    Browse Jobs
                  </Link>
                  
                  {userEmail && (
                    <Link
                      to="/my-applications"
                      className={`flex items-center py-3 px-3 rounded-md mb-1 font-medium transition-colors ${
                        location.pathname === "/my-applications"
                          ? "bg-recruit-primary text-white"
                          : "text-recruit-secondary hover:bg-recruit-primary/10"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FilesIcon className="w-5 h-5 mr-3" />
                      My Applications
                    </Link>
                  )}
                  
                  <div className="pt-4 pb-2 border-t mt-2 text-muted-foreground text-sm">
                    Recruiter Options
                  </div>
                  
                  <Link
                    to="/recruiter"
                    className={`flex items-center py-3 px-3 rounded-md mb-1 font-medium transition-colors ${
                      location.pathname.startsWith("/recruiter")
                        ? "bg-recruit-primary text-white"
                        : "text-recruit-secondary hover:bg-recruit-primary/10"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Building className="w-5 h-5 mr-3" />
                    Recruiter Dashboard
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-recruit-primary">AI-Recruit</span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 px-6">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for jobs..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/jobs">
                <Button 
                  variant={location.pathname === "/jobs" ? "default" : "ghost"}
                  className="font-medium"
                >
                  Browse Jobs
                </Button>
              </Link>
              
              {userEmail && (
                <Link to="/my-applications">
                  <Button 
                    variant={location.pathname === "/my-applications" ? "default" : "ghost"}
                    className="font-medium"
                  >
                    My Applications
                  </Button>
                </Link>
              )}
              
              <Link to="/recruiter">
                <Button variant="outline">For Recruiters</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {title && (
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
          </div>
        )}
        {children}
      </main>
      
      <footer className="border-t bg-white py-4">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} AI-Recruit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

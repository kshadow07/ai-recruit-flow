
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { User, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout = ({ children, title = "AI-Powered Recruitment" }: MainLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-recruit-primary">AI-Recruit</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-4">
              <Link to="/" className="text-foreground/80 hover:text-recruit-primary transition-colors">
                Home
              </Link>
              <Link to="/jobs" className="text-foreground/80 hover:text-recruit-primary transition-colors">
                Find Jobs
              </Link>
              <Link to="/recruiter" className="text-foreground/80 hover:text-recruit-primary transition-colors">
                For Recruiters
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?u=user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link 
                  to="/" 
                  className="text-foreground/80 hover:text-recruit-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/jobs" 
                  className="text-foreground/80 hover:text-recruit-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link 
                  to="/recruiter" 
                  className="text-foreground/80 hover:text-recruit-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Recruiters
                </Link>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?u=user" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Guest User</p>
                      <p className="text-sm text-muted-foreground">guest@example.com</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start mt-2" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
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
      
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">AI-Recruit</h3>
              <p className="text-muted-foreground">
                Leveraging AI to connect the right talent with the right opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/jobs" className="text-muted-foreground hover:text-recruit-primary transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/recruiter" className="text-muted-foreground hover:text-recruit-primary transition-colors">
                    For Recruiters
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-recruit-primary transition-colors">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <address className="not-italic text-muted-foreground">
                <p>123 Recruitment Ave</p>
                <p>San Francisco, CA 94103</p>
                <p className="mt-2">support@ai-recruit.example</p>
              </address>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AI-Recruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

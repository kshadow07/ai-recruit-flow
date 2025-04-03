
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Briefcase, 
  Users, 
  PlusCircle, 
  Archive, 
  Settings, 
  LogOut, 
  Menu, 
  Bell,
  Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RecruiterLayoutProps {
  children: ReactNode;
  title?: string;
}

const RecruiterLayout = ({ children, title = "Recruiter Dashboard" }: RecruiterLayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: "Dashboard", path: "/recruiter", icon: <Briefcase className="w-5 h-5 mr-3" /> },
    { name: "Create Job", path: "/recruiter/create-job", icon: <PlusCircle className="w-5 h-5 mr-3" /> },
    { name: "Applications", path: "/recruiter/applications", icon: <Users className="w-5 h-5 mr-3" /> },
    { name: "Archive", path: "/recruiter/archive", icon: <Archive className="w-5 h-5 mr-3" /> },
  ];
  
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
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center py-3 px-3 rounded-md mb-1 font-medium transition-colors",
                        isActive(item.path)
                          ? "bg-recruit-primary text-white"
                          : "text-recruit-secondary hover:bg-recruit-primary/10"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="hidden md:flex items-center space-x-2">
              <span className="font-bold text-xl text-recruit-primary">AI-Recruit</span>
            </Link>
          </div>
          
          <div className="relative hidden md:block max-w-md w-full mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search jobs, candidates..."
              className="pl-10 w-full"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=recruiter" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-white hidden md:block shrink-0">
          <nav className="p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center py-3 px-3 rounded-md mb-1 font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-recruit-primary text-white"
                    : "text-recruit-secondary hover:bg-recruit-primary/10"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1">
          {title && (
            <div className="bg-white border-b">
              <div className="container mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold">{title}</h1>
              </div>
            </div>
          )}
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      
      <footer className="border-t bg-white py-4">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} AI-Recruit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RecruiterLayout;

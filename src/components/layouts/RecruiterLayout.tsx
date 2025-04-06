
import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Users, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Menu, 
  Bell,
  Search,
  LayoutDashboard, 
  ChevronRight,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecruiterLayoutProps {
  children: ReactNode;
  title?: string;
}

const RecruiterLayout = ({ children, title = "Recruiter Dashboard" }: RecruiterLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { 
      name: "Dashboard", 
      path: "/recruiter", 
      icon: <LayoutDashboard className="w-5 h-5" />,
      count: 0
    },
    { 
      name: "Create Job", 
      path: "/recruiter/create-job", 
      icon: <PlusCircle className="w-5 h-5" />,
      count: 0
    },
    { 
      name: "Applications", 
      path: "/recruiter/applications", 
      icon: <Users className="w-5 h-5" />,
      count: 12
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log("Searching for:", searchQuery);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col">
      <header className="border-b bg-white sticky top-0 z-10 h-16 shadow-sm">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <div className="flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="mr-4 md:hidden">
                <Button variant="ghost" size="icon" className="relative">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <Link to="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl text-primary">AI-Recruit</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="py-4">
                  <nav className="space-y-1 px-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center justify-between py-2.5 px-3 rounded-md text-sm font-medium transition-colors",
                          isActive(item.path)
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          {item.name}
                        </div>
                        {item.count > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.count}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-primary hidden sm:inline">AI-Recruit</span>
              <span className="font-bold text-xl text-primary sm:hidden">AI-R</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-lg mx-6 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Input
                placeholder="Search jobs, candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" 
              />
            </form>
          </div>
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=recruiter" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-16 md:w-64 border-r bg-white fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-10 hidden md:block transition-all duration-300">
          <nav className="p-2 md:p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between py-2.5 px-3 rounded-md text-sm font-medium mb-1 transition-colors group",
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  <span className="hidden md:inline">{item.name}</span>
                </div>
                {item.count > 0 && (
                  <Badge variant={isActive(item.path) ? "secondary" : "default"} className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1 md:ml-16 lg:ml-64">
          <div className="min-h-screen">
            {children}
          </div>
          
          <footer className="border-t bg-white py-4 px-4 mt-auto">
            <div className="container mx-auto text-center text-xs text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} AI-Recruit. All rights reserved.</p>
            </div>
          </footer>
        </main>
      </div>
      
      {/* Mobile Search Button (shown only on mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-20">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-xl"
          onClick={() => {
            // Toggle mobile search
          }}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default RecruiterLayout;

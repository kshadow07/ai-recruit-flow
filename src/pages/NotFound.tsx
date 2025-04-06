
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-7xl font-bold text-purple-600 mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. It might have been removed, 
          renamed, or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

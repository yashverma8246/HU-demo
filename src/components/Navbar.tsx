import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  return (
    <nav className="border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Hacker's Unity
            </h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => {
                  navigate('/');
                  window.scrollTo(0, 0);
                }}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => {
                  navigate('/events');
                  window.scrollTo(0, 0);
                }}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                All Events
              </button>
              <button 
                onClick={() => {
                  navigate('/leaderboard');
                  window.scrollTo(0, 0);
                }}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Leaderboard
              </button>
              <button 
                onClick={() => {
                  navigate('/community');
                  window.scrollTo(0, 0);
                }}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Community
              </button>
              <button 
                onClick={() => {
                  navigate('/resources');
                  window.scrollTo(0, 0);
                }}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Resources
              </button>
              {session && (
                <button 
                  onClick={() => {
                    navigate('/calendar');
                    window.scrollTo(0, 0);
                  }}
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  Calendar
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    navigate('/submit-project');
                    window.scrollTo(0, 0);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Submit Project
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate('/dashboard');
                    window.scrollTo(0, 0);
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2"
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                    window.scrollTo(0, 0);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => {
                navigate('/signin');
                window.scrollTo(0, 0);
              }}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
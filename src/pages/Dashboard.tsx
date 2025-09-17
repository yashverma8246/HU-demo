import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Github, Globe, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getProjectsByUser } from "@/lib/supabase";

interface Project {
  id: string;
  title: string;
  description: string;
  repo_url: string;
  demo_url: string | null;
  tech_stack: string;
  created_at: string;
  user_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!session) {
      toast.error("You must be signed in to view your dashboard");
      navigate("/signin");
      return;
    }

    // Fetch user's projects
    const fetchProjects = async () => {
      try {
        const { data, error } = await getProjectsByUser(session.user.id);
        if (error) throw error;
        setProjects(data || []);
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load your projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10 -z-10 rounded-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%, rgba(168,85,247,0.1)_0%, transparent_50%)] -z-10 rounded-3xl"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <Button 
            variant="cta" 
            onClick={() => navigate("/submit-project")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Submit New Project
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/20 shadow-card rounded-xl">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  You haven't submitted any projects yet. Start showcasing your work by submitting your first project.
                </p>
                <Button 
                  variant="cta" 
                  onClick={() => navigate("/submit-project")}
                >
                  Submit Your First Project
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/20 shadow-card rounded-xl">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your Event Calendar</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Keep track of upcoming hackathons, workshops, and events. Add events to your personal calendar.
                </p>
                <Button 
                  variant="cta" 
                  onClick={() => navigate("/calendar")}
                >
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-card border-border/20 shadow-card col-span-1 rounded-xl">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Your Event Calendar</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Keep track of upcoming hackathons and events
                  </p>
                  <Button 
                    variant="cta" 
                    onClick={() => navigate("/calendar")}
                  >
                    View Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              My Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-gradient-card border-border/20 shadow-card hover:shadow-lg transition-all duration-300 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tech_stack.split(',').map((tech, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 flex-1"
                    onClick={() => window.open(project.repo_url, "_blank")}
                  >
                    <Github className="w-4 h-4" />
                    Repository
                  </Button>
                  {project.demo_url && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 flex-1"
                      onClick={() => window.open(project.demo_url!, "_blank")}
                    >
                      <Globe className="w-4 h-4" />
                      Demo
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
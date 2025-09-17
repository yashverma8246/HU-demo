import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Link, FileText, Github, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { submitProject } from "@/lib/supabase";

// Define form validation schema
const projectSchema = z.object({
  title: z.string().min(3, { message: "Project title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  repoUrl: z.string().url({ message: "Please enter a valid GitHub repository URL" }),
  demoUrl: z.string().url({ message: "Please enter a valid demo URL" }).optional().or(z.literal("")),
  techStack: z.string().min(3, { message: "Please list the technologies used" }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectSubmission = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      repoUrl: "",
      demoUrl: "",
      techStack: "",
    },
  });

  // Redirect if not authenticated
  if (!session) {
    toast.error("You must be signed in to submit a project");
    navigate("/signin");
    return null;
  }

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    toast.loading("Submitting your project...");
    
    try {
      const { error } = await submitProject({
        title: data.title,
        description: data.description,
        repo_url: data.repoUrl,
        demo_url: data.demoUrl || null,
        tech_stack: data.techStack,
      }, session.user.id);
      
      if (error) throw error;
      
      toast.dismiss();
      toast.success("Project submitted successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to submit project. Please try again.");
      console.error("Project submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%, rgba(168,85,247,0.1)_0%, transparent_50%)]"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="bg-gradient-card border-border/20 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Submit Your Project
            </CardTitle>
            <CardDescription>
              Share your work with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Project Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Project Title
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your project title" 
                          className="bg-card border-border/30"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Project Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your project in detail" 
                          className="bg-card border-border/30 min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include the problem it solves, features, and your approach.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* GitHub Repository URL */}
                <FormField
                  control={form.control}
                  name="repoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub Repository URL
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/yourusername/your-repo" 
                          className="bg-card border-border/30"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Demo URL (Optional) */}
                <FormField
                  control={form.control}
                  name="demoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Demo URL (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://your-project-demo.com" 
                          className="bg-card border-border/30"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Link to a live demo of your project if available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tech Stack */}
                <FormField
                  control={form.control}
                  name="techStack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Technologies Used
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="React, Node.js, MongoDB, etc." 
                          className="bg-card border-border/30"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        List the main technologies, frameworks, and libraries used
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="cta" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectSubmission;
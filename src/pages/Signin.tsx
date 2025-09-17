import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithEmail } from "@/lib/supabase";

const SignIn = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [loginType, setLoginType] = useState<"email" | "phone" | "username">("email");
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginType !== 'email') {
      toast.error("Only email sign-in is currently supported.");
      return;
    }

    if (!formData.identifier || !formData.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    toast.loading("Signing in...");

    try {
      const { error } = await signInWithEmail(formData.identifier, formData.password);

      if (error) {
        throw error;
      }

      await refreshSession();
      toast.dismiss();
      toast.success("Successfully signed in!");
      navigate('/dashboard');
      window.scrollTo(0, 0);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (loginType) {
      case "email": return "Enter your email";
      case "phone": return "Enter your phone number";
      case "username": return "Enter your username";
      default: return "Enter your email";
    }
  };

  const getIcon = () => {
    switch (loginType) {
      case "email": return Mail;
      case "phone": return Phone;
      case "username": return User;
      default: return Mail;
    }
  };

  const Icon = getIcon();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%, rgba(59,130,246,0.1)_0%, transparent_50%)]"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-gradient-card border-border/20 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your Hacker's Unity account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Login Type Selection */}
              <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLoginType("email")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    loginType === "email" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("phone")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    loginType === "phone" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("username")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    loginType === "username" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Username
                </button>
              </div>

              {/* Identifier Input */}
              <div className="space-y-2">
                <Label htmlFor="identifier" className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {loginType.charAt(0).toUpperCase() + loginType.slice(1)}
                </Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type={loginType === "email" ? "email" : "text"}
                  placeholder={getPlaceholder()}
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                  required
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="hero" className="w-full">
                Sign In
              </Button>

              {/* Register Link */}
              <div className="text-center">
                <span className="text-muted-foreground text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-primary hover:underline font-medium"
                  >
                    Register here
                  </button>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
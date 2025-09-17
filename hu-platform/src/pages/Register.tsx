import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, GraduationCap, Mail, Phone, MapPin, Briefcase, Globe, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signUpWithEmail } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const Register = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    collegeName: "",
    email: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
    githubUrl: "",
    portfolioUrl: "",
    skills: "",
    bio: "",
    yearOfStudy: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate terms acceptance
    if (!formData.acceptTerms) {
      toast.error("You must accept the Terms of Service and Privacy Policy");
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    toast.loading("Creating your account...");
    
    try {
      // Register with Supabase
      const { data, error } = await signUpWithEmail(
        formData.email,
        formData.password,
        {
          name: formData.name,
          college_name: formData.collegeName,
          phone_number: formData.phoneNumber,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          github_url: formData.githubUrl,
          portfolio_url: formData.portfolioUrl,
          skills: formData.skills,
          bio: formData.bio,
          year_of_study: formData.yearOfStudy
        }
      );
      
      if (error) {
        throw error;
      }
      
      toast.dismiss();
      
      // Check if email confirmation is required
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        toast.success("Please check your email to confirm your account");
      } else {
        toast.success("Account created successfully!");
        // Refresh the session to update auth state
        await refreshSession();
        // Redirect to dashboard page
        navigate('/dashboard');
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to create account. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%, rgba(168,85,247,0.1)_0%, transparent_50%)]"></div>
      
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
              Join the Community
            </CardTitle>
            <CardDescription>
              Register for hackathons and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                  required
                />
              </div>

              {/* College Name */}
              <div className="space-y-2">
                <Label htmlFor="collegeName" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  College Name
                </Label>
                <Input
                  id="collegeName"
                  name="collegeName"
                  type="text"
                  placeholder="Enter your college/university name"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                  required
                />
              </div>
              
              {/* Year of Study */}
              <div className="space-y-2">
                <Label htmlFor="yearOfStudy" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Year of Study
                </Label>
                <Select
                  value={formData.yearOfStudy}
                  onValueChange={(value) => handleSelectChange(value, "yearOfStudy")}
                >
                  <SelectTrigger className="bg-card border-border/30">
                    <SelectValue placeholder="Select your year of study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                    <SelectItem value="5">5th Year</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-card border-border/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">
                    State/Province
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Your state/province"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="bg-card border-border/30"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Your country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                />
              </div>

              {/* Social & Portfolio Links */}
              <div className="space-y-2">
                <Label htmlFor="githubUrl" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub URL
                </Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portfolioUrl" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Portfolio/Website URL
                </Label>
                <Input
                  id="portfolioUrl"
                  name="portfolioUrl"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                />
              </div>
              
              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Skills (comma separated)
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="React, Node.js, UI/UX Design, etc."
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                />
              </div>
              
              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">
                  Short Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us a bit about yourself..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="bg-card border-border/30 min-h-[80px]"
                />
              </div>
              
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password (min. 8 characters)"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-card border-border/30"
                  required
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="acceptTerms" 
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, "acceptTerms")}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                  <p className="text-sm text-muted-foreground">
                    <button type="button" className="text-primary hover:underline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-primary hover:underline">
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="cta" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Sign In Link */}
              <div className="text-center">
                <span className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signin")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in here
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

export default Register;
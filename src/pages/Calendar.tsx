import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Calendar from "@/components/Calendar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarIcon, LogIn } from "lucide-react";

const CalendarPage = () => {
  const { session } = useAuth();

  // If user is not authenticated, show login prompt
  if (!session) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)]">
          <div className="max-w-2xl mx-auto text-center">
            <CalendarIcon className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Your Personal Event Calendar
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Sign in to view and manage your personal event calendar. Add hackathons, workshops, and other events to keep track of your schedule.
            </p>
            <Button size="lg" onClick={() => window.location.href = "/signin"}>
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to View Calendar
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Your Calendar
          </h1>
          <p className="text-muted-foreground mb-8">
            Manage your events and keep track of upcoming hackathons
          </p>
          <Calendar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;
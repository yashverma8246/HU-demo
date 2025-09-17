import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // ✅ using sonner for toast
import EventDetailsModal from "./EventDetailsModal";
import { getEvents } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const EventsSection = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Use the auth context instead of local state
  const { session } = useAuth();
  const isAuthenticated = !!session;

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Hacker's Unity 2025 Spring Hackathon",
      description:
        "Build innovative solutions for real-world problems in 36 hours. Join developers worldwide to create impactful technology.",
      status: "LIVE",
      statusColor: "bg-success",
      type: "Hackathon",
      prizePool: "₹1,50,000",
      participants: "850/1000",
      location: "Delhi NCR",
      date: "20 Dec",
      start_date: "2025-12-20T09:00:00",
      end_date: "2025-12-22T18:00:00",
      teamSize: "1-4 members",
      tags: ["Open Innovation", "Healthcare", "Education", "Sustainability"],
    },
    {
      id: 2,
      title: "AI Innovation Challenge 2025",
      description:
        "Leverage AI to create solutions that matter. Build intelligent systems that solve real-world challenges using cutting-edge technology.",
      status: "UPCOMING",
      statusColor: "bg-info",
      type: "Challenge",
      prizePool: "₹2,00,000",
      participants: "420/500",
      location: "Hybrid",
      date: "29 Mar",
      start_date: "2025-03-29T10:00:00",
      end_date: "2025-03-31T17:00:00",
      teamSize: "1-4 members",
      tags: ["AI/ML", "Computer Vision", "NLP", "Data Science"],
    },
    {
      id: 3,
      title: "Blockchain Builders Bootcamp",
      description:
        "Create the next generation of decentralized applications. Learn and build with Web3 technologies, smart contracts, and DeFi protocols.",
      status: "UPCOMING",
      statusColor: "bg-warning",
      type: "Bootcamp",
      prizePool: "₹3,00,000",
      participants: "1000+",
      location: "Online",
      date: "15 Apr",
      start_date: "2025-04-15T08:00:00",
      end_date: "2025-04-17T20:00:00",
      teamSize: "1-4 members",
      tags: ["Blockchain", "DeFi", "Web3", "Smart Contracts"],
    },
  ]);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await getEvents();
      if (error) {
        console.error("Error fetching events:", error);
        // Don't show error toast, just use default events silently
        return;
      }
      
      if (data && data.length > 0) {
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      // Silently fall back to default events
    } finally {
      setLoading(false);
    }
  };

  const filters = ["All Events", "Live", "Upcoming", "Completed"];

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (filter !== "All Events") {
      filtered = filtered.filter(
        (event) => event.status.toLowerCase() === filter.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
  }, [events, filter, searchQuery]);

  const handleEventDetails = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in first to register for events");
      navigate("/signin"); // ✅ fixed path to match your App.tsx
    } else {
      toast.success("Registration functionality coming soon!");
    }
  };
  
  const handleAddToCalendar = async (event: any) => {
    if (!session) {
      toast.error("Please sign in to add events to your calendar");
      navigate("/signin");
      return;
    }
    
    try {
      // Navigate to calendar page instead
      navigate("/calendar");
      toast.success(`View your calendar to manage events`);
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      toast.error("Failed to add event to calendar");
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events, technologies, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border/30"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((filterName) => (
              <Button
                key={filterName}
                variant={filter === filterName ? "default" : "outline"}
                onClick={() => setFilter(filterName)}
                className="whitespace-nowrap"
              >
                {filterName}
              </Button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-card p-6 rounded-xl border border-border/20 hover:shadow-glow transition-all duration-300 group flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium text-white ${event.statusColor}`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {event.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-success">
                    {event.prizePool}
                  </div>
                  <div className="text-xs text-muted-foreground">Prize Pool</div>
                </div>
              </div>

              {/* Title and Description */}
              <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {event.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 flex-grow">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Participants</span>
                  <span className="font-medium">{event.participants}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{event.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="font-medium">{event.teamSize}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Event Status Banner */}
              {event.status === "LIVE" && (
                <div className="bg-success/20 border border-success/30 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    Event is LIVE!
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleRegisterClick}
                >
                  {isAuthenticated ? "Register Now" : "Sign in to Register"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEventDetails(event)}
                >
                  Details
                </Button>
                {isAuthenticated && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAddToCalendar(event)}
                  >
                    Add to Calendar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Event Details Modal */}
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  );
};

export default EventsSection;

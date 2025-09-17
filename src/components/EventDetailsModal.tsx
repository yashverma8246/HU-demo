import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Users, Trophy, Clock, Share2, Copy, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { addEventToCalendar } from "@/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  type: string;
  prizePool: string;
  participants: string;
  location: string;
  date: string;
  teamSize: string;
  tags: string[];
  fullDescription?: string;
  startTime?: string;
  endTime?: string;
  requirements?: string[];
  rules?: string[];
}

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal = ({ event, isOpen, onClose }: EventDetailsModalProps) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  if (!event) return null;
  
  const shareUrl = `${window.location.origin}/events/${event.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-card border-border/20">
        <DialogHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${event.statusColor}`}>
                  {event.status}
                </span>
                <div className="text-sm text-muted-foreground mt-1 font-medium">{event.type}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">{event.prizePool}</div>
              <div className="text-sm text-muted-foreground">Prize Pool</div>
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-lg">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Date</span>
              </div>
              <div className="font-semibold">{event.date}</div>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <div className="font-semibold">{event.location}</div>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Team Size</span>
              </div>
              <div className="font-semibold">{event.teamSize}</div>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Participants</span>
              </div>
              <div className="font-semibold">{event.participants}</div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Technologies & Themes</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About This Event</h3>
            <div className="text-muted-foreground space-y-3">
              <p>
                {event.fullDescription || event.description + " Join this exciting event and showcase your skills while building innovative solutions that matter. Connect with like-minded developers, learn from industry experts, and compete for amazing prizes."}
              </p>
              <p>
                This event brings together talented individuals from diverse backgrounds to collaborate, innovate, and create meaningful impact through technology. Whether you're a seasoned developer or just starting your journey, this is your opportunity to shine.
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Valid student ID or professional experience in technology</li>
              <li>Basic knowledge of programming and development tools</li>
              <li>Laptop with required development environment</li>
              <li>Team formation (individual participation allowed for some events)</li>
              <li>Commitment to attend the full duration of the event</li>
            </ul>
          </div>

          {/* Rules */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Event Rules</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Original code and ideas only - no pre-built solutions</li>
              <li>All team members must be registered participants</li>
              <li>Projects must be submitted within the deadline</li>
              <li>Code must be publicly available (GitHub repository required)</li>
              <li>Follow the code of conduct and respect other participants</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="hero" 
              className="flex-1"
              onClick={() => {
                if (!session) {
                  toast.error("Please sign in first to register for events");
                  navigate("/signin");
                } else {
                  toast.success("Registration functionality coming soon!");
                }
              }}
            >
              {session ? "Register to participate" : "Sign in to register"}
            </Button>
            <Button 
              variant="outline"
              onClick={async () => {
                if (!session) {
                  toast.error("Please sign in to add events to your calendar");
                  return;
                }
                
                try {
                  if (!session || !session.user) {
                    toast.error("Please sign in to add events to your calendar");
                    return;
                  }
                  
                  const { error } = await addEventToCalendar(session.user.id, String(event.id));
                  if (error) throw error;
                  
                  toast.success(`${event.title} added to your calendar`);
                } catch (error: any) {
                  console.error("Error adding event to calendar:", error);
                  toast.error("Failed to add event to calendar");
                }
              }}
            >
              Add to Calendar
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Event
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Share this event</h4>
                  <p className="text-sm text-muted-foreground">Anyone with this link can view the event details</p>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={shareUrl} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={handleCopyLink}
                      className="flex-shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
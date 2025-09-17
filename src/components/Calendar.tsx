import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, ExternalLink } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO, isToday, isSameMonth, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getUserCalendarEvents, removeEventFromCalendar } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  type: string;
  status: string;
}

const Calendar = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchCalendarEvents();
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [session]);

  const fetchCalendarEvents = async () => {
    setLoading(true);
    try {
      if (!session || !session.user) {
        setEvents([]);
        return;
      }
      
      const { data, error } = await getUserCalendarEvents(session.user.id);
      if (error) throw error;
      
      // Transform the data to get the events
      const calendarEvents = data?.map((item: any) => item.events) || [];
      setEvents(calendarEvents);
    } catch (error: any) {
      console.error("Error fetching calendar events:", error);
      toast.error("Failed to load calendar events");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCalendar = async (eventId: string) => {
    try {
      if (!session || !session.user) {
        toast.error("You must be logged in to remove events");
        return;
      }
      
      const { error } = await removeEventFromCalendar(session.user.id, eventId);
      if (error) throw error;
      
      // Update the local state
      setEvents(events.filter(event => event.id !== eventId));
      setSelectedEvent(null);
      toast.success("Event removed from calendar");
    } catch (error: any) {
      console.error("Error removing event from calendar:", error);
      toast.error("Failed to remove event from calendar");
    }
  };

  // Filter events for the current month
  const currentMonthEvents = events.filter(event => {
    const eventDate = parseISO(event.start_date);
    return isSameMonth(eventDate, date);
  });

  // Function to check if a date has events
  const hasEventOnDate = (day: Date) => {
    return events.some(event => {
      const eventDate = parseISO(event.start_date);
      return isSameDay(eventDate, day);
    });
  };

  // Function to get events for a specific date
  const getEventsForDate = (day: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start_date);
      return isSameDay(eventDate, day);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar View */}
        <div className="md:w-1/2">
          <Card className="bg-gradient-card border-border/20 shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Your Calendar
              </CardTitle>
              <CardDescription>
                Manage your upcoming events and hackathons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setMonth(date.getMonth() - 1);
                    setDate(newDate);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">
                  {format(date, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setMonth(date.getMonth() + 1);
                    setDate(newDate);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
                components={{
                  Day: ({ date: day, ...props }: any) => {
                    const hasEvent = hasEventOnDate(day);
                    return (
                      <button
                        {...props}
                        className={cn(
                          props.className as string,
                          hasEvent && 'relative',
                          hasEvent && 'bg-primary/10 text-primary font-medium',
                          isToday(day) && 'bg-primary text-primary-foreground'
                        )}
                        onClick={() => {
                          setDate(day);
                          const eventsOnDay = getEventsForDate(day);
                          if (eventsOnDay.length > 0) {
                            setSelectedEvent(eventsOnDay[0]);
                          } else {
                            setSelectedEvent(null);
                          }
                        }}
                      >
                        {format(day, 'd')}
                        {hasEvent && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                        )}
                      </button>
                    );
                  },
                }}
              />

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  Events for {format(date, 'MMMM d, yyyy')}
                </h3>
                <div className="space-y-2">
                  {getEventsForDate(date).length > 0 ? (
                    getEventsForDate(date).map((event) => (
                      <div 
                        key={event.id} 
                        className="p-3 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(parseISO(event.start_date), 'h:mm a')} - {format(parseISO(event.end_date), 'h:mm a')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No events scheduled for this day
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Details */}
        <div className="md:w-1/2">
          <Card className="bg-gradient-card border-border/20 shadow-card h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Event Details
              </CardTitle>
              <CardDescription>
                View and manage your selected event
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEvent ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedEvent.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {format(parseISO(selectedEvent.start_date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Start Time</div>
                      <div>{format(parseISO(selectedEvent.start_date), 'h:mm a')}</div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">End Time</div>
                      <div>{format(parseISO(selectedEvent.end_date), 'h:mm a')}</div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Location</div>
                      <div>{selectedEvent.location}</div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Type</div>
                      <div>{selectedEvent.type}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/events/${selectedEvent.id}`)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Event
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleRemoveFromCalendar(selectedEvent.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove from Calendar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <CalendarIcon className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Event Selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a date with an event to view details or browse all events to add to your calendar
                  </p>
                  <Button onClick={() => navigate('/events')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Events
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Your Upcoming Events
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : currentMonthEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMonthEvents.map((event) => (
              <Card key={event.id} className="bg-gradient-card border-border/20 shadow-card hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-${event.status === 'LIVE' ? 'success' : event.status === 'UPCOMING' ? 'info' : 'warning'}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(parseISO(event.start_date), 'MMM d')}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(parseISO(event.start_date), 'h:mm a')} - {format(parseISO(event.end_date), 'h:mm a')}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setDate(parseISO(event.start_date));
                      setSelectedEvent(event);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary/20 rounded-lg border border-border/20">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You don't have any events added to your calendar for this month. Browse all events to find and add some!
            </p>
            <Button onClick={() => navigate('/events')}>
              Browse Events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
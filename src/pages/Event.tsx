import Navbar from "@/components/Navbar";
import EventsSection from "@/components/EventSection";
import Footer from "@/components/Footer";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            All Events
          </h1>
          <p className="text-muted-foreground mb-8">
            Discover hackathons, challenges, and bootcamps to showcase your skills
          </p>
        </div>
        <EventsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Events;
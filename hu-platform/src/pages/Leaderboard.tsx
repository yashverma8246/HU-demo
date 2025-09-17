import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Medal, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Leaderboard = () => {
  const topPerformers = [
    { rank: 1, name: "Alex Chen", points: 2850, events: 12, icon: Trophy, color: "text-warning" },
    { rank: 2, name: "Sarah Kumar", points: 2640, events: 11, icon: Medal, color: "text-muted-foreground" },
    { rank: 3, name: "Dev Patel", points: 2420, events: 10, icon: Award, color: "text-accent" },
    { rank: 4, name: "Maya Singh", points: 2180, events: 9, icon: Users, color: "text-info" },
    { rank: 5, name: "Raj Sharma", points: 1950, events: 8, icon: Users, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See who's leading the innovation race in our community
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-card rounded-xl border border-border/20 overflow-hidden">
              <div className="p-6 border-b border-border/20">
                <h2 className="text-2xl font-bold text-foreground">Top Performers</h2>
                <p className="text-muted-foreground">Rankings based on hackathon participation and achievements</p>
              </div>
              
              <div className="space-y-0">
                {topPerformers.map((performer) => {
                  const Icon = performer.icon;
                  return (
                    <div key={performer.rank} className="flex items-center justify-between p-6 border-b border-border/10 last:border-b-0 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-card border border-border/30`}>
                          <Icon className={`w-6 h-6 ${performer.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{performer.name}</h3>
                          <p className="text-sm text-muted-foreground">#{performer.rank} • {performer.events} events participated</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-success">{performer.points}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 bg-secondary/20">
                <Button variant="hero" className="w-full">
                  View Full Rankings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;
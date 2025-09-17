import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Users, Code, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Community = () => {
  const communityStats = [
    { label: "Active Members", value: "2.5K+", icon: Users, color: "text-info" },
    { label: "Discussions", value: "1.2K", icon: MessageCircle, color: "text-success" },
    { label: "Code Shares", value: "850", icon: Code, color: "text-accent" },
    { label: "Resources", value: "300+", icon: BookOpen, color: "text-warning" },
  ];

  const discussionTopics = [
    { title: "Web3 Development Best Practices", replies: 47, category: "Blockchain" },
    { title: "AI/ML Model Optimization Tips", replies: 32, category: "Machine Learning" },
    { title: "React Performance Techniques", replies: 28, category: "Frontend" },
    { title: "Database Design for Scale", replies: 24, category: "Backend" },
    { title: "DevOps Pipeline Setup", replies: 19, category: "DevOps" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Community
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect, collaborate, and learn with fellow developers and innovators
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {communityStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gradient-card p-6 rounded-xl border border-border/20">
                  <Icon className={`w-8 h-8 ${stat.color} mb-3`} />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Discussion Topics */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-card rounded-xl border border-border/20 overflow-hidden">
              <div className="p-6 border-b border-border/20">
                <h2 className="text-2xl font-bold text-foreground">Popular Discussions</h2>
                <p className="text-muted-foreground">Join the conversation on trending topics</p>
              </div>
              
              <div className="space-y-0">
                {discussionTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-6 border-b border-border/10 last:border-b-0 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{topic.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">{topic.category}</span>
                        <span className="text-sm text-muted-foreground">{topic.replies} replies</span>
                      </div>
                    </div>
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>

              <div className="p-6 bg-secondary/20">
              <a href="https://discord.gg/xcNNqdDhce">
                <Button variant="hero" className="w-full">
                  Join Community Discord
                </Button>
              </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;
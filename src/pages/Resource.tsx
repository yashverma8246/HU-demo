import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Book, Video, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Resources = () => {
  const resourceCategories = [
    {
      title: "Blockchain Projects",
      icon: Book,
      color: "text-info",
      resources: [
        "DeFi Platform Development",
        "Smart Contract Security",
        "NFT Marketplace Building",
        "Cryptocurrency Wallet"
      ]
    },
    {
      title: "AI/ML Projects",
      icon: Video,
      color: "text-warning",
      resources: [
        "Computer Vision Applications",
        "Natural Language Processing",
        "Machine Learning Models",
        "Deep Learning Frameworks"
      ]
    },
    {
      title: "Web Development",
      icon: FileText,
      color: "text-success",
      resources: [
        "Full-stack Applications",
        "Progressive Web Apps",
        "API Development",
        "Frontend Frameworks"
      ]
    },
    {
      title: "Cyber Security",
      icon: FileText,
      color: "text-accent",
      resources: [
        "Penetration Testing Tools",
        "Security Audit Systems",
        "Encryption Protocols",
        "Vulnerability Assessment"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build amazing projects and succeed in hackathons
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {resourceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="bg-gradient-card rounded-xl border border-border/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className={`w-8 h-8 ${category.color}`} />
                    <h2 className="text-xl font-bold text-foreground">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {category.resources.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                        <span className="text-foreground">{resource}</span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
                  >
                    <span>View All</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Featured Resources */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gradient-card rounded-xl border border-border/20 p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Featured Resource</h2>
              <h3 className="text-xl font-semibold text-primary mb-3">Complete Hackathon Preparation Guide</h3>
              <p className="text-muted-foreground mb-6">
                A comprehensive guide covering everything from ideation to deployment, 
                with real examples from winning projects.
              </p>
              <Button 
                variant="hero" 
                className="flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                <span>Download Now</span>
                <FileText className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Resources;
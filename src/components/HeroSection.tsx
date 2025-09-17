import { Users, Trophy, Code, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [typewriterText, setTypewriterText] = useState("");
  const [showMainTitle, setShowMainTitle] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const welcomeText = "Welcome to Hacker's Unity";
  const heroTexts = [
    "Build the Future",
    "Code Tomorrow",
    "Shape Innovation",
    "Create Impact"
  ];

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < welcomeText.length) {
        setTypewriterText(welcomeText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowMainTitle(true), 500);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showMainTitle) return;

    const typeSpeed = 150;
    const deleteSpeed = 100;
    const pauseTime = 2000;

    const timer = setTimeout(() => {
      const currentText = heroTexts[currentTextIndex];
      
      if (!isDeleting) {
        if (currentCharIndex < currentText.length) {
          setCurrentCharIndex(prev => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentCharIndex > 0) {
          setCurrentCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timer);
  }, [showMainTitle, currentCharIndex, currentTextIndex, isDeleting, heroTexts]);

  const stats = [
    {
      icon: Zap,
      number: "2",
      label: "Live Events",
      color: "text-warning"
    },
    {
      icon: Users,
      number: "2.5K+",
      label: "Participants",
      color: "text-info"
    },
    {
      icon: Trophy,
      number: "₹10L+",
      label: "Prize Money",
      color: "text-success"
    },
    {
      icon: Code,
      number: "500+",
      label: "Projects",
      color: "text-accent"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Enhanced background with gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-25"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%, rgba(59,130,246,0.25)_0%, transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%, rgba(147,51,234,0.15)_0%, transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          {!showMainTitle && (
            <div className="text-4xl md:text-5xl font-semibold mb-6 text-white h-20 flex items-center justify-center font-typewriter">
              {typewriterText}
              <span className="animate-pulse">|</span>
            </div>
          )}
          
          {showMainTitle && (
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent font-typewriter h-20 flex items-center justify-center">
              {heroTexts[currentTextIndex].slice(0, currentCharIndex)}
              <span className="animate-pulse">|</span>
            </h1>
          )}
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hackathons, compete with the best, and turn your ideas into reality
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-gradient-card p-6 rounded-xl border border-border/20 backdrop-blur shadow-card hover:bg-secondary/30 transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-3">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <div className="text-3xl font-bold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
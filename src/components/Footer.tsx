import { Github, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const socialLinks = [
    { icon: Github, href: "https://github.com/hackersunity", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/hackersunity", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/hackersunity", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/hackersunity", label: "Instagram" }
  ];

  const platformLinks = [
    { name: "Events", href: "/events" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Community", href: "/community" },
    { name: "Resources", href: "/resources" }
  ];

  return (
    <footer className="border-t border-border/20 bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Hacker's Unity
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Empowering developers and innovators to build the future through hackathons, competitions, and collaborative projects.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>hackerunity.community@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Jaipur, Rajasthan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Hacker's Unity. All rights reserved. Built with ❤️ for the developer community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
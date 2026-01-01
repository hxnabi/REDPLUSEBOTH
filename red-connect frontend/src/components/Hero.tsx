import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Heart, Droplet } from "lucide-react";
import SmartActionButton from "./SmartActionButton";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden pt-20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-secondary rounded-full opacity-60" />
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-secondary rounded-full opacity-40" />
        <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-accent rounded-full opacity-50" />
        
        {/* Floating Elements */}
        <div className="absolute top-40 left-20 w-16 h-16 bg-primary/10 rounded-full animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-60 right-32 w-12 h-12 bg-primary/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-48 left-1/3 w-10 h-10 bg-primary/10 rounded-full animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 pt-20 md:pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-6 animate-fade-up">
            Your Blood,
            <br />
            <span className="relative">
              Save Lives
              <Heart className="absolute -right-8 -top-4 w-8 h-8 text-primary animate-pulse-slow hidden md:block" />
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Welcome to our blood donation website, where we strive to make a meaningful difference in people lives. Our mission is to connect donors with those in need, ensuring a steady supply of this vital resource.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search blood banks, donors..."
                className="w-full h-14 pl-5 pr-12 rounded-full border-2 border-border bg-card shadow-soft focus:outline-none focus:border-primary transition-colors text-foreground"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <SmartActionButton
              text="Donate Now"
              variant="hero"
              size="xl"
              className="rounded-full w-full sm:w-auto"
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            {[
              { number: "10K+", label: "Donors" },
              { number: "500+", label: "Blood Banks" },
              { number: "25K+", label: "Lives Saved" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-primary">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curved Bottom - soft rose */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-secondary" style={{ clipPath: "ellipse(80% 100% at 50% 100%)" }} />
    </section>
  );
};

export default Hero;

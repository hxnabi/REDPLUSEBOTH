import { Heart, Gift, Users, Droplet, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: Droplet,
      iconBg: "bg-primary",
      title: "Get Started",
      description: "Signing up with RED+ is quick and easy. Simply create an account, fill in your personal details, and start your journey as a lifesaving donor.",
      cta: "Register Now",
      link: "/donor-login",
    },
    {
      icon: Shield,
      iconBg: "bg-primary",
      title: "Our Mission",
      description: "At the heart of RED+ is a deep-rooted commitment to community health and well-being and immediate impact on someone's life.",
      cta: "Get Involved",
      link: "/organizer-login",
    },
    {
      icon: Heart,
      iconBg: "bg-primary",
      title: "Why Donate Blood?",
      description: "Donating blood is a simple yet powerful act of compassion. It's a way for you to make a direct and immediate impact on someone's life.",
      cta: "Donate Now",
      link: "/donor-login",
    },
    {
      icon: Search,
      iconBg: "bg-primary",
      title: "Donor Locations",
      description: "We have a network of convenient blood donation centers across the region, making it easy for you to find a location that works best for you.",
      cta: "Check Location",
      link: "/blood-banks",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Empowering Blood Donation
          </h2>
          <p className="text-xl text-muted-foreground">
            Join Our Lifesaving Cause
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-2xl p-6 shadow-card card-hover border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* CTA */}
              <Link to={feature.link}>
                <Button variant="hero" size="pill" className="w-full">
                  {feature.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

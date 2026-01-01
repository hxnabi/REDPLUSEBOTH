import { MapPin, Calendar, Gift, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Mission = () => {
  const features = [
    { icon: MapPin, text: "Convenient Locations" },
    { icon: Calendar, text: "Flexible Scheduling" },
    { icon: Users, text: "Personalized Guidance" },
    { icon: Gift, text: "Donor Rewards" },
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Blood Bag Illustration */}
          <div className="relative flex justify-center">
            <div className="relative w-64 md:w-80">
              {/* Blood Bag SVG */}
              <svg viewBox="0 0 200 300" className="w-full h-auto drop-shadow-2xl">
                {/* Bag outline */}
                <path 
                  d="M40 50 Q40 30 60 30 L140 30 Q160 30 160 50 L160 250 Q160 280 130 280 L70 280 Q40 280 40 250 Z" 
                  fill="#f5f5f5" 
                  stroke="#e0e0e0" 
                  strokeWidth="2"
                />
                {/* Blood fill */}
                <path 
                  d="M45 120 L155 120 L155 250 Q155 275 130 275 L70 275 Q45 275 45 250 Z" 
                  fill="hsl(354, 93%, 43%)"
                />
                {/* Tubes */}
                <rect x="70" y="10" width="8" height="25" fill="#ccc" rx="2" />
                <rect x="90" y="5" width="20" height="30" fill="#d4a5a5" rx="4" />
                <rect x="122" y="10" width="8" height="25" fill="#ccc" rx="2" />
                {/* Label */}
                <rect x="70" y="70" width="60" height="40" fill="#fff" stroke="#ddd" strokeWidth="1" />
                <text x="85" y="95" fontSize="16" fontWeight="bold" fill="hsl(354, 93%, 43%)">A+</text>
                {/* Drop icon on bag */}
                <circle cx="100" cy="180" r="20" fill="hsl(354, 70%, 50%)" opacity="0.3" />
              </svg>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary rounded-full flex items-center justify-center animate-float">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              At the heart of our organization is a deep-rooted commitment to community health and well-being. We believe that every blood donation has the power to transform lives, and we are dedicated to fostering a culture of selfless giving.
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-8">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 32" className="w-4 h-6 text-primary">
                      <path 
                        d="M12 0 C12 0 24 12 24 20 C24 26.627 18.627 32 12 32 C5.373 32 0 26.627 0 20 C0 12 12 0 12 0 Z" 
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="text-foreground font-medium text-lg">{text}</span>
                </li>
              ))}
            </ul>

            <Link to="/blood-banks">
              <Button variant="hero" size="lg" className="rounded-full">
                Find Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;

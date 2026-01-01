import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Gift, Users } from "lucide-react";
import SmartActionButton from "./SmartActionButton";

const CTA = () => {
  const cards = [
    {
      icon: Heart,
      title: "Donate Today",
      description: "Your donation can make all the difference in someone's life. Sign up now and become a part of our mission to save lives.",
    },
    {
      icon: Gift,
      title: "Give Back",
      description: "Together, we can build a more resilient and healthy community. Your contribution, no matter how small, can have a profound impact on those in need.",
    },
    {
      icon: Users,
      title: "Get Involved",
      description: "Your donation can save up to three lives. Join our mission and make a lasting difference in your community.",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Become a Lifesaver
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Your Donation Matters!
          </p>
          <SmartActionButton
            text="Donate Now"
            variant="hero"
            size="xl"
            className="rounded-full"
          />
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="bg-card rounded-2xl p-8 shadow-card card-hover border border-border/50 text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <card.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {card.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTA;

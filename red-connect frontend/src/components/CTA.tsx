import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Gift, Users, ArrowRight, Sparkles, Droplet, Star, Zap } from "lucide-react";
import SmartActionButton from "./SmartActionButton";

const CTA = () => {
  const cards = [
    {
      icon: Heart,
      title: "Donate Today",
      description: "Your donation can make all the difference in someone's life. Sign up now and become a part of our mission to save lives.",
      gradient: "from-red-500 to-rose-600",
      badge: "Hero",
    },
    {
      icon: Gift,
      title: "Give Back",
      description: "Together, we can build a more resilient and healthy community. Your contribution, no matter how small, can have a profound impact on those in need.",
      gradient: "from-rose-500 to-pink-600",
      badge: "Impact",
    },
    {
      icon: Users,
      title: "Get Involved",
      description: "Your donation can save up to three lives. Join our mission and make a lasting difference in your community.",
      gradient: "from-red-600 to-red-700",
      badge: "Community",
    },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-rose-50/40 to-white overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Gradient Orbs */}
        <div className="absolute top-20 left-[5%] w-[600px] h-[600px] bg-gradient-to-br from-red-200/25 to-rose-300/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-[8%] w-[500px] h-[500px] bg-gradient-to-tl from-pink-200/20 to-red-200/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        
        {/* Floating Elements */}
        <Star className="absolute top-32 right-[12%] w-6 h-6 text-red-300/30 fill-red-200/20 animate-float" style={{ animationDelay: "0s", animationDuration: "8s" }} />
        <Droplet className="absolute top-[50%] left-[10%] w-5 h-5 text-rose-300/30 fill-rose-200/20 animate-float" style={{ animationDelay: "2s", animationDuration: "7s" }} />
        <Sparkles className="absolute bottom-[30%] right-[15%] w-5 h-5 text-pink-300/30 animate-float" style={{ animationDelay: "1s", animationDuration: "9s" }} />
        <Heart className="absolute top-[40%] right-[25%] w-4 h-4 text-red-300/20 fill-red-200/20 animate-float" style={{ animationDelay: "3s", animationDuration: "10s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - Enhanced */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg mb-6 animate-fade-up">
            <Zap className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="text-sm font-semibold text-red-700">Make a Difference</span>
          </div>

          {/* Main Heading */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 animate-fade-up leading-tight" style={{ animationDelay: "0.1s" }}>
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Become a
            </span>
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Lifesaver
              </span>
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
            </span>
          </h2>
          
          <p className="text-lg md:text-2xl text-gray-600 mb-10 animate-fade-up font-light" style={{ animationDelay: "0.2s" }}>
            Your Donation <span className="font-semibold text-red-600">Matters!</span>
          </p>

          {/* CTA Button - Enhanced */}
          <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <SmartActionButton
              text="Donate Now"
              variant="hero"
              size="xl"
              className="group rounded-full px-10 py-7 text-xl font-bold shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-110 relative overflow-hidden"
            />
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Quick Process</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Certified Centers</span>
            </div>
          </div>
        </div>

        {/* Cards - Premium Design */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="group relative animate-fade-up"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              {/* Card Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
              
              {/* Card Container */}
              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-red-50 group-hover:border-red-200 text-center h-full flex flex-col overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
                  <div className={`w-full h-full bg-gradient-to-br ${card.gradient} rounded-full blur-3xl`} />
                </div>

                {/* Badge */}
                <div className="absolute top-6 right-6">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                    {card.badge}
                  </span>
                </div>

                {/* Icon Container */}
                <div className="relative mx-auto mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10`}>
                    <card.icon className="w-10 h-10 text-white" />
                  </div>
                  {/* Icon Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col relative z-10">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed flex-1 mb-6">
                    {card.description}
                  </p>

                  {/* Learn More Link */}
                  <button className="inline-flex items-center justify-center gap-2 text-red-600 font-semibold text-sm group/link">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-red-200/50 transition-all duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call-to-Action */}
        <div className="mt-16 md:mt-20 text-center animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-full blur-2xl" />
            <div className="relative bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 rounded-full px-8 py-4 border border-red-100 shadow-lg">
              <p className="text-gray-700 font-medium">
                <span className="font-bold text-red-600">Join 10,000+</span> heroes who have already made a difference
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

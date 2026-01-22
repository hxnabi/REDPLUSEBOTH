import { Heart, Gift, Users, Droplet, Shield, Search, ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: Droplet,
      gradient: "from-red-500 to-rose-600",
      glowColor: "red-500",
      title: "Get Started",
      description: "Signing up with RED+ is quick and easy. Check your eligibility, create an account, and start your journey as a lifesaving donor.",
      cta: "Check Eligibility",
      link: "/donor-eligibility",
    },
    {
      icon: Shield,
      gradient: "from-rose-500 to-pink-600",
      glowColor: "rose-500",
      title: "Our Mission",
      description: "At the heart of RED+ is a deep-rooted commitment to community health and well-being and immediate impact on someone's life.",
      cta: "Get Involved",
      link: "/organizer-login",
    },
    {
      icon: Heart,
      gradient: "from-red-600 to-red-700",
      glowColor: "red-600",
      title: "Why Donate Blood?",
      description: "Donating blood is a simple yet powerful act of compassion. It's a way for you to make a direct and immediate impact on someone's life.",
      cta: "Donate Now",
      link: "/donor-eligibility",
    },
    {
      icon: Search,
      gradient: "from-pink-500 to-rose-600",
      glowColor: "pink-500",
      title: "Donor Locations",
      description: "We have a network of convenient blood donation centers across the region, making it easy for you to find a location that works best for you.",
      cta: "Check Location",
      link: "/blood-banks",
    },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-rose-50/30 to-white overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-red-200/20 to-rose-300/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-pink-200/15 to-red-200/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "3s" }} />
        
        {/* Floating Elements */}
        <Star className="absolute top-32 right-[15%] w-6 h-6 text-red-300/30 fill-red-200/20 animate-float" style={{ animationDelay: "1s", animationDuration: "8s" }} />
        <Sparkles className="absolute top-[40%] left-[8%] w-5 h-5 text-rose-300/30 animate-float" style={{ animationDelay: "2s", animationDuration: "9s" }} />
        <Heart className="absolute bottom-[25%] right-[12%] w-5 h-5 text-pink-300/30 fill-pink-200/20 animate-float" style={{ animationDelay: "0s", animationDuration: "7s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - Enhanced */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg mb-6 animate-fade-up">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-700">Why Choose Us</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 animate-fade-up leading-tight" style={{ animationDelay: "0.1s" }}>
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Empowering Blood
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Donation
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Join Our Lifesaving Cause and Make a Real Difference
          </p>
        </div>

        {/* Features Grid - Modern Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative animate-fade-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {/* Card Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${feature.glowColor}/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
              
              {/* Card */}
              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-50 group-hover:border-red-200 overflow-hidden h-full flex flex-col">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <div className={`w-full h-full bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl`} />
                </div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  {/* Icon Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                  
                  {/* Decorative Corner Dot */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 flex-1">
                    {feature.description}
                  </p>

                  {/* CTA Button */}
                  <Link to={feature.link} className="mt-auto">
                    <Button 
                      variant="hero" 
                      className="w-full rounded-full font-semibold group/btn relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {feature.cta}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </Link>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-red-200/50 transition-all duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 md:mt-20 text-center animate-fade-up" style={{ animationDelay: "0.7s" }}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 md:p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl border border-red-100 shadow-xl">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-2">
                Ready to Save Lives?
              </h3>
              <p className="text-gray-600">
                Join thousands of donors making a difference every day
              </p>
            </div>
            <Link to="/donor-login">
              <Button 
                variant="hero" 
                size="lg" 
                className="rounded-full px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  Get Started Today
                  <Sparkles className="w-5 h-5" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

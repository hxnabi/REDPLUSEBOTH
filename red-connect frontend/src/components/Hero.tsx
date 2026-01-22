import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Heart, Droplet, TrendingUp, Users, Building2 } from "lucide-react";
import SmartActionButton from "./SmartActionButton";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 overflow-hidden pt-20">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-red-200/40 to-rose-300/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-pink-200/30 to-red-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-gradient-to-bl from-rose-300/20 to-red-100/20 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: "4s" }} />
        
        {/* Floating Droplets */}
        <div className="absolute top-40 left-[10%] animate-float" style={{ animationDelay: "0s", animationDuration: "6s" }}>
          <Droplet className="w-8 h-8 text-red-300/40 fill-red-200/20" />
        </div>
        <div className="absolute top-60 right-[15%] animate-float" style={{ animationDelay: "2s", animationDuration: "7s" }}>
          <Droplet className="w-6 h-6 text-rose-300/40 fill-rose-200/20" />
        </div>
        <div className="absolute bottom-48 left-[30%] animate-float" style={{ animationDelay: "4s", animationDuration: "8s" }}>
          <Droplet className="w-5 h-5 text-red-400/30 fill-red-300/20" />
        </div>
        <div className="absolute top-[50%] right-[25%] animate-float" style={{ animationDelay: "1s", animationDuration: "9s" }}>
          <Heart className="w-6 h-6 text-pink-300/30 fill-pink-200/20" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="container mx-auto px-4 pt-16 md:pt-24 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg mb-8 animate-fade-up">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-700">Saving Lives Together</span>
          </div>

          {/* Main Heading with Modern Typography */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 animate-fade-up leading-tight" style={{ animationDelay: "0.1s" }}>
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 bg-clip-text text-transparent inline-block animate-gradient bg-[length:200%_auto]">
              Your Blood,
            </span>
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-red-700 via-red-600 to-rose-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]" style={{ animationDelay: "0.5s" }}>
                Save Lives
              </span>
              <Heart className="absolute -right-4 md:-right-12 -top-2 md:-top-4 w-6 h-6 md:w-10 md:h-10 text-red-500 animate-pulse-slow fill-red-500" />
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
            </span>
          </h1>

          {/* Enhanced Subheading */}
          <p className="text-base md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-up leading-relaxed font-light" style={{ animationDelay: "0.2s" }}>
            Welcome to our blood donation platform, where we strive to make a 
            <span className="font-semibold text-red-600"> meaningful difference </span> 
            in people's lives. Our mission is to 
            <span className="font-semibold text-red-600"> connect donors </span> 
            with those in need.
          </p>

          {/* Modern Search Bar with Glassmorphism */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <input
                type="text"
                placeholder="Search blood banks, donors, locations..."
                className="relative w-full h-16 px-6 pr-14 rounded-full border-2 border-gray-200 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 text-gray-800 placeholder:text-gray-400"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>
            <SmartActionButton
              text="Donate Now"
              variant="hero"
              size="xl"
              className="rounded-full h-16 px-10 font-semibold text-lg shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            />
          </div>

          {/* Enhanced Stats with Icons and Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { number: "10K+", label: "Active Donors", icon: Users, color: "from-red-500 to-rose-600" },
              { number: "500+", label: "Blood Banks", icon: Building2, color: "from-rose-500 to-pink-600" },
              { number: "25K+", label: "Lives Saved", icon: TrendingUp, color: "from-red-600 to-red-700" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="relative group"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-red-50">
                  {/* Icon */}
                  <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Number */}
                  <p className={`text-4xl md:text-5xl font-display font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </p>
                  
                  {/* Label */}
                  <p className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</p>
                  
                  {/* Decorative dot */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full opacity-50" />
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>WHO Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 md:h-32" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="#FFF1F2" fillOpacity="0.5"/>
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="#FFF1F2" fillOpacity="0.8"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;

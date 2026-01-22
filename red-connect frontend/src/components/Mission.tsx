import { MapPin, Calendar, Gift, Users, Droplet, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Mission = () => {
  const features = [
    { 
      icon: MapPin, 
      text: "Convenient Locations",
      description: "Find blood banks near you",
      color: "from-red-500 to-rose-600"
    },
    { 
      icon: Calendar, 
      text: "Flexible Scheduling",
      description: "Book at your convenience",
      color: "from-rose-500 to-pink-600"
    },
    { 
      icon: Users, 
      text: "Personalized Guidance",
      description: "Expert support throughout",
      color: "from-red-600 to-red-700"
    },
    { 
      icon: Gift, 
      text: "Donor Rewards",
      description: "Earn rewards for saving lives",
      color: "from-pink-500 to-rose-600"
    },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-rose-50 via-white to-red-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-red-200/20 to-rose-300/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-[5%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-200/15 to-red-200/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        
        {/* Floating Droplets */}
        <Droplet className="absolute top-32 left-[15%] w-6 h-6 text-red-300/30 fill-red-200/20 animate-float" style={{ animationDelay: "0s", animationDuration: "7s" }} />
        <Heart className="absolute top-[60%] right-[20%] w-5 h-5 text-rose-300/30 fill-rose-200/20 animate-float" style={{ animationDelay: "3s", animationDuration: "8s" }} />
        <Sparkles className="absolute bottom-[30%] left-[8%] w-5 h-5 text-pink-300/30 animate-float" style={{ animationDelay: "1.5s", animationDuration: "9s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Blood Bag Illustration - Enhanced */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-64 md:w-80 lg:w-96">
              {/* Glow Effect Behind */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-rose-500/30 rounded-full blur-3xl scale-110 animate-pulse-slow" />
              
              {/* Blood Bag SVG - Enhanced */}
              <svg viewBox="0 0 200 300" className="relative w-full h-auto drop-shadow-2xl transition-transform duration-700 hover:scale-105">
                {/* Bag shadow */}
                <path 
                  d="M40 50 Q40 30 60 30 L140 30 Q160 30 160 50 L160 250 Q160 280 130 280 L70 280 Q40 280 40 250 Z" 
                  fill="#000" 
                  opacity="0.1"
                  transform="translate(5, 5)"
                />
                {/* Bag outline with gradient */}
                <defs>
                  <linearGradient id="bagGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#f5f5f5", stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "hsl(354, 93%, 43%)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "hsl(354, 93%, 35%)", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path 
                  d="M40 50 Q40 30 60 30 L140 30 Q160 30 160 50 L160 250 Q160 280 130 280 L70 280 Q40 280 40 250 Z" 
                  fill="url(#bagGradient)" 
                  stroke="#d0d0d0" 
                  strokeWidth="2"
                />
                {/* Blood fill with animation */}
                <path 
                  d="M45 120 L155 120 L155 250 Q155 275 130 275 L70 275 Q45 275 45 250 Z" 
                  fill="url(#bloodGradient)"
                  className="animate-pulse-slow"
                />
                {/* Shine effect */}
                <path 
                  d="M50 60 Q70 80 50 180" 
                  stroke="white" 
                  strokeWidth="4" 
                  opacity="0.3"
                  fill="none"
                />
                {/* Tubes */}
                <rect x="70" y="10" width="8" height="25" fill="#bbb" rx="2" />
                <rect x="90" y="5" width="20" height="30" fill="#d4a5a5" rx="4" />
                <rect x="122" y="10" width="8" height="25" fill="#bbb" rx="2" />
                {/* Label with shadow */}
                <rect x="70" y="70" width="60" height="40" fill="#fff" stroke="#ddd" strokeWidth="1" rx="4" />
                <text x="85" y="95" fontSize="18" fontWeight="bold" fill="hsl(354, 93%, 43%)">A+</text>
                {/* Animated droplet in center */}
                <circle cx="100" cy="180" r="20" fill="hsl(354, 70%, 50%)" opacity="0.2" className="animate-pulse-slow" />
              </svg>
              
              {/* Floating elements - Multiple */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-red-100 to-rose-200 rounded-full flex items-center justify-center shadow-xl animate-float border-4 border-white">
                <Heart className="w-10 h-10 text-red-500 fill-red-500 animate-pulse" />
              </div>
              
              <div className="absolute top-12 -right-4 w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center shadow-lg animate-float border-3 border-white" style={{ animationDelay: "1s" }}>
                <Sparkles className="w-7 h-7 text-rose-500" />
              </div>
              
              <div className="absolute bottom-20 -left-8 w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center shadow-lg animate-float border-3 border-white" style={{ animationDelay: "2s" }}>
                <Droplet className="w-6 h-6 text-red-600 fill-red-600" />
              </div>

              {/* Stats Badge */}
              <div className="absolute -bottom-6 right-8 bg-white rounded-2xl shadow-2xl p-4 animate-scale-in border-2 border-red-100" style={{ animationDelay: "0.8s" }}>
                <div className="text-center">
                  <p className="text-3xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">25K+</p>
                  <p className="text-xs text-gray-600 font-medium">Lives Saved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content - Enhanced */}
          <div className="order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg mb-6 animate-fade-up">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-sm font-semibold text-red-700">Our Mission</span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black mb-6 animate-fade-up leading-tight" style={{ animationDelay: "0.1s" }}>
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                About Our Mission
              </span>
            </h2>
            
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              At the heart of our organization is a deep-rooted commitment to 
              <span className="font-semibold text-red-600"> community health and well-being</span>. 
              We believe that every blood donation has the 
              <span className="font-semibold text-red-600"> power to transform lives</span>, 
              and we are dedicated to fostering a culture of selfless giving.
            </p>

            {/* Features Grid - Modern Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <div 
                  key={feature.text}
                  className="group relative animate-fade-up"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  {/* Card Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-red-50 group-hover:border-red-200">
                    {/* Icon */}
                    <div className={`w-12 h-12 mb-3 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Text */}
                    <h3 className="font-bold text-gray-900 mb-1 text-base">{feature.text}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                    
                    {/* Decorative Dot */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button - Enhanced */}
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.7s" }}>
              <Link to="/blood-banks" className="group">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="relative rounded-full px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Find Now
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                  {/* Button glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-[length:200%_auto] animate-gradient" />
                </Button>
              </Link>
              
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;

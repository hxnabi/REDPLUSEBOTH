import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Heart, Users, Droplet, Target, Award, Shield, Sparkles, TrendingUp, Star, ArrowRight, CheckCircle } from "lucide-react";

const About = () => {
  const stats = [
    { 
      icon: Users, 
      value: "10,000+", 
      label: "Registered Donors",
      gradient: "from-red-500 to-rose-600"
    },
    { 
      icon: Droplet, 
      value: "25,000+", 
      label: "Lives Saved",
      gradient: "from-orange-500 to-red-600"
    },
    { 
      icon: Heart, 
      value: "500+", 
      label: "Blood Banks",
      gradient: "from-rose-500 to-pink-600"
    },
    { 
      icon: Award, 
      value: "1,000+", 
      label: "Donation Camps",
      gradient: "from-red-600 to-red-700"
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We believe in the power of compassion and the difference a single donation can make in saving lives.",
      gradient: "from-red-500 to-rose-600"
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "We prioritize the safety of both donors and recipients through rigorous screening and quality standards.",
      gradient: "from-rose-500 to-pink-600"
    },
    {
      icon: Target,
      title: "Mission Driven",
      description: "Our mission is to ensure no patient suffers due to lack of blood availability.",
      gradient: "from-red-600 to-red-700"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a strong community of voluntary blood donors who save lives every day.",
      gradient: "from-pink-500 to-rose-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      <Navbar />
      
      <main className="pt-24 pb-20 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-red-200/20 to-rose-300/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-40 left-[5%] w-[600px] h-[600px] bg-gradient-to-tl from-pink-200/15 to-red-200/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
          
          {/* Floating Elements */}
          <Star className="absolute top-32 left-[12%] w-6 h-6 text-red-300/30 fill-red-200/20 animate-float" style={{ animationDelay: "0s", animationDuration: "8s" }} />
          <Droplet className="absolute top-[40%] right-[18%] w-5 h-5 text-rose-300/30 fill-rose-200/20 animate-float" style={{ animationDelay: "2s", animationDuration: "7s" }} />
          <Heart className="absolute bottom-[35%] left-[15%] w-5 h-5 text-pink-300/30 fill-pink-200/20 animate-float" style={{ animationDelay: "3s", animationDuration: "9s" }} />
          <Sparkles className="absolute top-[60%] right-[12%] w-5 h-5 text-red-300/30 animate-float" style={{ animationDelay: "1s", animationDuration: "10s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Hero Section - Enhanced */}
          <div className="text-center max-w-5xl mx-auto mb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg mb-8 animate-fade-up">
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-700">Our Story</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black mb-8 animate-fade-up leading-tight" style={{ animationDelay: "0.1s" }}>
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                About
              </span>{" "}
              <span className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                RED+
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed mb-6 animate-fade-up font-light" style={{ animationDelay: "0.2s" }}>
              RED+ is India's leading blood donation platform, connecting donors with those in need. 
              We're on a mission to make blood donation 
              <span className="font-semibold text-red-600"> accessible, safe, and impactful </span> 
              for everyone.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-100 shadow-md">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">ISO Certified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-100 shadow-md">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Trusted by 1000+ Hospitals</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-100 shadow-md">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Stats Section - Premium Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group relative animate-fade-up"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-50 group-hover:border-red-200 text-center">
                  {/* Icon */}
                  <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  
                  {/* Value */}
                  <p className={`text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </p>
                  
                  {/* Label */}
                  <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</p>
                  
                  {/* Decorative dot */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full opacity-50" />
                </div>
              </div>
            ))}
          </div>

          {/* Our Story Section - Enhanced */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-24 items-center">
            <div className="order-2 md:order-1 animate-fade-up" style={{ animationDelay: "0.5s" }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-rose-100 text-red-700 text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Founded in 2020</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                Our Story
              </h2>
              
              <div className="space-y-5 text-gray-600 leading-relaxed text-base md:text-lg">
                <p>
                  RED+ was founded with a <span className="font-semibold text-red-600">simple yet powerful vision</span>: to ensure that no patient suffers 
                  due to lack of blood availability. We recognized the critical gap between blood donors 
                  and those in need, and set out to bridge it through technology.
                </p>
                <p>
                  Today, we've built a <span className="font-semibold text-red-600">thriving community</span> of voluntary blood donors, partnered with 
                  hundreds of blood banks, and organized thousands of donation camps across India. 
                  Every day, our platform helps save lives by connecting the right donor with the 
                  right recipient at the right time.
                </p>
                <p>
                  Our journey has just begun. With your support, we're working towards a future where 
                  <span className="font-semibold text-red-600"> no life is lost due to blood shortage</span>.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100">
                  <TrendingUp className="w-6 h-6 text-red-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">500%</p>
                  <p className="text-xs text-gray-600">Growth in 2 Years</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100">
                  <Star className="w-6 h-6 text-red-600 mb-2 fill-red-600" />
                  <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                  <p className="text-xs text-gray-600">User Rating</p>
                </div>
              </div>
            </div>
            
            <div className="relative order-1 md:order-2 animate-fade-up" style={{ animationDelay: "0.6s" }}>
              {/* Main Image Container */}
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-rose-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                
                {/* Image Placeholder */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-red-100 to-rose-100 h-[400px] md:h-[500px] flex items-center justify-center border-4 border-white">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <Heart className="w-12 h-12 text-white fill-white animate-pulse" />
                    </div>
                    <p className="text-gray-600 font-medium">Blood Donation Platform</p>
                  </div>
                </div>
              </div>
              
              {/* Year Badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-red-600 to-rose-600 text-white p-8 rounded-3xl shadow-2xl border-4 border-white animate-scale-in" style={{ animationDelay: "0.9s" }}>
                <p className="text-5xl font-black">2020</p>
                <p className="text-sm font-medium opacity-90">Year Founded</p>
              </div>
            </div>
          </div>

          {/* Our Values - Enhanced */}
          <div className="mb-24">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg mb-6 animate-fade-up">
                <Award className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-700">What We Stand For</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-black text-gray-900 mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative animate-fade-up"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-50 group-hover:border-red-200 text-center h-full">
                    {/* Icon */}
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div className={`w-full h-full bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <value.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{value.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                    
                    {/* Decorative dot */}
                    <div className="absolute top-6 right-6 w-2 h-2 bg-red-400 rounded-full opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Vision - Enhanced */}
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <div className="group relative animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <div className="relative bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-3xl p-8 md:p-10 border-2 border-red-100 group-hover:border-red-200 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To create a sustainable ecosystem where blood donation is accessible, safe, and 
                  celebrated. We aim to eliminate blood shortages through technology, community 
                  engagement, and strategic partnerships with healthcare providers.
                </p>
              </div>
            </div>
            
            <div className="group relative animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 md:p-10 border-2 border-blue-100 group-hover:border-blue-200 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  A world where every patient has timely access to safe blood, and every voluntary 
                  donor is recognized as a life-saver. We envision India becoming a leader in 
                  voluntary blood donation through innovation and community participation.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section - Enhanced */}
          <div className="text-center max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-10 md:p-16 shadow-2xl border border-red-100">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-rose-100 text-red-700 text-sm font-bold mb-6">
                  <Users className="w-4 h-4" />
                  <span>Join 10,000+ Heroes</span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                  Join Our Mission
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                  Whether you're a donor, organizer, or healthcare provider, you can be part of our 
                  life-saving community. Together, we can make a difference.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="/donor-eligibility" 
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-5 h-5 fill-white" />
                    Become a Donor
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a 
                    href="/organizer-login" 
                    className="inline-flex items-center gap-2 bg-white border-2 border-red-200 text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-105"
                  >
                    <Award className="w-5 h-5" />
                    Organize a Camp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;


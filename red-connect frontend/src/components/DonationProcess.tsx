import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Gift, Award, Users, Droplet, Heart, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const DonationProcess = () => {
  const compatibilityData = [
    { type: "A+", donateTo: "A+ AB+", receiveFrom: "A+ A- O+ O-", color: "from-red-500 to-rose-600" },
    { type: "O+", donateTo: "O+ A+ B+ AB+", receiveFrom: "O+ O-", color: "from-orange-500 to-red-600" },
    { type: "B+", donateTo: "B+ AB+", receiveFrom: "B+ B- O+ O-", color: "from-rose-500 to-pink-600" },
    { type: "AB+", donateTo: "AB+", receiveFrom: "Everyone", color: "from-red-600 to-red-700", special: true },
    { type: "A-", donateTo: "A+ A- AB+ AB-", receiveFrom: "A- O-", color: "from-pink-500 to-rose-600" },
    { type: "O-", donateTo: "Everyone", receiveFrom: "O-", color: "from-red-700 to-rose-800", special: true },
    { type: "B-", donateTo: "B+ B- AB+ AB-", receiveFrom: "B- O-", color: "from-fuchsia-500 to-pink-600" },
    { type: "AB-", donateTo: "AB+ AB-", receiveFrom: "AB- A- B- O-", color: "from-rose-600 to-red-700" },
  ];

  const features = [
    { icon: Users, text: "Donor Testimonials", description: "Real stories from heroes" },
    { icon: Award, text: "Donor Stories", description: "Inspiring journeys" },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-white via-red-50/30 to-rose-50/50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-[5%] w-[500px] h-[500px] bg-gradient-to-br from-red-200/20 to-rose-300/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-40 left-[8%] w-[400px] h-[400px] bg-gradient-to-tr from-pink-200/15 to-red-200/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        
        {/* Floating Elements */}
        <Droplet className="absolute top-40 right-[20%] w-6 h-6 text-red-300/30 fill-red-200/20 animate-float" style={{ animationDelay: "0s", animationDuration: "7s" }} />
        <Heart className="absolute top-[60%] left-[15%] w-5 h-5 text-rose-300/30 fill-rose-200/20 animate-float" style={{ animationDelay: "3s", animationDuration: "8s" }} />
        <Sparkles className="absolute bottom-[30%] right-[18%] w-5 h-5 text-pink-300/30 animate-float" style={{ animationDelay: "1.5s", animationDuration: "9s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content - Enhanced */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg mb-6 animate-fade-up">
              <Droplet className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-sm font-semibold text-red-700">How It Works</span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black mb-6 animate-fade-up leading-tight" style={{ animationDelay: "0.1s" }}>
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Our Donation
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Process
              </span>
            </h2>
            
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              At blood donation centers, we strive to provide a 
              <span className="font-semibold text-red-600"> seamless and comfortable experience </span>
              for our donors. Your journey to saving lives starts here.
            </p>

            {/* Feature Cards */}
            <div className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <div 
                  key={feature.text}
                  className="group relative animate-fade-up"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  <div className="relative flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-red-50 group-hover:border-red-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{feature.text}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs - Enhanced */}
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <Link to="/events">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="group rounded-full px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    View Events
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/rewards">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Donor Rewards
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Modern Compatibility Table */}
          <div className="order-1 lg:order-2 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              
              {/* Table Container */}
              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-red-100">
                {/* Table Header - Modern Gradient */}
                <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-6 md:px-8 py-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-gradient" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Droplet className="w-6 h-6 text-white fill-white" />
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                      Compatible Blood Type Donors
                    </h3>
                  </div>
                </div>

                {/* Table - Scrollable */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-red-100 bg-red-50/50">
                        <th className="px-4 md:px-6 py-4 text-left font-display font-bold text-gray-900 text-sm md:text-base">
                          Blood Type
                        </th>
                        <th className="px-4 md:px-6 py-4 text-left font-display font-bold text-gray-900 text-sm md:text-base">
                          Donate Blood To
                        </th>
                        <th className="px-4 md:px-6 py-4 text-left font-display font-bold text-gray-900 text-sm md:text-base">
                          Receive Blood From
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {compatibilityData.map((row, index) => (
                        <tr 
                          key={row.type} 
                          className={`border-b border-red-50 hover:bg-red-50/50 transition-colors duration-200 group/row ${
                            index % 2 === 0 ? "bg-white/50" : "bg-red-50/30"
                          }`}
                        >
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${row.color} rounded-xl flex items-center justify-center shadow-md group-hover/row:scale-110 transition-transform duration-300`}>
                                <span className="font-black text-white text-sm md:text-base">
                                  {row.type}
                                </span>
                              </div>
                              {row.special && (
                                <span className="hidden md:inline-flex px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                  Universal
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="text-gray-700 font-medium text-sm md:text-base">
                              {row.donateTo}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="text-gray-700 font-medium text-sm md:text-base">
                              {row.receiveFrom}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Info Bar */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 px-6 md:px-8 py-4 border-t border-red-100">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="font-medium">Know your blood type and help save lives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationProcess;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Heart, Users, Droplet, Target, Award, Shield } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Registered Donors" },
    { icon: Droplet, value: "25,000+", label: "Lives Saved" },
    { icon: Heart, value: "500+", label: "Blood Banks" },
    { icon: Award, value: "1,000+", label: "Donation Camps" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We believe in the power of compassion and the difference a single donation can make in saving lives.",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "We prioritize the safety of both donors and recipients through rigorous screening and quality standards.",
    },
    {
      icon: Target,
      title: "Mission Driven",
      description: "Our mission is to ensure no patient suffers due to lack of blood availability.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a strong community of voluntary blood donors who save lives every day.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              About <span className="text-[#C8102E]">RED+</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              RED+ is India's leading blood donation platform, connecting donors with those in need. 
              We're on a mission to make blood donation accessible, safe, and impactful for everyone.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-[#C8102E]" />
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Our Story Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  RED+ was founded with a simple yet powerful vision: to ensure that no patient suffers 
                  due to lack of blood availability. We recognized the critical gap between blood donors 
                  and those in need, and set out to bridge it through technology.
                </p>
                <p>
                  Today, we've built a thriving community of voluntary blood donors, partnered with 
                  hundreds of blood banks, and organized thousands of donation camps across India. 
                  Every day, our platform helps save lives by connecting the right donor with the 
                  right recipient at the right time.
                </p>
                <p>
                  Our journey has just begun. With your support, we're working towards a future where 
                  no life is lost due to blood shortage.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/placeholder.svg" 
                alt="Blood Donation"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#C8102E] text-white p-6 rounded-xl shadow-xl">
                <p className="text-4xl font-bold">2020</p>
                <p className="text-sm">Year Founded</p>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-[#C8102E]" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <Card className="p-8 bg-gradient-to-br from-red-50 to-pink-50 border-none">
              <Target className="w-12 h-12 text-[#C8102E] mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To create a sustainable ecosystem where blood donation is accessible, safe, and 
                celebrated. We aim to eliminate blood shortages through technology, community 
                engagement, and strategic partnerships with healthcare providers.
              </p>
            </Card>
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-none">
              <Shield className="w-12 h-12 text-[#C8102E] mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A world where every patient has timely access to safe blood, and every voluntary 
                donor is recognized as a life-saver. We envision India becoming a leader in 
                voluntary blood donation through innovation and community participation.
              </p>
            </Card>
          </div>

          {/* Team Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're a donor, organizer, or healthcare provider, you can be part of our 
              life-saving community. Together, we can make a difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/donor-eligibility" 
                className="bg-[#C8102E] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#a00d25] transition-colors"
              >
                Become a Donor
              </a>
              <a 
                href="/organizer-login" 
                className="bg-white border-2 border-[#C8102E] text-[#C8102E] px-8 py-4 rounded-full font-semibold hover:bg-red-50 transition-colors"
              >
                Organize a Camp
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;


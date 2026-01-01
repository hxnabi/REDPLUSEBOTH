import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Features from "@/components/Features";
import DonationProcess from "@/components/DonationProcess";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <Features />
        <DonationProcess />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

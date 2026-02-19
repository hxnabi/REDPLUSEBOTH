import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Features from "@/components/Features";
import DonationProcess from "@/components/DonationProcess";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Regular Donor",
    quote:
      "Donating blood has become a part of my life. Knowing that my donation saves lives gives me immense satisfaction.",
  },
  {
    name: "Rahul Verma",
    role: "First-Time Donor",
    quote: "I was nervous at first, but the team made the experience so comfortable. I will definitely donate again.",
  },
  {
    name: "Dr. Anita Desai",
    role: "Hospital Partner",
    quote: "Our hospital never faces a shortage of blood units thanks to the amazing donors on this platform.",
  },
  {
    name: "Janhavi Tandlekar",
    role: "Community Volunteer",
    quote: "Seeing donors and patients connect through this platform reminds me that small actions truly save lives.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <Features />
        <DonationProcess />
        <section className="relative py-16 md:py-20 bg-gradient-to-b from-white via-rose-50/50 to-red-50/40 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-28 left-[5%] w-[360px] h-[360px] bg-gradient-to-br from-red-200/25 to-rose-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 right-[8%] w-[420px] h-[420px] bg-gradient-to-tr from-pink-200/20 to-red-200/25 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-10 md:mb-12">
              <Badge className="mb-3 border-none bg-red-100 text-[11px] font-semibold tracking-[0.25em] text-red-700">
                TESTIMONIALS
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                Stories That Inspire
              </h2>
              <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Real voices from donors, families, and partners who have experienced the impact of timely blood
                support.
              </p>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent" />
              <div className="overflow-hidden">
                <div className="flex gap-6 md:gap-8 animate-marquee">
                  {[...testimonials, ...testimonials].map((item, index) => (
                    <div
                      key={item.name + index}
                      className="min-w-[260px] sm:min-w-[320px] md:min-w-[360px] lg:min-w-[380px] rounded-3xl bg-white/95 border border-red-50 shadow-xl shadow-red-100/40 px-6 py-6 md:px-8 md:py-7"
                    >
                      <div className="flex items-center gap-1 text-red-500 mb-3">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star key={starIndex} className="w-4 h-4 fill-red-500 text-red-500" />
                        ))}
                      </div>
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                        “{item.quote}”
                      </p>
                      <div>
                        <p className="text-sm md:text-base font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs md:text-sm text-gray-500">{item.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative py-16 md:py-20 bg-gradient-to-b from-white via-rose-50/40 to-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 right-[10%] w-[360px] h-[360px] bg-gradient-to-br from-red-200/30 to-rose-300/25 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 left-[5%] w-[420px] h-[420px] bg-gradient-to-tr from-pink-200/25 to-red-200/20 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center mb-10 md:mb-12">
              <Badge className="mb-3 border-none bg-red-100 text-[11px] font-semibold tracking-[0.25em] text-red-700">
                FAQ
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Common Questions
              </h2>
            </div>
            <div className="rounded-3xl bg-white/95 backdrop-blur-sm shadow-xl shadow-red-100/40 border border-red-100">
              <Accordion type="single" collapsible className="divide-y divide-red-50/70">
                <AccordionItem value="q1" className="border-none px-4 md:px-6">
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900">
                    Is blood donation painful?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-gray-600">
                    You may feel a quick pinch when the needle goes in, but most donors say it is
                    much less painful than they expected. The entire donation is monitored by trained
                    staff to keep you comfortable.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2" className="border-none px-4 md:px-6">
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900">
                    How long does the donation take?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-gray-600">
                    The blood draw itself usually takes around 8–10 minutes. Including registration,
                    a quick health check, and rest time with snacks, plan for about 30–45 minutes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3" className="border-none px-4 md:px-6">
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900">
                    How often can I donate blood?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-gray-600">
                    In most places, healthy adults can donate whole blood every 3 months. This gives
                    your body enough time to fully replenish your red blood cells.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4" className="border-none px-4 md:px-6">
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900">
                    What should I eat before donating?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-gray-600">
                    Eat a light, healthy meal and drink plenty of water. Choose iron-rich foods like
                    leafy greens, beans, or lean meat, and avoid very fatty or oily food right before
                    your appointment.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q5" className="border-none px-4 md:px-6">
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900">
                    Who can donate blood?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-gray-600">
                    Donors should generally be in good health, within the required age and weight
                    range, and free from recent infections or certain medical conditions. Final
                    eligibility is always confirmed by the medical team on site.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q6" className="border-none px-4 md:px-6">
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900">
                    What happens to my blood after donation?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-gray-600">
                    After donation, your blood is tested, separated into components, and stored
                    safely. It is then supplied to hospitals and patients who need transfusions for
                    surgeries, accidents, cancer care, and other critical treatments.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

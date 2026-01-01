import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DonationProcess = () => {
  const compatibilityData = [
    { type: "A+", donateTo: "A+ AB+", receiveFrom: "A+ A- O+ O-" },
    { type: "O+", donateTo: "O+ A+ B+ AB+", receiveFrom: "O+ O-" },
    { type: "B+", donateTo: "B+ AB+", receiveFrom: "B+ B- O+ O-" },
    { type: "AB+", donateTo: "AB+", receiveFrom: "Everyone" },
    { type: "A-", donateTo: "A+ A- AB+ AB-", receiveFrom: "A- O-" },
    { type: "O-", donateTo: "Everyone", receiveFrom: "O-" },
    { type: "B-", donateTo: "B+ B- AB+ AB-", receiveFrom: "B- O-" },
    { type: "AB-", donateTo: "AB+ AB-", receiveFrom: "AB- A- B- O-" },
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Content */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Our Donation<br />Process
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              At blood donation centers, we strive to provide a seamless and comfortable experience for our donors.
            </p>

            {/* Bullet Points */}
            <ul className="space-y-4 mb-8">
              {["Donor Testimonials", "Donor Stories"].map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <svg viewBox="0 0 24 32" className="w-4 h-6 text-primary flex-shrink-0">
                    <path 
                      d="M12 0 C12 0 24 12 24 20 C24 26.627 18.627 32 12 32 C5.373 32 0 26.627 0 20 C0 12 12 0 12 0 Z" 
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-foreground font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/donor-login">
                <Button variant="hero" size="lg" className="rounded-full">
                  Schedule Appointment
                </Button>
              </Link>
              <Button variant="pillOutline" size="lg">
                Donor Rewards
              </Button>
            </div>
          </div>

          {/* Right - Compatibility Table */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-border/50">
            {/* Table Header */}
            <div className="bg-primary px-6 py-4">
              <h3 className="font-display text-xl font-semibold text-primary-foreground">
                Compatible Blood Type Donors
              </h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left font-display font-semibold text-foreground">Blood Type</th>
                    <th className="px-6 py-4 text-left font-display font-semibold text-foreground">Donate Blood To</th>
                    <th className="px-6 py-4 text-left font-display font-semibold text-foreground">Receive Blood From</th>
                  </tr>
                </thead>
                <tbody>
                  {compatibilityData.map((row, index) => (
                    <tr 
                      key={row.type} 
                      className={`border-b border-border/50 ${index % 2 === 0 ? "bg-muted/30" : ""}`}
                    >
                      <td className="px-6 py-4 font-semibold text-primary">{row.type}</td>
                      <td className="px-6 py-4 text-foreground">{row.donateTo}</td>
                      <td className="px-6 py-4 text-foreground">{row.receiveFrom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationProcess;

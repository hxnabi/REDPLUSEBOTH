import { Link } from "react-router-dom";
import { Droplet, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-red text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-12 h-12 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-display font-bold text-2xl">+</span>
              </div>
              <span className="font-display font-bold text-2xl">RED</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Connecting donors with those in need, ensuring a steady supply of this vital resource to save lives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About Us", "Find Blood", "Donate Blood", "Blood Banks"].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Explore</h4>
            <ul className="space-y-2">
              {["Donor Portal", "Organizer Portal", "Blood Bank Portal", "Donation Process", "FAQs"].map((item) => (
                <li key={item}>
                  <Link 
                    to="#"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Connect</h4>
            <div className="space-y-3">
              <a href="mailto:contact@redplus.org" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm">
                <Mail className="w-4 h-4" />
                contact@redplus.org
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm">
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
              <p className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                <MapPin className="w-4 h-4" />
                123 Health Street, NY
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-6 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} RED+ Blood Donation. All rights reserved. Saving lives, one donation at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

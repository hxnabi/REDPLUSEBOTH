import { Link } from "react-router-dom";
import { Droplet, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, ArrowRight, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Droplet className="absolute top-20 left-[10%] w-8 h-8 text-white/10 fill-white/5 animate-float" style={{ animationDelay: "0s", animationDuration: "8s" }} />
        <Heart className="absolute top-40 right-[15%] w-6 h-6 text-white/10 fill-white/5 animate-float" style={{ animationDelay: "2s", animationDuration: "9s" }} />
        <Droplet className="absolute bottom-32 left-[20%] w-5 h-5 text-white/10 fill-white/5 animate-float" style={{ animationDelay: "1s", animationDuration: "7s" }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="group flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-red-600 font-display font-black text-2xl">+</span>
                  <Heart className="absolute -top-1 -right-1 w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50" />
              </div>
              <div>
                <span className="font-display font-black text-2xl tracking-tight">RED</span>
                <p className="text-[10px] tracking-widest text-white/80 -mt-1">BLOOD DONATION</p>
              </div>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Connecting donors with those in need, ensuring a steady supply of this vital resource to save lives.
            </p>
            
            {/* Newsletter */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <h5 className="font-semibold text-sm mb-3">Stay Updated</h5>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <button className="px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-white/90 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-white rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/blood-banks", label: "Find Blood" },
                { to: "/donor-register", label: "Donate Blood" },
                { to: "/blood-banks", label: "Blood Banks" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-white rounded-full" />
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/donor-dashboard", label: "Donor Portal" },
                { to: "/organizer-dashboard", label: "Organizer Portal" },
                { to: "/admin-dashboard", label: "Admin Portal" },
                { to: "/about", label: "Donation Process" },
                { to: "/about", label: "FAQs" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-white rounded-full" />
              Connect
            </h4>
            <div className="space-y-4 mb-6">
              <a 
                href="mailto:contact@redplus.org" 
                className="group flex items-start gap-3 text-white/80 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Email</p>
                  <p className="text-sm font-medium">contact@redplus.org</p>
                </div>
              </a>
              
              <a 
                href="tel:+1234567890" 
                className="group flex items-start gap-3 text-white/80 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Phone</p>
                  <p className="text-sm font-medium">+1 (234) 567-890</p>
                </div>
              </a>
              
              <div className="flex items-start gap-3 text-white/80">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Address</p>
                  <p className="text-sm font-medium">123 Health Street, NY</p>
                </div>
              </div>
            </div>
            
            {/* Social Icons - Modern */}
            <div>
              <h5 className="font-semibold text-sm mb-4">Follow Us</h5>
              <div className="flex gap-3">
                {[
                  { href: "https://facebook.com/redplus", icon: Facebook, label: "Facebook" },
                  { href: "https://twitter.com/redplus", icon: Twitter, label: "Twitter" },
                  { href: "https://instagram.com/redplus", icon: Instagram, label: "Instagram" },
                  { href: "https://linkedin.com/company/redplus", icon: Linkedin, label: "LinkedIn" },
                ].map((social) => (
                  <a 
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 border border-white/20 hover:border-white"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-white group-hover:text-red-600 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-4">
              <Heart className="w-6 h-6 text-white/50 fill-white/30" />
            </div>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} <span className="font-semibold text-white">RED+ Blood Donation</span>. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/30">•</span>
            <Link to="/" className="text-white/60 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/30">•</span>
            <Link to="/" className="text-white/60 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
          
          <p className="text-white/60 text-sm text-center md:text-right flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" />
            Saving lives, one donation at a time
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

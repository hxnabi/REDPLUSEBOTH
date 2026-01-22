import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RoleSwitchDialog from "./RoleSwitchDialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/home";
  const navigate = useNavigate();
  const { toast } = useToast();

  const navLinks = [
    { href: "/blood-banks", label: "Find Blood Banks" },
    { href: "/donor-login", label: "Want to Donate Blood" },
    { href: "/organizer-login", label: "Organize Event" },
    { href: "/about", label: "About Us" },
  ];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTargetHref, setDialogTargetHref] = useState<string | null>(null);
  const [dialogTargetRole, setDialogTargetRole] = useState<"donor" | "organizer" | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openRoleDialog = (href: string, role: "donor" | "organizer") => {
    setDialogTargetHref(href);
    setDialogTargetRole(role);
    setDialogOpen(true);
  };

  const handleConfirmRoleSwitch = () => {
    // clear auth and proceed to targetHref
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    if (dialogTargetHref) navigate(dialogTargetHref);
    setDialogTargetHref(null);
    setDialogTargetRole(null);
  };

  const handleNav = (href: string) => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");

    // Role-aware navigation for login/dashboard links
    if (href === "/organizer-login") {
      if (token && userRole === "organizer") {
        navigate("/organizer-dashboard");
        return;
      }
      if (token && userRole === "donor") {
        openRoleDialog(href, "organizer");
        return;
      }
      navigate(href);
      return;
    }

    if (href === "/donor-login") {
      if (token && userRole === "donor") {
        navigate("/donor-dashboard");
        return;
      }
      if (token && userRole === "organizer") {
        openRoleDialog(href, "donor");
        return;
      }
      navigate(href);
      return;
    }

    // Default navigation
    navigate(href);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-white/80 backdrop-blur-lg shadow-lg border-b border-red-100" 
            : isHome 
              ? "bg-gradient-to-r from-red-600 to-rose-600" 
              : "bg-gradient-to-r from-red-600 to-rose-600 shadow-lg"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Modern Design */}
            <Link to="/home" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Logo Container with Glow */}
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  scrolled 
                    ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/50" 
                    : "bg-white shadow-xl"
                }`}>
                  <span className={`font-display font-black text-2xl transition-colors ${
                    scrolled ? "text-white" : "text-red-600"
                  }`}>
                    +
                  </span>
                  {/* Floating Heart */}
                  <Heart 
                    className={`absolute -top-1 -right-1 w-4 h-4 transition-all duration-300 ${
                      scrolled ? "text-white fill-white" : "text-red-500 fill-red-500"
                    } group-hover:scale-125 group-hover:rotate-12`} 
                  />
                </div>
                {/* Glow Ring */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className={`font-display font-black text-2xl tracking-tight transition-colors ${
                  scrolled ? "text-red-600" : "text-white"
                }`}>
                  RED
                </span>
                <span className={`text-[10px] -mt-1 font-medium tracking-widest ${
                  scrolled ? "text-red-400" : "text-red-100"
                }`}>
                  BLOOD DONATION
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Modern Pills */}
            <div className="hidden lg:flex items-center gap-3">
              {navLinks.map((link, index) => (
                <button
                  key={link.href + link.label}
                  onClick={() => handleNav(link.href)}
                  className={`relative px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 group overflow-hidden ${
                    scrolled 
                      ? "text-gray-700 hover:text-red-600" 
                      : "text-white hover:text-white"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background Effect */}
                  <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    scrolled 
                      ? "bg-red-50 opacity-0 group-hover:opacity-100" 
                      : "bg-white/10 opacity-0 group-hover:opacity-100"
                  }`} />
                  
                  {/* Border */}
                  <span className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                    scrolled 
                      ? "border-transparent group-hover:border-red-200" 
                      : "border-white/20 group-hover:border-white/40"
                  }`} />
                  
                  {/* Text */}
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    {index === 1 && (
                      <Sparkles className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button - Modern */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                scrolled 
                  ? "bg-red-50 text-red-600 hover:bg-red-100" 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}`}>
                  <Menu className="w-6 h-6" />
                </span>
                <span className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"}`}>
                  <X className="w-6 h-6" />
                </span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation - Modern Dropdown */}
          <div 
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2 pt-2">
              {navLinks.map((link, index) => (
                <button
                  key={link.href + link.label}
                  onClick={() => { setIsOpen(false); handleNav(link.href); }}
                  className={`relative w-full text-left px-5 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden group ${
                    scrolled 
                      ? "text-gray-700 hover:text-red-600" 
                      : "text-white"
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0)" : "translateY(-10px)",
                    transition: `all 0.3s ease ${index * 0.05}s`
                  }}
                >
                  {/* Background */}
                  <span className={`absolute inset-0 transition-all duration-300 ${
                    scrolled 
                      ? "bg-red-50 opacity-0 group-hover:opacity-100" 
                      : "bg-white/5 opacity-0 group-hover:opacity-100"
                  }`} />
                  
                  {/* Border */}
                  <span className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
                    scrolled 
                      ? "border-transparent group-hover:border-red-100" 
                      : "border-transparent group-hover:border-white/20"
                  }`} />
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center justify-between">
                    <span>{link.label}</span>
                    <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      <RoleSwitchDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        targetRole={dialogTargetRole}
        onConfirm={handleConfirmRoleSwitch}
      />
    </>
  );
};

export default Navbar;

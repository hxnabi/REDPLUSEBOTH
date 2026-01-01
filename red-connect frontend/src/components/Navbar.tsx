import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Droplet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RoleSwitchDialog from "./RoleSwitchDialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navigate = useNavigate();
  const { toast } = useToast();

  const navLinks = [
    { href: "/blood-banks", label: "Looking for Blood" },
    { href: "/donor-login", label: "Want to Donate Blood" },
    { href: "/organizer-login", label: "Organize Event" },
    { href: "/blood-banks", label: "Blood Bank" },
  ];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTargetHref, setDialogTargetHref] = useState<string | null>(null);
  const [dialogTargetRole, setDialogTargetRole] = useState<"donor" | "organizer" | null>(null);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? "bg-primary" : "bg-primary shadow-lg"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
              <span className="text-primary font-display font-bold text-lg">+</span>
              <Droplet className="absolute -top-1 -right-1 w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-primary-foreground font-display font-bold text-xl hidden sm:block">RED</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Button
                key={link.href + link.label}
                variant="ghost"
                size="pill"
                className="text-primary-foreground hover:bg-primary-foreground/10 border border-primary-foreground/30 rounded-full"
                onClick={() => handleNav(link.href)}
              >
                {link.label}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-primary-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Button
                  key={link.href + link.label}
                  variant="ghost"
                  className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => { setIsOpen(false); handleNav(link.href); }}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        <RoleSwitchDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          targetRole={dialogTargetRole}
          onConfirm={handleConfirmRoleSwitch}
        />
      </div>
    </nav>
  );
};

export default Navbar;

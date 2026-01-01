import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SmartActionButtonProps {
  text: string;
  variant?: "hero" | "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

const SmartActionButton = ({
  text,
  variant = "default",
  size = "default",
  className = "",
  onClick,
}: SmartActionButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = () => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");

    if (token && userRole) {
      // Already logged in - go to appropriate dashboard
      if (userRole === "donor") {
        navigate("/donor-dashboard");
      } else if (userRole === "organizer") {
        navigate("/organizer-dashboard");
      }
    } else {
      // Not logged in - show dialog to choose role
      toast({
        title: "Choose Your Role",
        description: "Select whether you want to donate or organize events",
      });
      // Navigate to a choice page or show a modal
      navigate("/donor-login"); // Default to donor for now
    }

    onClick?.();
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};

export default SmartActionButton;

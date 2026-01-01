import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: "donor" | "organizer";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const userRole = localStorage.getItem("user_role");
  const token = localStorage.getItem("access_token");
  const { toast } = useToast();

  // No token - redirect to login
  if (!token) {
    return <Navigate to={allowedRole === "donor" ? "/donor-login" : "/organizer-login"} replace />;
  }

  // Wrong role - show error and redirect
  if (userRole !== allowedRole) {
    toast({
      title: "Access Denied",
      description: `You must be logged in as a ${allowedRole} to access this page`,
      variant: "destructive",
    });
    return <Navigate to={userRole === "donor" ? "/donor-dashboard" : "/organizer-dashboard"} replace />;
  }

  // Correct role - render the component
  return <>{children}</>;
};

export default ProtectedRoute;

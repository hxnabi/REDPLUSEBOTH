import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: "donor" | "organizer" | "admin";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const userRole = localStorage.getItem("user_role");
  const token = localStorage.getItem("access_token");
  const { toast } = useToast();

  // No token - redirect to login
  if (!token) {
    let loginPath = "/donor-login";
    if (allowedRole === "organizer") loginPath = "/organizer-login";
    else if (allowedRole === "admin") loginPath = "/admin-login";
    return <Navigate to={loginPath} replace />;
  }

  // Wrong role - show error and redirect
  if (userRole !== allowedRole) {
    toast({
      title: "Access Denied",
      description: `You must be logged in as a ${allowedRole} to access this page`,
      variant: "destructive",
    });
    
    let dashboardPath = "/";
    if (userRole === "donor") dashboardPath = "/donor-dashboard";
    else if (userRole === "organizer") dashboardPath = "/organizer-dashboard";
    else if (userRole === "admin") dashboardPath = "/admin-dashboard";
    
    return <Navigate to={dashboardPath} replace />;
  }

  // Correct role - render the component
  return <>{children}</>;
};

export default ProtectedRoute;

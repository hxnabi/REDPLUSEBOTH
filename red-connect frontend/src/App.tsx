import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BloodBanks from "./pages/BloodBanks";
import About from "./pages/About";
import DonorLogin from "./pages/DonorLogin";
import DonorRegister from "./pages/DonorRegister";
import DonorEligibilityCheck from "./pages/DonorEligibilityCheck";
import OrganizerLogin from "./pages/OrganizerLogin";
import OrganizerRegister from "./pages/OrganizerRegister";
import AdminLogin from "./pages/AdminLogin";
import DonorDashboard from "./pages/DonorDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerEventManagement from "./pages/OrganizerEventManagement";
import EventView from "./pages/EventView";
import EventsList from "./pages/EventsList";
import NotFound from "./pages/NotFound";
import AIChatbot from "./components/AIChatbot";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Index />} />
          <Route path="/blood-banks" element={<BloodBanks />} />
          <Route path="/about" element={<About />} />
          
          {/* Donor Routes */}
          <Route path="/donor-login" element={<DonorLogin />} />
          <Route path="/donor-eligibility" element={<DonorEligibilityCheck />} />
          <Route path="/donor-register" element={<DonorRegister />} />
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute allowedRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Organizer Routes */}
          <Route path="/organizer-login" element={<OrganizerLogin />} />
          <Route path="/organizer-register" element={<OrganizerRegister />} />
          <Route
            path="/organizer-dashboard"
            element={
              <ProtectedRoute allowedRole="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/:eventId/manage"
            element={
              <ProtectedRoute allowedRole="organizer">
                <OrganizerEventManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

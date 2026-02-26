import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Users,
  Droplet,
  Calendar,
  Building2,
  BarChart3,
  LogOut,
  Activity,
  TrendingUp,
  FileText,
  Settings,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  Sparkles,
  Link2,
  RefreshCw,
  Pencil,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://127.0.0.1:8000";

interface Stats {
  total_donors: number;
  total_organizers: number;
  total_events: number;
  total_donations: number;
  total_blood_banks: number;
  upcoming_events: number;
  active_donors: number;
  total_certificates: number;
  active_organizers: number;
}

interface QuickStats {
  active_users_percentage: number;
  event_completion_percentage: number;
  donor_retention_percentage: number;
}

interface RecentActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  time_ago: string;
  timestamp: string;
  badge: string;
}

interface Donor {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  blood_group: string | null;
  age: number | null;
  gender: string | null;
  is_active: boolean;
  created_at: string;
  total_donations: number;
}

interface Organizer {
  id: number;
  organization_name: string;
  email: string;
  contact_person: string;
  phone: string | null;
  is_verified: boolean;
  created_at: string;
  total_events: number;
}

interface Event {
  id: number;
  title: string;
  organizer_name: string;
  date: string;
  location: string;
  status: string;
  total_participants: number;
  total_donations: number;
}

interface BloodBank {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  category: "Government" | "Private";
  city: string;
  state: string;
  pincode: string | null;
  available_blood_types: string | null;
  operating_hours: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

interface BloodBankFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  category: "Government" | "Private";
  city: string;
  state: string;
  pincode: string;
  available_blood_types: string;
  operating_hours: string;
  latitude: string;
  longitude: string;
}

interface BloodRequest {
  id: number;
  patient_name: string;
  required_blood_group: string;
  quantity_units: number;
  hospital_name: string;
  urgency_level: string;
  contact_name: string;
  contact_phone: string;
  approval_status: string;
  donor_status: string;
  completion_status: string;
  created_at: string;
  medical_proof_url: string | null;
}

type BlogCategory = "Health" | "Education" | "Awareness" | "Stories";

interface Blog {
  id: number;
  title: string;
  slug: string;
  category: BlogCategory;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = useState("");
  const [stats, setStats] = useState<Stats>({
    total_donors: 0,
    total_organizers: 0,
    total_events: 0,
    total_donations: 0,
    total_blood_banks: 0,
    upcoming_events: 0,
    active_donors: 0,
    total_certificates: 0,
    active_organizers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [bloodRequestUrgencyFilter, setBloodRequestUrgencyFilter] = useState<string>("all");
  const [bloodRequestApprovalFilter, setBloodRequestApprovalFilter] = useState<string>("all");
  const [bloodRequestCompletionFilter, setBloodRequestCompletionFilter] = useState<string>("all");
  const [quickStats, setQuickStats] = useState<QuickStats>({
    active_users_percentage: 0,
    event_completion_percentage: 0,
    donor_retention_percentage: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [creatingBlog, setCreatingBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState<BlogCategory>("Health");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogReadTime, setBlogReadTime] = useState<string>("");
  const [blogHighlight, setBlogHighlight] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [fetchingBlogs, setFetchingBlogs] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // Blood Bank Management State
  const [isBloodBankDialogOpen, setIsBloodBankDialogOpen] = useState(false);
  const [currentBloodBank, setCurrentBloodBank] = useState<BloodBank | null>(null);
  const [bloodBankForm, setBloodBankForm] = useState<BloodBankFormData>({
    name: "",
    address: "",
    phone: "",
    email: "",
    category: "Government",
    city: "",
    state: "",
    pincode: "",
    available_blood_types: "",
    operating_hours: "",
    latitude: "",
    longitude: ""
  });

  const resetBloodBankForm = () => {
    setBloodBankForm({
      name: "",
      address: "",
      phone: "",
      email: "",
      category: "Government",
      city: "",
      state: "",
      pincode: "",
      available_blood_types: "",
      operating_hours: "",
      latitude: "",
      longitude: ""
    });
    setCurrentBloodBank(null);
  };

  const handleCreateBloodBank = () => {
    resetBloodBankForm();
    setIsBloodBankDialogOpen(true);
  };

  const handleEditBloodBank = (bank: BloodBank) => {
    setCurrentBloodBank(bank);
    setBloodBankForm({
      name: bank.name,
      address: bank.address,
      phone: bank.phone,
      email: bank.email || "",
      category: bank.category,
      city: bank.city,
      state: bank.state,
      pincode: bank.pincode || "",
      available_blood_types: bank.available_blood_types || "",
      operating_hours: bank.operating_hours || "",
      latitude: bank.latitude?.toString() || "",
      longitude: bank.longitude?.toString() || ""
    });
    setIsBloodBankDialogOpen(true);
  };

  const handleSaveBloodBank = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const url = currentBloodBank 
        ? `${API_URL}/api/blood-banks/${currentBloodBank.id}`
        : `${API_URL}/api/blood-banks/`;
      
      const method = currentBloodBank ? "PUT" : "POST";
      
      const payload = {
        ...bloodBankForm,
        latitude: bloodBankForm.latitude ? parseFloat(bloodBankForm.latitude) : null,
        longitude: bloodBankForm.longitude ? parseFloat(bloodBankForm.longitude) : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Blood bank ${currentBloodBank ? "updated" : "created"} successfully`,
        });
        setIsBloodBankDialogOpen(false);
        fetchBloodBanks();
      } else {
        throw new Error("Failed to save blood bank");
      }
    } catch (error) {
      console.error("Error saving blood bank:", error);
      toast({
        title: "Error",
        description: "Failed to save blood bank",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBloodBank = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blood bank?")) return;
    
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/api/blood-banks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 204) {
        toast({
          title: "Success",
          description: "Blood bank deleted successfully",
        });
        fetchBloodBanks();
      } else {
        throw new Error("Failed to delete blood bank");
      }
    } catch (error) {
      console.error("Error deleting blood bank:", error);
      toast({
        title: "Error",
        description: "Failed to delete blood bank",
        variant: "destructive",
      });
    }
  };

  const fetchBlogs = async () => {
    try {
      setFetchingBlogs(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/api/admin/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive",
      });
    } finally {
      setFetchingBlogs(false);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/api/admin/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Blog deleted successfully",
        });
        fetchBlogs(); // Refresh list
      } else {
        throw new Error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const role = localStorage.getItem("user_role");
    
    if (!email || role !== "admin") {
      navigate("/admin-login");
      return;
    }
    
    setAdminEmail(email);
    fetchStats();
    fetchQuickStats();
    fetchRecentActivity();
    fetchBlogs();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error("Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/quick-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuickStats(data);
      }
    } catch (error) {
      console.error("Error fetching quick stats:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/recent-activity?limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data);
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  const fetchDonors = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/donors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonors(data);
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast({
        title: "Error",
        description: "Failed to load donors",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchOrganizers = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/organizers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrganizers(data);
      }
    } catch (error) {
      console.error("Error fetching organizers:", error);
      toast({
        title: "Error",
        description: "Failed to load organizers",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/events/?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchBloodBanks = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/blood-banks/?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBloodBanks(data);
      }
    } catch (error) {
      console.error("Error fetching blood banks:", error);
      toast({
        title: "Error",
        description: "Failed to load blood banks",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchBloodRequests = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/api/blood-requests/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBloodRequests(data);
      }
    } catch (error) {
      console.error("Error fetching blood requests:", error);
      toast({
        title: "Error",
        description: "Failed to load blood requests",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const updateBloodRequestStatus = async (
    requestId: number,
    updates: Partial<Pick<BloodRequest, "approval_status" | "donor_status" | "completion_status">>,
  ) => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      if (updates.approval_status) formData.append("approval_status", updates.approval_status);
      if (updates.donor_status) formData.append("donor_status", updates.donor_status);
      if (updates.completion_status) formData.append("completion_status", updates.completion_status);

      const response = await fetch(`${API_URL}/api/blood-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const detail = errorData && errorData.detail ? String(errorData.detail) : "Failed to update request";
        throw new Error(detail);
      }

      toast({
        title: "Updated",
        description: "Blood request status updated successfully",
      });
      fetchBloodRequests();
    } catch (error) {
      console.error("Error updating blood request:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update blood request",
        variant: "destructive",
      });
    }
  };

  const resetBlogForm = () => {
    setBlogTitle("");
    setBlogCategory("Health");
    setBlogExcerpt("");
    setBlogContent("");
    setBlogReadTime("");
    setBlogHighlight(false);
  };

  const handleGenerateReport = () => {
    setIsReportDialogOpen(true);
  };

  const handleCreateBlog = async () => {
    if (!blogTitle.trim() || !blogContent.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter at least a title and content for the blog.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingBlog(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/api/admin/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: blogTitle.trim(),
          category: blogCategory,
          excerpt: blogExcerpt.trim() || null,
          content: blogContent.trim(),
          read_time_minutes: blogReadTime ? Number(blogReadTime) : null,
          highlight: blogHighlight,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const detail = errorData && errorData.detail ? String(errorData.detail) : "Failed to create blog";
        throw new Error(detail);
      }

      resetBlogForm();
      toast({
        title: "Blog created",
        description: "The blog article has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create blog",
        variant: "destructive",
      });
    } finally {
      setCreatingBlog(false);
    }
  };

  const toggleDonorActive = async (donorId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/donors/${donorId}/toggle-active`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Donor status updated",
        });
        fetchDonors();
      }
    } catch (error) {
      console.error("Error toggling donor status:", error);
      toast({
        title: "Error",
        description: "Failed to update donor status",
        variant: "destructive",
      });
    }
  };

  const toggleOrganizerVerified = async (organizerId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/organizers/${organizerId}/toggle-verified`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Organizer verification status updated",
        });
        fetchOrganizers();
      }
    } catch (error) {
      console.error("Error toggling organizer verification:", error);
      toast({
        title: "Error",
        description: "Failed to update organizer verification",
        variant: "destructive",
      });
    }
  };

  const deleteDonor = async (donorId: number) => {
    if (!confirm("Are you sure you want to delete this donor?")) return;

    try {
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/donors/${donorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Donor deleted successfully",
        });
        fetchDonors();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting donor:", error);
      toast({
        title: "Error",
        description: "Failed to delete donor",
        variant: "destructive",
      });
    }
  };

  const deleteOrganizer = async (organizerId: number) => {
    if (!confirm("Are you sure you want to delete this organizer?")) return;

    try {
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/organizers/${organizerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Organizer deleted successfully",
        });
        fetchOrganizers();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting organizer:", error);
      toast({
        title: "Error",
        description: "Failed to delete organizer",
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/api/admin/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        fetchEvents();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    
    navigate("/admin-login");
  };

  const filteredBloodRequests = bloodRequests.filter((request) => {
    const urgencyOk =
      bloodRequestUrgencyFilter === "all" || request.urgency_level === bloodRequestUrgencyFilter;
    const approvalOk =
      bloodRequestApprovalFilter === "all" ||
      request.approval_status === bloodRequestApprovalFilter;
    const completionOk =
      bloodRequestCompletionFilter === "all" ||
      request.completion_status === bloodRequestCompletionFilter;
    return urgencyOk && approvalOk && completionOk;
  });

  const statCards = [
    {
      title: "Total Donors",
      value: stats.total_donors,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: `${stats.active_donors} active`,
    },
    {
      title: "Total Events",
      value: stats.total_events,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: `${stats.upcoming_events} upcoming`,
    },
    {
      title: "Total Donations",
      value: stats.total_donations,
      icon: Droplet,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "All time",
    },
    {
      title: "Blood Banks",
      value: stats.total_blood_banks,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Registered",
    },
    {
      title: "Organizers",
      value: stats.total_organizers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Active organizations",
    },
    {
      title: "Certificates",
      value: stats.total_certificates,
      icon: FileText,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      description: "Issued",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold">RED+ Admin Portal</h1>
                <p className="text-xs text-slate-300">{adminEmail}</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, Administrator
          </h2>
          <p className="text-gray-600">
            Manage your blood donation platform from this dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Management
            </CardTitle>
            <CardDescription>
              Manage users, events, blood banks, and system settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="donors">Donors</TabsTrigger>
                <TabsTrigger value="organizers">Organizers</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="bloodrequests">Blood Requests</TabsTrigger>
                <TabsTrigger value="bloodbanks">Blood Banks</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                        ) : (
                          recentActivity.map((activity) => (
                            <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{activity.title}</p>
                                <p className="text-xs text-gray-600">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{activity.time_ago}</p>
                              </div>
                              <Badge variant={activity.badge === "New" ? "default" : "secondary"}>
                                {activity.badge}
                              </Badge>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Active Users</span>
                            <span className="font-semibold">{quickStats.active_users_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${quickStats.active_users_percentage}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Event Completion</span>
                            <span className="font-semibold">{quickStats.event_completion_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${quickStats.event_completion_percentage}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Donor Retention</span>
                            <span className="font-semibold">{quickStats.donor_retention_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${quickStats.donor_retention_percentage}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Analytics Report</CardTitle>
                    <CardDescription>
                      Comprehensive overview of system performance and key metrics as of {new Date().toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 py-4">
                      {/* Key Metrics Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Donors</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.total_donors}</div>
                            <p className="text-xs text-muted-foreground">Active: {stats.active_donors}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Events</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.total_events}</div>
                            <p className="text-xs text-muted-foreground">Upcoming: {stats.upcoming_events}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Donations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.total_donations}</div>
                            <p className="text-xs text-muted-foreground">Lifesaving impact</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Blood Banks</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.total_blood_banks}</div>
                            <p className="text-xs text-muted-foreground">Registered centers</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Distribution Chart */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Ecosystem Distribution</CardTitle>
                          </CardHeader>
                          <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={[
                                  { name: 'Donors', value: stats.total_donors },
                                  { name: 'Organizers', value: stats.total_organizers },
                                  { name: 'Events', value: stats.total_events },
                                  { name: 'Donations', value: stats.total_donations },
                                  { name: 'Banks', value: stats.total_blood_banks },
                                ]}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <RechartsTooltip 
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                  cursor={{ fill: '#f3f4f6' }}
                                />
                                <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={40} />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Performance Metrics */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Performance Indicators</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-8 pt-6">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Active User Rate</span>
                                <span className="text-green-600 font-bold">{quickStats.active_users_percentage}%</span>
                              </div>
                              <Progress value={quickStats.active_users_percentage} className="h-2" />
                              <p className="text-xs text-muted-foreground">Percentage of users who have logged in recently</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Event Completion Rate</span>
                                <span className="text-blue-600 font-bold">{quickStats.event_completion_percentage}%</span>
                              </div>
                              <Progress value={quickStats.event_completion_percentage} className="h-2" />
                              <p className="text-xs text-muted-foreground">Scheduled events that were successfully conducted</p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Donor Retention Rate</span>
                                <span className="text-purple-600 font-bold">{quickStats.donor_retention_percentage}%</span>
                              </div>
                              <Progress value={quickStats.donor_retention_percentage} className="h-2" />
                              <p className="text-xs text-muted-foreground">Donors who have donated more than once</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Additional Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-red-50 border-red-100">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-red-600">Certificates Issued</p>
                                <h3 className="text-2xl font-bold text-red-700">{stats.total_certificates}</h3>
                              </div>
                              <FileText className="w-8 h-8 text-red-300" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-blue-50 border-blue-100">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-blue-600">Active Organizers</p>
                                <h3 className="text-2xl font-bold text-blue-700">{stats.active_organizers}</h3>
                              </div>
                              <Building2 className="w-8 h-8 text-blue-300" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-green-50 border-green-100">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-600">Total Organizers</p>
                                <h3 className="text-2xl font-bold text-green-700">{stats.total_organizers}</h3>
                              </div>
                              <Users className="w-8 h-8 text-green-300" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Donors Tab */}
              <TabsContent value="donors" className="pt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Donor Management</CardTitle>
                      <CardDescription>
                        View and manage all registered donors
                      </CardDescription>
                    </div>
                    <Button onClick={fetchDonors} disabled={loadingData}>
                      {loadingData ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {donors.length === 0 && !loadingData ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No donors found</p>
                        <p className="text-sm mt-2">Click Refresh to load donors</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Blood Group</TableHead>
                              <TableHead>Age</TableHead>
                              <TableHead>Donations</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loadingData ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </TableCell>
                              </TableRow>
                            ) : (
                              donors.map((donor) => (
                                <TableRow key={donor.id}>
                                  <TableCell className="font-medium">{donor.full_name}</TableCell>
                                  <TableCell>{donor.email}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{donor.blood_group || "N/A"}</Badge>
                                  </TableCell>
                                  <TableCell>{donor.age || "N/A"}</TableCell>
                                  <TableCell>
                                    <Badge>{donor.total_donations}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    {donor.is_active ? (
                                      <Badge className="bg-green-600">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Active
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        <XCircle className="w-3 h-3 mr-1" /> Inactive
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => toggleDonorActive(donor.id)}
                                      >
                                        {donor.is_active ? (
                                          <ToggleRight className="w-4 h-4" />
                                        ) : (
                                          <ToggleLeft className="w-4 h-4" />
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteDonor(donor.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Organizers Tab */}
              <TabsContent value="organizers" className="pt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Organizer Management</CardTitle>
                      <CardDescription>
                        View and manage event organizers
                      </CardDescription>
                    </div>
                    <Button onClick={fetchOrganizers} disabled={loadingData}>
                      {loadingData ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {organizers.length === 0 && !loadingData ? (
                      <div className="text-center py-8 text-gray-500">
                        <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No organizers found</p>
                        <p className="text-sm mt-2">Click Refresh to load organizers</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Organization</TableHead>
                              <TableHead>Contact Person</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Events</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loadingData ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </TableCell>
                              </TableRow>
                            ) : (
                              organizers.map((organizer) => (
                                <TableRow key={organizer.id}>
                                  <TableCell className="font-medium">{organizer.organization_name}</TableCell>
                                  <TableCell>{organizer.contact_person}</TableCell>
                                  <TableCell>{organizer.email}</TableCell>
                                  <TableCell>{organizer.phone || "N/A"}</TableCell>
                                  <TableCell>
                                    <Badge>{organizer.total_events}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    {organizer.is_verified ? (
                                      <Badge className="bg-green-600">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        <XCircle className="w-3 h-3 mr-1" /> Unverified
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => toggleOrganizerVerified(organizer.id)}
                                      >
                                        {organizer.is_verified ? (
                                          <ToggleRight className="w-4 h-4" />
                                        ) : (
                                          <ToggleLeft className="w-4 h-4" />
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteOrganizer(organizer.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blood Requests Tab */}
              <TabsContent value="bloodrequests" className="pt-4">
                <Card>
                  <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>Blood Request Management</CardTitle>
                      <CardDescription>
                        Review incoming blood requests and update their status
                      </CardDescription>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                      <div className="flex flex-wrap gap-2">
                        <Select
                          value={bloodRequestUrgencyFilter}
                          onValueChange={setBloodRequestUrgencyFilter}
                        >
                          <SelectTrigger className="h-9 w-[130px]">
                            <SelectValue placeholder="Urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All urgencies</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={bloodRequestApprovalFilter}
                          onValueChange={setBloodRequestApprovalFilter}
                        >
                          <SelectTrigger className="h-9 w-[140px]">
                            <SelectValue placeholder="Approval" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All approvals</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={bloodRequestCompletionFilter}
                          onValueChange={setBloodRequestCompletionFilter}
                        >
                          <SelectTrigger className="h-9 w-[150px]">
                            <SelectValue placeholder="Completion" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All completion</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="fulfilled">Fulfilled</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={fetchBloodRequests}
                        disabled={loadingData}
                        className="h-9 rounded-full bg-red-600 hover:bg-red-700 px-4"
                      >
                        {loadingData ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredBloodRequests.length === 0 && !loadingData ? (
                      <div className="text-center py-8 text-gray-500">
                        <Droplet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No blood requests found</p>
                        <p className="text-sm mt-2">
                          Adjust the filters above or click Refresh to load blood requests
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Request</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Urgency</TableHead>
                              <TableHead>Document</TableHead>
                              <TableHead>Statuses</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loadingData ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredBloodRequests.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell className="max-w-[220px]">
                                    <div className="font-medium">
                                      {request.patient_name} ({request.required_blood_group})
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {request.quantity_units} units • {request.hospital_name}
                                    </div>
                                  </TableCell>
                                  <TableCell className="max-w-[200px]">
                                    <div className="text-sm">{request.contact_name}</div>
                                    <div className="text-xs text-gray-500">
                                      {request.contact_phone}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        request.urgency_level === "critical"
                                          ? "bg-red-600"
                                          : request.urgency_level === "urgent"
                                          ? "bg-orange-500"
                                          : "bg-gray-600"
                                      }
                                    >
                                      {request.urgency_level}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {request.medical_proof_url ? (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-blue-600 hover:text-blue-800"
                                        onClick={() => window.open(`${API_URL}${request.medical_proof_url}`, '_blank')}
                                      >
                                        <FileText className="w-4 h-4 mr-1" /> View
                                      </Button>
                                    ) : (
                                      <span className="text-gray-400 text-xs">No doc</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col gap-1 text-xs">
                                      <span>
                                        Approval:{" "}
                                        <span className="font-semibold">
                                          {request.approval_status}
                                        </span>
                                      </span>
                                      <span>
                                        Donor:{" "}
                                        <span className="font-semibold">
                                          {request.donor_status}
                                        </span>
                                      </span>
                                      <span>
                                        Completion:{" "}
                                        <span className="font-semibold">
                                          {request.completion_status}
                                        </span>
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(request.created_at).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col gap-2 items-start">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                          size="sm"
                                          variant="pill"
                                          onClick={() =>
                                            updateBloodRequestStatus(request.id, {
                                              approval_status: "approved",
                                            })
                                          }
                                        >
                                          Approve
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="pillOutline"
                                          onClick={() =>
                                            updateBloodRequestStatus(request.id, {
                                              approval_status: "rejected",
                                              completion_status: "cancelled",
                                            })
                                          }
                                        >
                                          Reject
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="text-red-600 hover:bg-red-50"
                                          onClick={() => navigate(`/blood-request/track/${request.id}`)}
                                          aria-label="Open tracking link"
                                        >
                                          <Link2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        <Button
                                          size="sm"
                                          variant="pillOutline"
                                          onClick={() =>
                                            updateBloodRequestStatus(request.id, {
                                              donor_status: "matched",
                                            })
                                          }
                                        >
                                          Mark Matched
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="pillOutline"
                                          onClick={() =>
                                            updateBloodRequestStatus(request.id, {
                                              donor_status: "confirmed",
                                            })
                                          }
                                        >
                                          Mark Confirmed
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="pillOutline"
                                          onClick={() =>
                                            updateBloodRequestStatus(request.id, {
                                              completion_status: "fulfilled",
                                            })
                                          }
                                        >
                                          Mark Fulfilled
                                        </Button>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="pt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Event Management</CardTitle>
                      <CardDescription>
                        View and manage all blood donation events
                      </CardDescription>
                    </div>
                    <Button onClick={fetchEvents} disabled={loadingData}>
                      {loadingData ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {events.length === 0 && !loadingData ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No events found</p>
                        <p className="text-sm mt-2">Click Refresh to load events</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Organizer</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Participants</TableHead>
                              <TableHead>Donations</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loadingData ? (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </TableCell>
                              </TableRow>
                            ) : (
                              events.map((event) => (
                                <TableRow key={event.id}>
                                  <TableCell className="font-medium">{event.title}</TableCell>
                                  <TableCell>{event.organizer_name}</TableCell>
                                  <TableCell>
                                    {new Date(event.date).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="max-w-[200px] truncate">
                                    {event.location}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{event.total_participants}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge>{event.total_donations}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        event.status === "upcoming"
                                          ? "bg-blue-600"
                                          : event.status === "ongoing"
                                          ? "bg-green-600"
                                          : "bg-gray-600"
                                      }
                                    >
                                      {event.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => deleteEvent(event.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blood Banks Tab */}
              <TabsContent value="bloodbanks" className="pt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Blood Bank Management</CardTitle>
                      <CardDescription>
                        View and manage blood banks and inventory
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateBloodBank}>
                        <Building2 className="w-4 h-4 mr-2" />
                        Add Blood Bank
                      </Button>
                      <Button onClick={fetchBloodBanks} disabled={loadingData} variant="outline">
                        {loadingData ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {bloodBanks.length === 0 && !loadingData ? (
                      <div className="text-center py-8 text-gray-500">
                        <Droplet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No blood banks found</p>
                        <p className="text-sm mt-2">Click Add Blood Bank to create one</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Address</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Registered</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loadingData ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </TableCell>
                              </TableRow>
                            ) : (
                              bloodBanks.map((bloodBank) => (
                                <TableRow key={bloodBank.id}>
                                  <TableCell className="font-medium">{bloodBank.name}</TableCell>
                                  <TableCell className="max-w-[250px] truncate">
                                    {bloodBank.address}
                                    <div className="text-xs text-gray-500">{bloodBank.city}, {bloodBank.state}</div>
                                  </TableCell>
                                  <TableCell>{bloodBank.phone}</TableCell>
                                  <TableCell>{bloodBank.email || "N/A"}</TableCell>
                                  <TableCell>
                                    {new Date(bloodBank.created_at).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditBloodBank(bloodBank)}
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteBloodBank(bloodBank.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    
                    <Dialog open={isBloodBankDialogOpen} onOpenChange={setIsBloodBankDialogOpen}>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{currentBloodBank ? "Edit Blood Bank" : "Add New Blood Bank"}</DialogTitle>
                          <DialogDescription>
                            {currentBloodBank ? "Update blood bank details" : "Enter details for the new blood bank"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="bb-name">Name</Label>
                            <Input
                              id="bb-name"
                              value={bloodBankForm.name}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, name: e.target.value})}
                              placeholder="Blood Bank Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bb-category">Category</Label>
                            <Select
                              value={bloodBankForm.category}
                              onValueChange={(value: "Government" | "Private") => setBloodBankForm({...bloodBankForm, category: value})}
                            >
                              <SelectTrigger id="bb-category">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Government">Government</SelectItem>
                                <SelectItem value="Private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bb-phone">Phone</Label>
                            <Input
                              id="bb-phone"
                              value={bloodBankForm.phone}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, phone: e.target.value})}
                              placeholder="Phone Number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bb-email">Email</Label>
                            <Input
                              id="bb-email"
                              value={bloodBankForm.email}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, email: e.target.value})}
                              placeholder="Email Address"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bb-address">Address</Label>
                            <Textarea
                              id="bb-address"
                              value={bloodBankForm.address}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, address: e.target.value})}
                              placeholder="Full Address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bb-city">City</Label>
                            <Input
                              id="bb-city"
                              value={bloodBankForm.city}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, city: e.target.value})}
                              placeholder="City"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bb-state">State</Label>
                            <Input
                              id="bb-state"
                              value={bloodBankForm.state}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, state: e.target.value})}
                              placeholder="State"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bb-pincode">Pincode</Label>
                            <Input
                              id="bb-pincode"
                              value={bloodBankForm.pincode}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, pincode: e.target.value})}
                              placeholder="Pincode"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bb-hours">Operating Hours</Label>
                            <Input
                              id="bb-hours"
                              value={bloodBankForm.operating_hours}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, operating_hours: e.target.value})}
                              placeholder="e.g. 24/7 or 9AM - 5PM"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Available Blood Types</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => {
                                const currentTypes = bloodBankForm.available_blood_types
                                  ? bloodBankForm.available_blood_types.split(",").map(t => t.trim()).filter(t => t.length > 0)
                                  : [];
                                const isSelected = currentTypes.includes(type);
                                
                                return (
                                  <Button
                                    key={type}
                                    type="button"
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                      let newTypes;
                                      if (isSelected) {
                                        newTypes = currentTypes.filter(t => t !== type);
                                      } else {
                                        newTypes = [...currentTypes, type];
                                      }
                                      setBloodBankForm({
                                        ...bloodBankForm,
                                        available_blood_types: newTypes.join(", ")
                                      });
                                    }}
                                    className={isSelected ? "bg-red-600 hover:bg-red-700" : ""}
                                  >
                                    {type}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bb-lat">Latitude (Optional)</Label>
                            <Input
                              id="bb-lat"
                              value={bloodBankForm.latitude}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, latitude: e.target.value})}
                              placeholder="Latitude"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bb-lng">Longitude (Optional)</Label>
                            <Input
                              id="bb-lng"
                              value={bloodBankForm.longitude}
                              onChange={(e) => setBloodBankForm({...bloodBankForm, longitude: e.target.value})}
                              placeholder="Longitude"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsBloodBankDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleSaveBloodBank}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blogs Tab */}
              <TabsContent value="blogs" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-red-600" />
                      Create Blog Article
                    </CardTitle>
                    <CardDescription>
                      Add new educational, awareness, or story articles for the Blog & Awareness page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="blog-title">Title</Label>
                          <Input
                            id="blog-title"
                            placeholder="10 Benefits of Regular Blood Donation"
                            value={blogTitle}
                            onChange={(event) => setBlogTitle(event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="blog-excerpt">Short description</Label>
                          <Textarea
                            id="blog-excerpt"
                            placeholder="Short 1–2 sentence summary shown on the blog card."
                            value={blogExcerpt}
                            onChange={(event) => setBlogExcerpt(event.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="blog-content">Full content</Label>
                          <Textarea
                            id="blog-content"
                            placeholder="Write the full article content here..."
                            value={blogContent}
                            onChange={(event) => setBlogContent(event.target.value)}
                            className="min-h-[180px]"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={blogCategory}
                            onValueChange={(value: BlogCategory) => setBlogCategory(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Health">Health</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="Awareness">Awareness</SelectItem>
                              <SelectItem value="Stories">Stories</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="blog-read-time">Read time (minutes)</Label>
                          <Input
                            id="blog-read-time"
                            type="number"
                            min={1}
                            placeholder="5"
                            value={blogReadTime}
                            onChange={(event) => setBlogReadTime(event.target.value)}
                          />
                        </div>
                        <div className="flex items-center justify-between rounded-md border bg-gray-50 px-3 py-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span className="text-sm font-medium">Mark as featured</span>
                            </div>
                            <p className="text-xs text-gray-600">
                              Featured blogs can be highlighted on the main blog page.
                            </p>
                          </div>
                          <Switch
                            checked={blogHighlight}
                            onCheckedChange={(checked) => setBlogHighlight(checked)}
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetBlogForm}
                            disabled={creatingBlog}
                          >
                            Reset
                          </Button>
                          <Button
                            type="button"
                            onClick={handleCreateBlog}
                            disabled={creatingBlog}
                          >
                            {creatingBlog ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-4 h-4 mr-2" />
                                Publish Blog
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Manage Blogs</CardTitle>
                      <CardDescription>
                        View and manage existing blog articles
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchBlogs} disabled={fetchingBlogs}>
                      {fetchingBlogs ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                              No blogs found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          blogs.map((blog) => (
                            <TableRow key={blog.id}>
                              <TableCell>{blog.id}</TableCell>
                              <TableCell className="font-medium">{blog.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{blog.category}</Badge>
                              </TableCell>
                              <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteBlog(blog.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [loadingData, setLoadingData] = useState(false);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    active_users_percentage: 0,
    event_completion_percentage: 0,
    donor_retention_percentage: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

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
      
      const response = await fetch(`${API_URL}/api/admin/events`, {
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
      
      const response = await fetch(`${API_URL}/api/admin/blood-banks`, {
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
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="donors">Donors</TabsTrigger>
                <TabsTrigger value="organizers">Organizers</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="bloodbanks">Blood Banks</TabsTrigger>
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
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                        <Users className="w-6 h-6" />
                        <span className="text-sm">Manage Users</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                        <Calendar className="w-6 h-6" />
                        <span className="text-sm">View Events</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                        <Building2 className="w-6 h-6" />
                        <span className="text-sm">Blood Banks</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                        <BarChart3 className="w-6 h-6" />
                        <span className="text-sm">Reports</span>
                      </Button>
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
                    <Button onClick={fetchBloodBanks} disabled={loadingData}>
                      {loadingData ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {bloodBanks.length === 0 && !loadingData ? (
                      <div className="text-center py-8 text-gray-500">
                        <Droplet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No blood banks found</p>
                        <p className="text-sm mt-2">Click Refresh to load blood banks</p>
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
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loadingData ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </TableCell>
                              </TableRow>
                            ) : (
                              bloodBanks.map((bloodBank) => (
                                <TableRow key={bloodBank.id}>
                                  <TableCell className="font-medium">{bloodBank.name}</TableCell>
                                  <TableCell className="max-w-[250px] truncate">
                                    {bloodBank.address}
                                  </TableCell>
                                  <TableCell>{bloodBank.phone}</TableCell>
                                  <TableCell>{bloodBank.email || "N/A"}</TableCell>
                                  <TableCell>
                                    {new Date(bloodBank.created_at).toLocaleDateString()}
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;


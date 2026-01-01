import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, Award, Gift, LogOut, User, Heart, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CertificatesTab from "@/components/CertificatesTab";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    blood_type: "",
    date_of_birth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    weight: "",
    medical_conditions: "",
    emergency_contact: "",
  });

  // Load user data from localStorage on mount and fetch profile from API
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    if (!token) {
      toast({
        title: "Not Logged In",
        description: "Please login first",
        variant: "destructive",
      });
      navigate("/donor-login");
      return;
    }

    // Set initial email from localStorage
    if (email) {
      setProfile((prev) => ({
        ...prev,
        email,
      }));
    }

    // Fetch donor profile from API
    const fetchDonorProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/donors/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile((prev) => ({
            ...prev,
            full_name: data.full_name || "",
            phone: data.phone || "",
            blood_type: data.blood_type || "",
            date_of_birth: data.date_of_birth || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            pincode: data.pincode || "",
            weight: data.weight || "",
            medical_conditions: data.medical_conditions || "",
            emergency_contact: data.emergency_contact || "",
            email: data.email || email,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch donor profile:", error);
      }
    };

    fetchDonorProfile();
  }, [navigate, toast]);

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`http://127.0.0.1:8000/api/donors/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    navigate("/");
  };

  const calculateBMI = () => {
    if (profile.weight) {
      // BMI = weight (kg) / (height (m))^2
      // We're just using weight for a basic calculation
      const weight = parseFloat(profile.weight);
      if (weight > 0) {
        return weight > 50 ? "Normal" : "Underweight";
      }
    }
    return "N/A";
  };

  const sidebarItems = [
    { id: "profile", label: "Update Profile", icon: Settings },
    { id: "certification", label: "Certificates", icon: Award },
    { id: "rewards", label: "Reward", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col">
        {/* User Info */}
        <div className="p-6 border-b border-primary-foreground/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">{profile.full_name || "Donor"}</h3>
              <p className="text-sm opacity-80">Donor</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? "bg-primary-foreground/20 font-medium"
                      : "hover:bg-primary-foreground/10"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary-foreground/20">
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            <span className="font-display font-bold text-xl">RED+</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/blood-banks">
              <Button variant="outline" size="sm" className="rounded-full">
                <MapPin className="w-4 h-4 mr-2" />
                View Blood Bank
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="sm" className="rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                View Events
              </Button>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Alert Banner */}
          <div className="bg-yellow-100 border-l-4 border-primary px-6 py-4 rounded-r-lg mb-8">
            <p className="text-primary font-medium">
              Add your Blood Group & Aadhar no. from update section to retrieve certification
            </p>
          </div>

          {activeTab === "profile" && (
            <div className="bg-card rounded-2xl shadow-soft p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Name:</Label>
                      <Input
                        value={profile.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email:</Label>
                      <Input
                        value={profile.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Phone:</Label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter phone number"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Aadhar No:</Label>
                      <Input
                        value={profile.medical_conditions}
                        onChange={(e) => handleInputChange("medical_conditions", e.target.value)}
                        placeholder="Enter any medical conditions"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Blood Type:</Label>
                      <Select value={profile.blood_type} onValueChange={(value) => handleInputChange("blood_type", value)}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((group) => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact:</Label>
                      <Input
                        value={profile.emergency_contact}
                        onChange={(e) => handleInputChange("emergency_contact", e.target.value)}
                        placeholder="Enter emergency contact"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address:</Label>
                    <Input
                      value={profile.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter address"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>City:</Label>
                      <Input
                        value={profile.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Enter city"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State:</Label>
                      <Input
                        value={profile.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="Enter state"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Pincode:</Label>
                      <Input
                        value={profile.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        placeholder="Enter pincode"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pincode:</Label>
                      <Input
                        value={profile.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        placeholder="Enter pincode"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Date of Birth:</Label>
                      <Input
                        value={profile.date_of_birth}
                        onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                        placeholder="Date of Birth"
                        type="date"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg):</Label>
                      <Input
                        value={profile.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="Weight"
                        type="number"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg):</Label>
                      <Input
                        value={profile.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="Weight"
                        type="number"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>BMI (Based on Age, Height, and Weight):</Label>
                    <Input
                      value={calculateBMI()}
                      readOnly
                      className="rounded-lg bg-muted"
                    />
                  </div>

                  <Button 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    variant="default" 
                    className="mt-4"
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>

                {/* Profile Card */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 rounded-full bg-accent flex items-center justify-center mb-4 shadow-soft">
                    <User className="w-20 h-20 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{profile.full_name}</h3>
                  <p className="text-muted-foreground">
                    Blood Type: {profile.blood_type || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "certification" && (
            <div className="bg-card rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-display font-bold mb-6">Your Certifications</h2>
              <CertificatesTab />
            </div>
          )}

          {activeTab === "rewards" && (
            <div className="bg-card rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-display font-bold mb-6">Your Rewards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-accent rounded-xl p-6">
                  <Gift className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">First Donation</h3>
                  <p className="text-muted-foreground text-sm">Complete your first blood donation to unlock this reward</p>
                  <div className="mt-4 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent rounded-xl p-6">
                  <Heart className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Life Saver</h3>
                  <p className="text-muted-foreground text-sm">Donate blood 5 times to earn this badge</p>
                  <div className="mt-4 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent rounded-xl p-6">
                  <Award className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Champion Donor</h3>
                  <p className="text-muted-foreground text-sm">Donate blood 10 times to become a champion</p>
                  <div className="mt-4 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;

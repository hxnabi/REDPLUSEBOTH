import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, Award, Gift, LogOut, User, Heart, Calendar, MapPin, CheckCircle2, XCircle, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import CertificatesTab from "@/components/CertificatesTab";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState<any>(null);

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
    hemoglobin: "",
    gender: "",
    medical_conditions: "",
    emergency_contact: "",
    total_donations: 0,
    last_donation_date: null as string | null,
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
            hemoglobin: data.hemoglobin || "",
            gender: data.gender || "",
            medical_conditions: data.medical_conditions || "",
            emergency_contact: data.emergency_contact || "",
            email: data.email || email,
            total_donations: data.total_donations || 0,
            last_donation_date: data.last_donation_date || null,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch donor profile:", error);
      }
    };

    fetchDonorProfile();
  }, [navigate, toast]);

  const fetchEligibility = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://127.0.0.1:8000/api/donors/me/eligibility`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEligibility(data);
      }
    } catch (error) {
      console.error("Failed to fetch eligibility:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    // Auto-save after 2 seconds of no typing (debounce)
    clearTimeout((window as any).profileSaveTimeout);
    (window as any).profileSaveTimeout = setTimeout(() => {
      handleSaveProfile();
    }, 2000);
  };

  // Real-time eligibility checker
  const eligibilityStatus = useMemo(() => {
    const checks = {
      hemoglobin: { passed: false, message: "", required: true },
      gender: { passed: false, message: "", required: true },
      weight: { passed: false, message: "", required: true },
      age: { passed: false, message: "", required: true },
      lastDonation: { passed: false, message: "", required: true },
      medicalConditions: { passed: true, message: "", required: false },
    };

    // Check hemoglobin
    if (profile.hemoglobin && profile.gender) {
      const hb = parseFloat(profile.hemoglobin);
      const minHb = profile.gender.toLowerCase() === "male" ? 13.0 : 12.0;
      checks.hemoglobin.passed = hb >= minHb;
      checks.hemoglobin.message = checks.hemoglobin.passed
        ? `✓ Hemoglobin ${hb} g/dL (≥${minHb} required)`
        : `✗ Hemoglobin ${hb} g/dL (Need ≥${minHb} g/dL)`;
    } else {
      checks.hemoglobin.message = profile.hemoglobin ? "Gender required to verify" : "Hemoglobin level required";
    }

    // Check gender
    checks.gender.passed = !!profile.gender;
    checks.gender.message = checks.gender.passed ? "✓ Gender specified" : "Gender required";

    // Check weight
    if (profile.weight) {
      const weight = parseFloat(profile.weight);
      checks.weight.passed = weight >= 50;
      checks.weight.message = checks.weight.passed
        ? `✓ Weight ${weight} kg (≥50 kg required)`
        : `✗ Weight ${weight} kg (Need ≥50 kg)`;
    } else {
      checks.weight.message = "Weight required";
    }

    // Check age
    if (profile.date_of_birth) {
      const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
      checks.age.passed = age >= 18 && age <= 65;
      checks.age.message = checks.age.passed
        ? `✓ Age ${age} years (18-65 required)`
        : `✗ Age ${age} years (Must be 18-65)`;
    } else {
      checks.age.message = "Date of birth required";
    }

    // Check last donation
    if (profile.last_donation_date) {
      const daysSince = Math.floor((new Date().getTime() - new Date(profile.last_donation_date).getTime()) / (1000 * 60 * 60 * 24));
      checks.lastDonation.passed = daysSince >= 90;
      checks.lastDonation.message = checks.lastDonation.passed
        ? `✓ Last donated ${daysSince} days ago (≥90 days required)`
        : `✗ Last donated ${daysSince} days ago (Wait ${90 - daysSince} more days)`;
    } else {
      checks.lastDonation.passed = true;
      checks.lastDonation.message = "✓ No previous donation recorded";
    }

    // Check medical conditions (informational only)
    checks.medicalConditions.passed = !profile.medical_conditions || profile.medical_conditions.trim() === "";
    checks.medicalConditions.message = checks.medicalConditions.passed
      ? "✓ No medical conditions reported"
      : "⚠ Medical conditions noted - consult staff";

    const totalChecks = Object.values(checks).filter(c => c.required).length;
    const passedChecks = Object.values(checks).filter(c => c.required && c.passed).length;
    const progress = (passedChecks / totalChecks) * 100;
    const isEligible = passedChecks === totalChecks;

    return { checks, progress, isEligible, passedChecks, totalChecks };
  }, [profile]);

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
    { id: "past-events", label: "Past Events", icon: Calendar },
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
              <h2 className="text-2xl font-bold mb-6">Donor Profile</h2>
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
                      <Label>Date of Birth:</Label>
                      <Input
                        value={profile.date_of_birth}
                        onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                        placeholder="Date of Birth"
                        type="date"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Weight (kg):</Label>
                      <Input
                        value={profile.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="Weight"
                        type="number"
                        className="rounded-lg"
                      />
                      {profile.weight && parseFloat(profile.weight) > 0 && (
                        <p className={`text-sm ${parseFloat(profile.weight) >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                          {parseFloat(profile.weight) >= 50 ? '✓ Weight is sufficient (≥50 kg)' : '✗ Weight must be above 50 kg'}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Hemoglobin (g/dL):</Label>
                      <Input
                        value={profile.hemoglobin}
                        onChange={(e) => handleInputChange("hemoglobin", e.target.value)}
                        placeholder="Hemoglobin level"
                        type="number"
                        step="0.1"
                        className="rounded-lg"
                      />
                      {profile.hemoglobin && profile.gender && parseFloat(profile.hemoglobin) > 0 && (
                        <p className={`text-sm ${
                          (profile.gender.toLowerCase() === 'female' && parseFloat(profile.hemoglobin) >= 12.5) ||
                          (profile.gender.toLowerCase() === 'male' && parseFloat(profile.hemoglobin) >= 13.0)
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(profile.gender.toLowerCase() === 'female' && parseFloat(profile.hemoglobin) >= 12.5) ||
                           (profile.gender.toLowerCase() === 'male' && parseFloat(profile.hemoglobin) >= 13.0)
                            ? `✓ Hemoglobin is sufficient (${profile.gender === 'female' ? '≥12.5' : '≥13.0'} g/dL)` 
                            : `✗ Hemoglobin must be ${profile.gender === 'female' ? '≥12.5' : '≥13.0'} g/dL`}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Gender:</Label>
                      <Select value={profile.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Age Verification */}
                  {profile.date_of_birth && (
                    <div className="p-4 rounded-lg bg-muted">
                      <p className={`text-sm font-medium ${
                        (() => {
                          const birthDate = new Date(profile.date_of_birth);
                          const today = new Date();
                          let age = today.getFullYear() - birthDate.getFullYear();
                          const monthDiff = today.getMonth() - birthDate.getMonth();
                          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                          }
                          return age >= 18 && age <= 65 ? 'text-green-600' : 'text-red-600';
                        })()
                      }`}>
                        {(() => {
                          const birthDate = new Date(profile.date_of_birth);
                          const today = new Date();
                          let age = today.getFullYear() - birthDate.getFullYear();
                          const monthDiff = today.getMonth() - birthDate.getMonth();
                          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                          }
                          return age >= 18 && age <= 65 
                            ? `✓ Age: ${age} years (Eligible: 18-65 years)` 
                            : `✗ Age: ${age} years (Must be between 18-65 years)`;
                        })()}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Medical Conditions/Aadhar No:</Label>
                      <Input
                        value={profile.medical_conditions}
                        onChange={(e) => handleInputChange("medical_conditions", e.target.value)}
                        placeholder="Enter medical conditions or Aadhar"
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

                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {loading ? "Saving..." : "💾 Save Profile"}
                    </Button>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Auto-saves after you stop typing
                    </p>
                  </div>
                </div>

                {/* Real-time Eligibility Card */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-4">
                    {/* Profile Summary */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <User className="w-12 h-12 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">{profile.full_name || "Your Name"}</h3>
                          <p className="text-sm text-muted-foreground">
                            Blood Type: <span className="font-bold text-primary">{profile.blood_type || "N/A"}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Eligibility Status Card */}
                    <Card className={`border-2 ${
                      eligibilityStatus.isEligible 
                        ? "border-green-500 bg-gradient-to-br from-green-50 to-white" 
                        : "border-orange-500 bg-gradient-to-br from-orange-50 to-white"
                    }`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          {eligibilityStatus.isEligible ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="text-green-600">Ready to Donate!</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5 text-orange-600" />
                              <span className="text-orange-600">Complete Profile</span>
                            </>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">Eligibility Status</span>
                            <span className="font-bold">{Math.round(eligibilityStatus.progress)}%</span>
                          </div>
                          <Progress value={eligibilityStatus.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {eligibilityStatus.passedChecks}/{eligibilityStatus.totalChecks} requirements met
                          </p>
                        </div>

                        <Separator />

                        {/* Requirements */}
                        <div className="space-y-2">
                          {Object.entries(eligibilityStatus.checks).filter(([_, check]) => check.required).map(([key, check]) => (
                            <div key={key} className="flex items-start gap-2">
                              {check.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                              )}
                              <p className={`text-xs ${check.passed ? "text-green-600" : "text-red-600"}`}>
                                {check.message}
                              </p>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        {/* Action */}
                        {eligibilityStatus.isEligible ? (
                          <div className="bg-green-100 rounded-lg p-3">
                            <p className="text-xs font-bold text-green-700 mb-2">
                              🎉 You're eligible!
                            </p>
                            <Link to="/events">
                              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                                Find Events
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="bg-orange-100 rounded-lg p-3">
                            <p className="text-xs font-medium text-orange-700">
                              📋 Fill missing fields to check eligibility
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
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

          {activeTab === "past-events" && (
            <div className="bg-card rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-display font-bold mb-6">Past Events & Donations</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Blood Donation History</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Track your donation journey and see past events you've participated in
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-2xl font-bold text-primary">{profile.total_donations || 0}</p>
                          <p className="text-sm text-muted-foreground">Total Donations</p>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm font-medium text-muted-foreground">Last Donation</p>
                          <p className="text-sm font-bold text-foreground">
                            {profile.last_donation_date 
                              ? new Date(profile.last_donation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                              : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Calendar className="w-12 h-12 text-primary opacity-20" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">Upcoming Events</h3>
                  <Link to="/events">
                    <Button className="w-full" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Browse Available Events
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 p-6 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground">
                    Your detailed donation history will appear here as you participate in more events
                  </p>
                </div>
              </div>
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

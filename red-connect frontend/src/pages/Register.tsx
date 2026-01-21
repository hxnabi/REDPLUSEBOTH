import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, AlertCircle, Droplet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://127.0.0.1:8000";
const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

type UserType = "donor" | "admin" | "organization";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<UserType>("donor");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Donor Form Data
  const [donorData, setDonorData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
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

  // Admin Form Data
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });

  // Organization Form Data
  const [orgData, setOrgData] = useState({
    organization_name: "",
    contact_person: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
    street_address: "",
    city: "",
    state: "",
    pincode: "",
    website: "",
    description: "",
  });

  const handleDonorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonorData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleOrgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrgData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (userType === "donor") {
        // Validate donor data
        if (!donorData.full_name || !donorData.email || !donorData.password || !donorData.blood_type) {
          setError("Please fill in all required fields (Name, Email, Password, Blood Type)");
          setLoading(false);
          return;
        }

        if (donorData.password !== donorData.confirm_password) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (donorData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const payload = {
          full_name: donorData.full_name,
          email: donorData.email,
          password: donorData.password,
          blood_type: donorData.blood_type,
          phone: donorData.phone || null,
          date_of_birth: donorData.date_of_birth || null,
          address: donorData.address || null,
          city: donorData.city || null,
          state: donorData.state || null,
          pincode: donorData.pincode || null,
          weight: donorData.weight ? parseFloat(donorData.weight) : null,
          medical_conditions: donorData.medical_conditions || null,
          emergency_contact: donorData.emergency_contact || null,
        };

        const response = await fetch(`${API_URL}/api/auth/donor/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.detail || "Registration failed. Please try again.");
          setLoading(false);
          return;
        }

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_id", String(data.user_id));
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_email", donorData.email);

        toast({
          title: "Registration Successful",
          description: "Welcome! Redirecting to dashboard...",
        });

        setTimeout(() => navigate("/donor-dashboard"), 1500);
      } else if (userType === "organization") {
        // Validate organization data
        if (!orgData.organization_name || !orgData.contact_person || !orgData.email || !orgData.password || !orgData.phone) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }

        if (orgData.password !== orgData.confirm_password) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (orgData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const payload = {
          organization_name: orgData.organization_name,
          contact_person: orgData.contact_person,
          phone: orgData.phone,
          email: orgData.email,
          password: orgData.password,
          address: orgData.address || null,
          street_address: orgData.street_address || null,
          city: orgData.city || null,
          state: orgData.state || null,
          pincode: orgData.pincode || null,
          website: orgData.website || null,
          description: orgData.description || null,
        };

        const response = await fetch(`${API_URL}/api/auth/organizer/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.detail || "Registration failed. Please try again.");
          setLoading(false);
          return;
        }

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_email", orgData.email);

        toast({
          title: "Registration Successful",
          description: "Welcome! Redirecting to dashboard...",
        });

        setTimeout(() => navigate("/organizer-dashboard"), 1500);
      } else if (userType === "admin") {
        // Admin registration
        if (!adminData.name || !adminData.email || !adminData.password) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }

        if (adminData.password !== adminData.confirm_password) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (adminData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const payload = {
          full_name: adminData.name,
          email: adminData.email,
          password: adminData.password,
          phone: adminData.phone || null,
        };

        const response = await fetch(`${API_URL}/api/auth/admin/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.detail || "Registration failed. Please try again.");
          setLoading(false);
          return;
        }

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_email", adminData.email);

        toast({
          title: "Registration Successful",
          description: "Welcome to RED+ Admin Portal!",
        });

        setTimeout(() => navigate("/admin-dashboard"), 1500);
      }
    } catch (err) {
      setError("Failed to register. Please check your connection and try again.");
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-pink-50 to-orange-50">
        {/* Animated Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#C8102E]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-300/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        
        {/* Floating Blood Drops */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          >
            <Droplet 
              className="text-[#C8102E]/10" 
              size={20 + Math.random() * 30} 
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-5xl">
          {/* Card with Glass Effect */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
            {/* Header with Gradient */}
            <div className="relative bg-gradient-to-r from-[#C8102E] via-[#d61f2e] to-[#C8102E] p-10 text-white overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white animate-pulse"
                    style={{
                      width: `${10 + Math.random() * 30}px`,
                      height: `${10 + Math.random() * 30}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-display font-bold text-3xl">+</span>
                    <Droplet className="absolute -top-2 -right-2 w-6 h-6 text-white fill-white animate-bounce" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-1 tracking-tight">RED+ Registration</h1>
                    <p className="text-red-100 text-lg">Join our community and help save lives</p>
                  </div>
                </div>
                
                {/* Info Badge */}
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">1000+ Lives Saved</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 lg:p-12">
              {/* User Type Selection */}
              <div className="mb-10">
                <div className="text-center mb-6">
                  <Label className="text-2xl font-bold text-gray-800 mb-2 block">
                    Choose Your Role
                  </Label>
                  <p className="text-gray-600">Select how you'd like to contribute to saving lives</p>
                </div>
                <RadioGroup
                  value={userType}
                  onValueChange={(value) => {
                    setUserType(value as UserType);
                    setError("");
                  }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <RadioGroupItem value="donor" id="donor" className="peer sr-only" />
                    <Label
                      htmlFor="donor"
                      className="group flex flex-col items-center justify-between rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-purple-50 p-8 hover:shadow-2xl peer-data-[state=checked]:border-[#9b8bb8] peer-data-[state=checked]:shadow-2xl peer-data-[state=checked]:shadow-purple-200/50 cursor-pointer transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#9b8bb8] to-[#7a6b98] flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Droplet className="w-10 h-10 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 mb-2">Donor</span>
                      <span className="text-sm text-gray-600 text-center leading-relaxed">
                        Register to donate blood and save lives
                      </span>
                    </Label>
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-105">
                    <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                    <Label
                      htmlFor="admin"
                      className="group flex flex-col items-center justify-between rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-blue-50 p-8 hover:shadow-2xl peer-data-[state=checked]:border-[#1a365d] peer-data-[state=checked]:shadow-2xl peer-data-[state=checked]:shadow-blue-200/50 cursor-pointer transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#1a365d] to-[#0f1f3d] flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <span className="text-2xl font-bold text-gray-900 mb-2">Admin</span>
                      <span className="text-sm text-gray-600 text-center leading-relaxed">
                        Manage platform and oversee operations
                      </span>
                    </Label>
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-105">
                    <RadioGroupItem value="organization" id="organization" className="peer sr-only" />
                    <Label
                      htmlFor="organization"
                      className="group flex flex-col items-center justify-between rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50 p-8 hover:shadow-2xl peer-data-[state=checked]:border-[#d4a574] peer-data-[state=checked]:shadow-2xl peer-data-[state=checked]:shadow-orange-200/50 cursor-pointer transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#d4a574] to-[#b48654] flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="text-2xl font-bold text-gray-900 mb-2">Organization</span>
                      <span className="text-sm text-gray-600 text-center leading-relaxed">
                        Organize blood donation events
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm flex items-start gap-3 animate-pulse">
                  <AlertCircle size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

              {/* Form based on user type */}
              <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-gray-50/50 to-white/50 p-8 rounded-2xl border border-gray-100">
            {/* DONOR FORM */}
            {userType === "donor" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="donor_full_name">Full Name*</Label>
                    <Input
                      id="donor_full_name"
                      name="full_name"
                      value={donorData.full_name}
                      onChange={handleDonorChange}
                      placeholder="Enter your full name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="donor_email">Email*</Label>
                    <Input
                      id="donor_email"
                      name="email"
                      type="email"
                      value={donorData.email}
                      onChange={handleDonorChange}
                      placeholder="Enter your email"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="donor_password">Password*</Label>
                    <div className="relative mt-1">
                      <Input
                        id="donor_password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={donorData.password}
                        onChange={handleDonorChange}
                        placeholder="Create password"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="donor_confirm_password">Confirm Password*</Label>
                    <div className="relative mt-1">
                      <Input
                        id="donor_confirm_password"
                        name="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={donorData.confirm_password}
                        onChange={handleDonorChange}
                        placeholder="Re-enter password"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="blood_type">Blood Type*</Label>
                    <select
                      id="blood_type"
                      name="blood_type"
                      value={donorData.blood_type}
                      onChange={(e) => {
                        setDonorData({ ...donorData, blood_type: e.target.value });
                        setError("");
                      }}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b8bb8]"
                      required
                    >
                      <option value="">Select blood type</option>
                      {BLOOD_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={donorData.phone}
                      onChange={handleDonorChange}
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={donorData.city}
                      onChange={handleDonorChange}
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={donorData.state}
                      onChange={handleDonorChange}
                      placeholder="State"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={donorData.pincode}
                      onChange={handleDonorChange}
                      placeholder="Pincode"
                      className="mt-1"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ADMIN FORM */}
            {userType === "admin" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admin_name">Name*</Label>
                    <Input
                      id="admin_name"
                      name="name"
                      value={adminData.name}
                      onChange={handleAdminChange}
                      placeholder="Enter your name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_email">Email*</Label>
                    <Input
                      id="admin_email"
                      name="email"
                      type="email"
                      value={adminData.email}
                      onChange={handleAdminChange}
                      placeholder="Enter your email"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="admin_phone">Phone Number</Label>
                  <Input
                    id="admin_phone"
                    name="phone"
                    type="tel"
                    value={adminData.phone}
                    onChange={handleAdminChange}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admin_password">Password*</Label>
                    <div className="relative mt-1">
                      <Input
                        id="admin_password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={adminData.password}
                        onChange={handleAdminChange}
                        placeholder="Create password"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="admin_confirm_password">Confirm Password*</Label>
                    <div className="relative mt-1">
                      <Input
                        id="admin_confirm_password"
                        name="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={adminData.confirm_password}
                        onChange={handleAdminChange}
                        placeholder="Re-enter password"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

              </>
            )}

            {/* ORGANIZATION FORM */}
            {userType === "organization" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org_name">Organization Name*</Label>
                    <Input
                      id="org_name"
                      name="organization_name"
                      value={orgData.organization_name}
                      onChange={handleOrgChange}
                      placeholder="Enter organization name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_person">Contact Person*</Label>
                    <Input
                      id="contact_person"
                      name="contact_person"
                      value={orgData.contact_person}
                      onChange={handleOrgChange}
                      placeholder="Enter contact person name"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org_email">Email*</Label>
                    <Input
                      id="org_email"
                      name="email"
                      type="email"
                      value={orgData.email}
                      onChange={handleOrgChange}
                      placeholder="Enter organization email"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="org_phone">Phone Number*</Label>
                    <Input
                      id="org_phone"
                      name="phone"
                      type="tel"
                      value={orgData.phone}
                      onChange={handleOrgChange}
                      placeholder="Enter phone number"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org_password">Password*</Label>
                    <div className="relative mt-1">
                      <Input
                        id="org_password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={orgData.password}
                        onChange={handleOrgChange}
                        placeholder="Create password"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="org_confirm_password">Confirm Password*</Label>
                    <div className="relative mt-1">
                      <Input
                        id="org_confirm_password"
                        name="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={orgData.confirm_password}
                        onChange={handleOrgChange}
                        placeholder="Re-enter password"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="org_city">City</Label>
                    <Input
                      id="org_city"
                      name="city"
                      value={orgData.city}
                      onChange={handleOrgChange}
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org_state">State</Label>
                    <Input
                      id="org_state"
                      name="state"
                      value={orgData.state}
                      onChange={handleOrgChange}
                      placeholder="State"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org_pincode">Pincode</Label>
                    <Input
                      id="org_pincode"
                      name="pincode"
                      value={orgData.pincode}
                      onChange={handleOrgChange}
                      placeholder="Pincode"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={orgData.website}
                    onChange={handleOrgChange}
                    placeholder="https://example.com"
                    className="mt-1"
                  />
                </div>
              </>
            )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#C8102E] to-[#a00d25] hover:from-[#a00d25] hover:to-[#800a1f] text-white py-7 text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Droplet className="w-5 h-5" />
                        Register as {userType === "organization" ? "Organization" : userType.charAt(0).toUpperCase() + userType.slice(1)}
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-lg">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        if (userType === "donor") navigate("/donor-login");
                        else if (userType === "organization") navigate("/organizer-login");
                        else if (userType === "admin") navigate("/admin-login");
                        else navigate("/donor-login");
                      }}
                      className="text-[#C8102E] font-bold hover:text-[#a00d25] hover:underline transition-colors duration-300"
                    >
                      Login here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;


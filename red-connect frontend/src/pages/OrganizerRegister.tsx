import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://127.0.0.1:8000";

const OrganizerRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    contact_person: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    organization_name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    registration_number: "",
    website: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.contact_person || !formData.email || !formData.password || !formData.organization_name) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        contact_person: formData.contact_person,
        phone: formData.phone || null,
        email: formData.email,
        password: formData.password,
        organization_name: formData.organization_name,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        pincode: formData.pincode || null,
        registration_number: formData.registration_number || null,
        website: formData.website || null,
        description: formData.description || null,
      };

      const response = await fetch(`${API_URL}/api/auth/organizer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("user_email", formData.email);

      toast({
        title: "Registration Successful",
        description: "Welcome to RED+ Event Organizer Portal! Redirecting...",
      });

      setTimeout(() => {
        navigate("/organizer-dashboard");
      }, 1500);
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
    <div className="min-h-screen bg-[#d4a574] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Form Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <h1 className="text-3xl font-bold text-[#1a5f4a] mb-2">
            EVENT ORGANIZER<br />REGISTRATION
          </h1>
          <p className="text-gray-600 mb-6">
            Join our network of organizers and help coordinate life-saving blood donation events
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_person" className="text-gray-700 font-medium">
                  Contact Person*
                </Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  type="text"
                  placeholder="Enter contact person name"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-50 border-gray-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Contact Number*
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter contact number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-50 border-gray-200"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 bg-gray-50 border-gray-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password*
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 pr-10"
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
                <Label htmlFor="confirm_password" className="text-gray-700 font-medium">
                  Confirm Password*
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 pr-10"
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
                <Label htmlFor="organization_name" className="text-gray-700 font-medium">
                  Organization Name*
                </Label>
                <Input
                  id="organization_name"
                  name="organization_name"
                  type="text"
                  placeholder="Enter organization name"
                  value={formData.organization_name}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-50 border-gray-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="registration_number" className="text-gray-700 font-medium">
                  Registration Number
                </Label>
                <Input
                  id="registration_number"
                  name="registration_number"
                  type="text"
                  placeholder="Enter registration number"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-gray-700 font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-gray-700 font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="pincode" className="text-gray-700 font-medium">
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website" className="text-gray-700 font-medium">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleInputChange}
                className="mt-1 bg-gray-50 border-gray-200"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a5f4a] hover:bg-[#2d7a5e] text-white py-6 text-lg font-semibold mt-2 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register as Organizer"}
            </Button>

            <p className="text-center text-gray-600 pt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/organizer-login")}
                className="text-[#1a5f4a] font-medium hover:underline"
              >
                Login to your account
              </button>
            </p>
          </form>
        </div>

        {/* Right Image Section */}
        <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            {/* Calendar pattern */}
            <div className="absolute inset-0 grid grid-cols-7 gap-1 p-4 transform rotate-12 scale-125">
              {[...Array(42)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square flex items-center justify-center text-xs font-medium"
                  style={{
                    color: i % 7 === 0 ? '#C8102E' : '#374151',
                    opacity: 0.3 + Math.random() * 0.5,
                  }}
                >
                  {(i % 31) + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-8 right-8 text-2xl font-bold text-gray-400 opacity-60">JUNE</div>
          <div className="absolute top-20 left-8 text-xl font-bold text-gray-400 opacity-50">MAY</div>
          <div className="absolute bottom-20 right-12 text-xl font-bold text-gray-400 opacity-50">AUGUST</div>
          <div className="absolute bottom-8 left-8 text-lg font-bold text-gray-400 opacity-40">SEPT</div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerRegister;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://127.0.0.1:8000";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", String(data.user_id));
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("user_email", formData.email);

      toast({
        title: "Login Successful",
        description: "Welcome back, Admin!",
      });

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1000);
    } catch (err) {
      setError("Failed to login. Please check your connection and try again.");
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-8 text-white text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
          <p className="text-slate-200">Secure Access Only</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Admin Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@redplus.com"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 bg-gray-50 border-gray-200"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 text-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </Button>

            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                Don't have an admin account?{" "}
                <Link
                  to="/"
                  className="text-slate-900 font-medium hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-center text-gray-500 text-sm">
                <Link to="/home" className="hover:text-slate-900 hover:underline">
                  ← Back to Home
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


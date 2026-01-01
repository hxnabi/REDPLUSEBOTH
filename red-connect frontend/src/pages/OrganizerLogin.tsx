import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://127.0.0.1:8000";

const OrganizerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already logged in as a different role
  useEffect(() => {
    const userRole = localStorage.getItem("user_role");
    const token = localStorage.getItem("access_token");
    
    if (token && userRole === "donor") {
      toast({
        title: "Already Logged In",
        description: "You are logged in as a donor. Please logout first.",
        variant: "destructive",
      });
      navigate("/donor-dashboard");
    }
  }, [navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/organizer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed. Please try again.");
        toast({
          title: "Login Failed",
          description: data.detail || "Incorrect email or password",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", String(data.user_id));
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("user_email", email);

      toast({
        title: "Login Successful",
        description: "Welcome back, organizer!",
      });

      setTimeout(() => {
        navigate("/organizer-dashboard");
      }, 1000);
    } catch (err) {
      const errorMsg = "Failed to login. Please check your connection and try again.";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, hsl(30, 60%, 70%) 0%, hsl(35, 50%, 65%) 100%)" }}>
      <div className="w-full max-w-4xl bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left - Form */}
        <div className="flex-1 p-8 md:p-12 bg-cream/50">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">+</span>
            </div>
            <span className="font-display font-bold text-lg text-primary">RED</span>
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a5a3c] mb-2">
            EVENT ORGANIZER<br />PORTAL
          </h1>
          <p className="text-muted-foreground mb-8">
            Access your organizer dashboard. Manage your events, donations, and track participation.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={loading}
                className="mt-2 h-12 rounded-lg bg-muted/50 border-border focus:border-green disabled:opacity-50"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  className="h-12 rounded-lg bg-muted/50 border-border focus:border-green pr-12 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-green text-sm hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" variant="green" size="xl" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login to Organizer Account"}
            </Button>

            <p className="text-center text-muted-foreground">
              New organizer?{" "}
              <Link to="/organizer-register" className="text-green font-medium hover:underline">
                Create an organizer account
              </Link>
            </p>
          </form>
        </div>

        {/* Right - Image */}
        <div className="flex-1 relative hidden md:flex items-center justify-center p-8 bg-muted/50">
          {/* Calendar illustration */}
          <div className="relative">
            <div className="w-72 h-64 bg-card rounded-2xl shadow-lg p-4">
              <div className="grid grid-cols-7 gap-2">
                {[22, 13, 23, 20, 24, 25, 26].map((day, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 flex items-center justify-center text-lg font-medium rounded ${
                      day === 24 ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-green/20 rounded-full animate-float" />
            <Calendar className="absolute bottom-4 right-4 w-12 h-12 text-green/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLogin;

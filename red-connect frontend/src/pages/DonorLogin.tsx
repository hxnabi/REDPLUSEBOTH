import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const API_URL = "http://127.0.0.1:8000";

const DonorLogin = () => {
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
    
    if (token && userRole === "organizer") {
      toast({
        title: "Already Logged In",
        description: "You are logged in as an organizer. Please logout first.",
        variant: "destructive",
      });
      navigate("/organizer-dashboard");
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
      const response = await fetch(`${API_URL}/api/auth/donor/login`, {
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
        description: "Welcome back, donor!",
      });

      setTimeout(() => {
        navigate("/donor-dashboard");
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError("");
    
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Send ID token to backend
      const response = await api.googleAuthDonor(credentialResponse.credential);
      
      if (response.detail) {
        setError(response.detail);
        toast({
          title: "Login Failed",
          description: response.detail,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("user_id", String(response.user_id));
      localStorage.setItem("user_role", response.role);
      localStorage.setItem("user_email", response.email || "");

      toast({
        title: "Login Successful",
        description: "Welcome back, donor!",
      });

      setTimeout(() => {
        navigate("/donor-dashboard");
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to login with Google. Please try again.";
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

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    toast({
      title: "Error",
      description: "Google login failed. Please try again.",
      variant: "destructive",
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, hsl(260, 30%, 80%) 0%, hsl(260, 25%, 75%) 100%)" }}>
      <div className="w-full max-w-4xl bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left - Form */}
        <div className="flex-1 p-8 md:p-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#2d3561] mb-2">
            DONOR PORTAL
          </h1>
          <p className="text-muted-foreground mb-8">
            Access your donor profile and certificate. Manage your blood donation history and more.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
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
                className="mt-2 h-12 rounded-lg bg-muted/50 border-border focus:border-primary"
                disabled={loading}
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
                  className="h-12 rounded-lg bg-muted/50 border-border focus:border-primary pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-primary text-sm hover:underline">Forgot password?</a>
            </div>

            <Button 
              type="submit" 
              variant="default" 
              size="xl" 
              className="w-full rounded-lg bg-[#2d3561] hover:bg-[#1e2442]"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Donor Account"}
            </Button>

            <div className="relative flex items-center justify-center">
              <span className="bg-card px-4 text-muted-foreground text-sm z-10 relative">OR</span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            <p className="text-center text-muted-foreground">
              New donor?{" "}
              <button
                type="button"
                onClick={() => navigate("/donor-eligibility")}
                className="text-primary font-medium hover:underline"
              >
                Check eligibility & register
              </button>
            </p>
          </form>
        </div>

        {/* Right - Image */}
        <div className="flex-1 bg-primary relative hidden md:flex items-center justify-center p-8">
          <div className="relative">
            {/* Heart hands illustration placeholder */}
            <div className="w-64 h-64 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <div className="text-8xl">❤️</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary-foreground/20 rounded-full animate-float" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorLogin;

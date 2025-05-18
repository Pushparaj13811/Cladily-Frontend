import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Checkbox } from "@app/components/ui/checkbox";
import { Link } from "react-router-dom";
import { COMPANY } from "@shared/constants";
import { Eye, EyeOff } from "lucide-react";
import { LoginHelper } from "./components";
import { useAppDispatch, useAuth } from "@app/hooks/useAppRedux";
import { login, clearError } from "@features/auth/authSlice";
import { useToast } from "@app/hooks/use-toast";
import { LocationState } from "@shared/types";

// Helper function to render error message with additional help for JWT errors
const formatErrorMessage = (error: string | null): ReactNode => {
  if (!error) return '';
  
  // Check if it's a JWT configuration error
  if (error.includes('JWT configuration') || error.includes('secretOrPrivateKey')) {
    return (
      <>
        <strong>Server Configuration Error:</strong> The authentication system is not properly configured. 
        <br /><br />
        Please contact the administrator and report the following error:
        <br />
        <code className="block mt-2 p-2 bg-red-100 rounded text-xs">{error}</code>
      </>
    );
  }
  
  return error;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Get auth state from Redux
  const { isLoading, error, isAuthenticated } = useAuth();
  
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they were trying to access or dashboard
      const from = (location.state as LocationState)?.from?.pathname || "/account";
      navigate(from, { replace: true });
      
      toast({
        title: "Login successful",
        description: "You've been successfully logged in.",
      });
    }
  }, [isAuthenticated, navigate, location, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ phone, password }));
  };

  const renderPasswordToggle = () => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-0 top-0 h-full px-3"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Eye className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );

  return (
    <div className="flex min-h-[calc(100vh-300px)] flex-col justify-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{COMPANY.NAME}</h1>
          <h2 className="text-2xl font-semibold mt-6 mb-2">Sign in</h2>
          <p className="text-muted-foreground">
            Enter your details to access your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
            {formatErrorMessage(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              {renderPasswordToggle()}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
            />
            <label
              htmlFor="remember-me"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>

        <LoginHelper />

        <div className="mt-8 pt-8 border-t">
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full">
              Continue with Apple
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
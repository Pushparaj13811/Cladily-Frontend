import { useState, useEffect } from "react";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { COMPANY } from "@shared/constants";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAppDispatch, useAuth } from "@app/hooks/useAppRedux";
import { resetPassword, clearError } from "@features/auth/authSlice";
import { useToast } from "@app/hooks/use-toast";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Get auth state from Redux
  const { isLoading, error } = useAuth();
  
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check if token exists
  if (!token && !isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-300px)] flex-col justify-center py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{COMPANY.NAME}</h1>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Invalid Reset Link</h2>
            <p className="text-muted-foreground">
              The password reset link is invalid or has expired.
            </p>
          </div>
          <div className="text-center mt-8">
            <Link to="/forgot-password">
              <Button className="w-full">Request a new reset link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    // Validate passwords
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }
    
    if (!token) {
      setValidationError("Token is missing");
      return;
    }
    
    // Dispatch reset password action
    const resultAction = await dispatch(resetPassword({ token, password }));
    
    if (resetPassword.fulfilled.match(resultAction)) {
      setIsSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated successfully.",
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-300px)] flex-col justify-center py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{COMPANY.NAME}</h1>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Password Reset Successful</h2>
            <p className="text-muted-foreground">
              Your password has been reset successfully.
            </p>
          </div>
          
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <p className="text-muted-foreground">
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Go to sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-300px)] flex-col justify-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{COMPANY.NAME}</h1>
          <h2 className="text-2xl font-semibold mt-6 mb-2">Create a new password</h2>
          <p className="text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {(validationError || error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
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
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters long and include a number and a special character.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm New Password
            </label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Reset password"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 
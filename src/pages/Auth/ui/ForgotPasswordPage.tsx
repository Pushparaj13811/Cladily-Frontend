import { useState } from "react";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Link } from "react-router-dom";
import { COMPANY } from "@shared/constants";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Success case
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-[calc(100vh-300px)] flex-col justify-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{COMPANY.NAME}</h1>
          <h2 className="text-2xl font-semibold mt-6 mb-2">Reset your password</h2>
          <p className="text-muted-foreground">
            {isSubmitted 
              ? "Check your email for reset instructions" 
              : "Enter your email and we'll send you a link to reset your password"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
            {error}
          </div>
        )}

        {isSubmitted ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <p className="text-muted-foreground">
              We've sent a password reset link to <span className="font-medium">{email}</span>.
              Please check your email and follow the instructions to reset your password.
            </p>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Try a different email
              </Button>
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Back to sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 
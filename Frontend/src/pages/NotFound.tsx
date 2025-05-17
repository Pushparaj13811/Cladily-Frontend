import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl md:text-4xl font-medium mt-6 mb-4 text-center">
        Page Not Found
      </h2>
      <p className="text-lg text-muted-foreground text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
} 
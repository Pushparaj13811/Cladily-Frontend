import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Customer Service Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Orders and delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Returns and refunds
                </Link>
              </li>
              <li>
                <Link to="/payment" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Payment and pricing
                </Link>
              </li>
              <li>
                <Link to="/crypto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cryptocurrency payments
                </Link>
              </li>
              <li>
                <Link to="/promotion-terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Promotion terms and conditions
                </Link>
              </li>
              <li>
                <Link to="/promise" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  CLADILY Customer Promise
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">About CLADILY</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  CLADILY partner boutiques
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  CLADILY app
                </Link>
              </li>
              <li>
                <Link to="/modern-slavery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Modern slavery statement
                </Link>
              </li>
              <li>
                <Link to="/advertising" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  CLADILY Advertising
                </Link>
              </li>
            </ul>
          </div>

          {/* Discounts & Membership Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Discounts & Membership</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/affiliate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Affiliate program
                </Link>
              </li>
              <li>
                <Link to="/refer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Refer a friend
                </Link>
              </li>
              <li>
                <Link to="/membership" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  CLADILY membership
                </Link>
              </li>
            </ul>

            <h3 className="text-lg font-medium mb-4 mt-8">Follow us</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-lg font-medium mb-6">Never miss a thing</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sign up for promotions, tailored new arrivals, stock updates and more – straight to your inbox
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button className="sm:w-auto" type="submit">
              Sign Up
            </Button>
          </div>
          
          <div className="mt-4 flex items-start gap-2">
            <input
              type="checkbox"
              id="sms-consent"
              className="mt-1 h-4 w-4 rounded border-input"
            />
            <label htmlFor="sms-consent" className="text-sm text-muted-foreground">
              SMS
            </label>
          </div>
          
          <p className="mt-4 text-xs text-muted-foreground">
            By signing up, you consent to receiving marketing by email and/or SMS and acknowledge you have read our
            {" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . Unsubscribe anytime at the bottom of our emails or by replying STOP to any of our SMS.
          </p>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms and conditions
            </Link>
            <Link to="/accessibility" className="text-xs text-muted-foreground hover:text-foreground">
              Accessibility
            </Link>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">
              'CLADILY' and the 'CLADILY' logo are trade marks of CLADILY Ltd and are registered in numerous jurisdictions around the world.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © Copyright {new Date().getFullYear()} CLADILY Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
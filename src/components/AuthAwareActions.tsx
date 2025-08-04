import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Shield } from "lucide-react";

interface AuthAwareActionsProps {
  className?: string;
}

export const AuthAwareActions = ({ className }: AuthAwareActionsProps) => {
  const { user, profile, signOut } = useAuth();

  // If user is logged in, show appropriate portal access
  if (user && profile) {
    const isAdmin = profile?.role_id === '5d867d9b-0bf7-4822-87ad-2637136b45f7';
    const isClient = profile?.role_id === '25fafd5b-23ba-49a8-b632-01cd0179c3dc';

    return (
      <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
        {isClient && (
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 button-shadow transition-luxury"
            asChild
          >
            <Link to="/portal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Access Your Portal
            </Link>
          </Button>
        )}
        
        {isAdmin && (
          <Button 
            size="lg" 
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold px-8 py-4 button-shadow transition-luxury"
            asChild
          >
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Dashboard
            </Link>
          </Button>
        )}

        <Button 
          size="lg" 
          variant="outline"
          className="font-semibold px-8 py-4 button-shadow transition-luxury"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>

        <div className="text-sm text-foreground-secondary flex items-center">
          Welcome, {profile.full_name || user.email}
        </div>
      </div>
    );
  }

  // If not logged in, show the original actions
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <Button 
        size="lg" 
        className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 button-shadow transition-luxury"
        asChild
      >
        <Link to="/assessment">Start Assessment</Link>
      </Button>
      <Button 
        size="lg" 
        variant="outline"
        className="font-semibold px-8 py-4 button-shadow transition-luxury"
        asChild
      >
        <Link to="/auth">User Login</Link>
      </Button>
    </div>
  );
};
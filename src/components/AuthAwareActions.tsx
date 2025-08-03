import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Shield } from "lucide-react";
import { useState } from "react";
import { NDAGate } from "./NDAGate";

interface AuthAwareActionsProps {
  className?: string;
}

export const AuthAwareActions = ({ className }: AuthAwareActionsProps) => {
  const { user, profile, signOut } = useAuth();
  const [showNDA, setShowNDA] = useState(false);

  // If user is logged in, show appropriate portal access
  if (user && profile) {
    const isAdmin = profile.role?.name === 'admin';
    const isClient = profile.role?.name === 'client';

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
    <>
      <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
        <Button 
          size="lg" 
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 button-shadow transition-luxury"
          onClick={() => setShowNDA(true)}
        >
          Sign NDA
        </Button>
        <Button 
          size="lg" 
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 button-shadow transition-luxury"
          onClick={() => setShowNDA(true)}
        >
          Start Assessment
        </Button>
        <Button 
          size="lg" 
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 button-shadow transition-luxury"
          asChild
        >
          <Link to="/auth?logout">User Login</Link>
        </Button>
      </div>

      {/* NDA Gate Modal */}
      {showNDA && <NDAGate onClose={() => setShowNDA(false)} />}
    </>
  );
};
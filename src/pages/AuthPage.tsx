
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [initLoading, setInitLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log('AuthPage: Starting auth check...');
    
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        console.log('AuthPage: Getting session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthPage: Session error:', sessionError);
          setInitLoading(false);
          return;
        }

        console.log('AuthPage: Session result:', session?.user?.id || 'No session');
        
        if (session?.user) {
          console.log('AuthPage: User found, fetching profile...');
          
          // Check user role and redirect accordingly
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*, role:user_roles(*)')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('AuthPage: Profile fetch error:', profileError);
            // Don't block - user might not have profile yet
          }

          console.log('AuthPage: Profile result:', profile?.role?.name || 'No profile');
          
          // Store current user info for logout option
          setCurrentUser({
            email: session.user.email,
            role: profile?.role?.name || 'unknown'
          });
          
          // Only auto-redirect if not explicitly requesting logout
          if (!searchParams.has('logout')) {
            console.log('AuthPage: Auto-redirecting based on role:', profile?.role?.name);
            
            if (profile?.role?.name === 'client') {
              navigate('/portal', { replace: true });
              return;
            } else if (profile?.role?.name === 'admin') {
              navigate('/admin/dashboard', { replace: true });
              return;
            } else {
              navigate('/', { replace: true });
              return;
            }
          }
        }
      } catch (error) {
        console.error('AuthPage: Unexpected error in checkAuth:', error);
      } finally {
        setInitLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('AuthPage: Starting authentication...', { isLogin, email });
      
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('AuthPage: Login error:', error);
          throw error;
        }

        console.log('AuthPage: Login successful, user ID:', data.user?.id);

        if (data.user) {
          // Fetch user profile to determine role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*, role:user_roles(*)')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('AuthPage: Profile fetch error after login:', profileError);
            // Continue anyway - might be new user
          }

          console.log('AuthPage: Redirecting based on role:', profile?.role?.name);

          if (profile?.role?.name === 'client') {
            navigate('/portal', { replace: true });
          } else if (profile?.role?.name === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
          
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          });
        }
      } else {
        console.log('AuthPage: Starting signup...');
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          console.error('AuthPage: Signup error:', error);
          throw error;
        }

        console.log('AuthPage: Signup successful');

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      console.error('AuthPage: Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log('AuthPage: Logging out...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthPage: Logout error:', error);
        throw error;
      }
      
      setCurrentUser(null);
      console.log('AuthPage: Logout successful');
      
      toast({
        title: "Signed out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('AuthPage: Logout error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during initialization
  if (initLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            {currentUser && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Currently signed in as:</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email} ({currentUser.role})</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {currentUser 
                ? 'You are already signed in. Sign out to use different credentials.'
                : isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Create a new account to get started'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" style={{ opacity: currentUser ? 0.5 : 1 }}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!!currentUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!!currentUser}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !!currentUser}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
                disabled={!!currentUser}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>

            {/* Test credentials helper */}
            <div className="mt-6 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center mb-2">Test Client Credentials:</p>
              <p className="text-xs font-mono text-center">testclient@example.com</p>
              <p className="text-xs font-mono text-center">test123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

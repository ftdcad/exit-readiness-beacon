
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role_id: string | null;
  role?: {
    name: string;
    permissions: any;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    console.log('useAuth: Starting initialization...');
    
    // Fetch user profile function
    const fetchUserProfile = async (userId: string) => {
      try {
        console.log('useAuth: Fetching profile for user:', userId);
        
        // Get the profile with role data in a single query using JOIN
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*, role:user_roles(*)')
          .eq('id', userId)
          .maybeSingle();

        console.log('useAuth: Profile query result:', { profileData, profileError });

        if (profileError) {
          console.error('useAuth: Error fetching profile:', profileError);
          // Set empty profile but don't block loading completion
          if (mounted) {
            setProfile(null);
          }
          return;
        }

        if (profileData) {
          if (mounted) {
            const profileWithRole = {
              id: profileData.id,
              email: profileData.email,
              full_name: profileData.full_name,
              role_id: profileData.role_id,
              role: profileData.role || null
            };
            setProfile(profileWithRole);
            console.log('useAuth: Profile set successfully:', { role: profileData.role?.name });
          }
        } else {
          console.log('useAuth: No profile found for user');
          if (mounted) {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('useAuth: Error in fetchUserProfile:', error);
        // Ensure profile is set to null on any error
        if (mounted) {
          setProfile(null);
        }
      }
    };

    // Set up auth state listener
    console.log('useAuth: Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuth: Auth state changed:', event, session?.user?.id || 'No user');
        
        if (!mounted) {
          console.log('useAuth: Component unmounted, ignoring auth change');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Use setTimeout to avoid blocking the auth state change callback
        setTimeout(async () => {
          if (!mounted) return;
          
          try {
            if (session?.user) {
              // Safety net: ensure a profile row exists before we query it (prevents flicker)
              const { error: ensureProfileError } = await supabase.rpc('ensure_profile');
              if (ensureProfileError) {
                console.warn('useAuth: ensure_profile RPC returned error:', ensureProfileError);
              }

              await fetchUserProfile(session.user.id);
            } else {
              setProfile(null);
            }
          } catch (error) {
            console.error('useAuth: Error in profile fetch after auth change:', error);
            setProfile(null);
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        }, 0);
      }
    );

    return () => {
      console.log('useAuth: Cleaning up...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('useAuth: Attempting sign in for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('useAuth: Sign in error:', error);
      } else {
        console.log('useAuth: Sign in successful');
      }
      
      return { error };
    } catch (error) {
      console.error('useAuth: Unexpected error in signIn:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('useAuth: Attempting sign out...');
      
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setSession(null);
        setProfile(null);
        console.log('useAuth: Sign out successful');
      } else {
        console.error('useAuth: Sign out error:', error);
      }
      return { error };
    } catch (error) {
      console.error('useAuth: Unexpected error in signOut:', error);
      return { error };
    }
  };

  const isAdmin = () => {
    const result = profile?.role?.name === 'admin';
    console.log('useAuth: isAdmin check:', result, 'role:', profile?.role?.name);
    return result;
  };

  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signOut,
    isAdmin,
  };
};

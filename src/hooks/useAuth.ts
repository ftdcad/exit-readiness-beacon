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
    
    // Fetch user profile function
    const fetchUserProfile = async (userId: string) => {
      try {
        console.log('Fetching profile for user:', userId);
        
        // Get the profile
        const { data: profileData, error: profileError } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Set empty profile but don't block loading completion
          if (mounted) {
            setProfile(null);
          }
          return;
        }

        if (profileData) {
          // Get the role if role_id exists
          let roleData = null;
          if (profileData.role_id) {
            try {
              const { data: role, error: roleError } = await (supabase as any)
                .from('user_roles')
                .select('*')
                .eq('id', profileData.role_id)
                .maybeSingle();
              
              if (roleError) {
                console.error('Error fetching role:', roleError);
              } else {
                roleData = role;
              }
            } catch (roleErr) {
              console.error('Failed to fetch role:', roleErr);
            }
          }

          if (mounted) {
            setProfile({
              id: profileData.id,
              email: profileData.email,
              full_name: profileData.full_name,
              role_id: profileData.role_id,
              role: roleData
            });
            console.log('Profile set:', { role: roleData?.name });
          }
        } else {
          console.log('No profile found for user');
          if (mounted) {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        // Ensure profile is set to null on any error
        if (mounted) {
          setProfile(null);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        try {
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          setProfile(null);
        } finally {
          // Always set loading to false, regardless of success/failure
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    return { error };
  };

  const isAdmin = () => {
    return profile?.role?.name === 'admin';
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
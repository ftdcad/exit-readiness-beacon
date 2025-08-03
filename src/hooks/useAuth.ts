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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile with role
          setTimeout(async () => {
            try {
              // First get the profile
              const { data: profileData } = await (supabase as any)
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profileData) {
                // Then get the role if role_id exists
                let roleData = null;
                if (profileData.role_id) {
                  const { data: role } = await (supabase as any)
                    .from('user_roles')
                    .select('*')
                    .eq('id', profileData.role_id)
                    .single();
                  roleData = role;
                }

                setProfile({
                  id: profileData.id,
                  email: profileData.email,
                  full_name: profileData.full_name,
                  role_id: profileData.role_id,
                  role: roleData
                });
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
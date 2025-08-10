
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ClientRouteProps {
  children: React.ReactNode;
}

export const ClientRoute = ({ children }: ClientRouteProps) => {
  const { user, profile, loading } = useAuth();

  console.log('ClientRoute: Checking access...', { 
    user: user?.id || 'No user', 
    profile: profile?.role?.name || 'No profile',
    loading 
  });

  if (loading) {
    console.log('ClientRoute: Still loading, showing spinner...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ClientRoute: No user, redirecting to auth...');
    return <Navigate to="/auth" replace />;
  }

  const isClient = profile?.role?.name === 'client';
  if (!isClient) {
    console.log('ClientRoute: User is not a client, redirecting home. Role:', profile?.role?.name);
    return <Navigate to="/" replace />;
  }

  console.log('ClientRoute: Access granted for client');
  return <>{children}</>;
};


import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ requireAuth = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // Redirect to the home page if the user is already authenticated
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

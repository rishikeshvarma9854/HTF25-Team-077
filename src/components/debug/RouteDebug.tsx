import React from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile } from '@/context/ProfileContext';

export default function RouteDebug() {
  const location = useLocation();
  const { authUser, isAuthLoading } = useProfile();

  // Visible only in development to help diagnose mobile routing issues.
  if (import.meta.env.PROD) return null;

  return (
    <div className="md:hidden fixed bottom-16 left-1/2 transform -translate-x-1/2 z-60 pointer-events-auto">
      <div className="px-3 py-1.5 bg-black/75 text-white text-xs rounded-full backdrop-blur flex items-center gap-3">
        <span className="font-medium">{location.pathname}</span>
        <span className="opacity-70">{isAuthLoading ? 'auth:loading' : authUser ? `auth:yes` : 'auth:no'}</span>
      </div>
    </div>
  );
}

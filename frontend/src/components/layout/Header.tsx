import { Link } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import Button from '../common/Button';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useState } from 'react';

export default function Header() {
  const { profile, authUser, signInWithGoogle, signOut, isAuthLoading } = useProfile();
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-200 bg-white/90 backdrop-blur">
      <div className="container-responsive h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/icon.svg" alt="OutfitAI" className="h-8 w-8" />
          <span className="font-display text-xl font-semibold text-brand-900">OutfitAI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link className="font-medium text-brand-700 hover:text-brand-900 transition" to="/">Home</Link>
          <Link className="font-medium text-brand-700 hover:text-brand-900 transition" to="/wardrobe">Wardrobe</Link>
          <Link className="font-medium text-brand-700 hover:text-brand-900 transition" to="/outfits">Outfits</Link>
          <Link className="font-medium text-brand-700 hover:text-brand-900 transition" to="/chat">Stylist</Link>
          {isAuthLoading ? (
            <div className="px-4 py-2 text-sm text-brand-500">Loading…</div>
          ) : authUser ? (
            <Link className="rounded-full bg-brand-900 px-4 py-2 text-white hover:bg-brand-800 transition flex items-center gap-3" to="/profile">
              <span className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold overflow-hidden">
                {profile?.avatar && !avatarError ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img
                    src={profile.avatar}
                    alt={profile?.name || 'User'}
                    className="h-full w-full object-cover"
                    onError={() => {
                      console.warn('Avatar failed to load:', profile.avatar);
                      setAvatarError(true);
                    }}
                  />
                ) : (
                  <span>{(profile?.name || 'U')[0].toUpperCase()}</span>
                )}
              </span>
              <span className="hidden sm:inline">{profile?.name || authUser.email || 'Profile'}</span>
            </Link>
          ) : (
            isSupabaseConfigured ? (
              <Button onClick={signInWithGoogle} variant="outline">Sign in with Google</Button>
            ) : (
              <button
                className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-all border-2 border-brand-300 text-brand-900 bg-brand-100"
                title="Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
                disabled
              >
                Sign in with Google
              </button>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
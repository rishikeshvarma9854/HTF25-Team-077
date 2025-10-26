import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import localforage from 'localforage';
import { UserProfile, UserPreferences, UsageStatistics, DEFAULT_PREFERENCES } from '../types/profile';
import { useWardrobe } from './WardrobeContext';
import { useOutfits } from './OutfitContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

interface ProfileContextValue {
  profile: UserProfile | null;
  preferences: UserPreferences;
  statistics: UsageStatistics;
  authUser: User | null;
  isAuthLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  refreshStatistics: () => void;
  exportData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const profileStore = localforage.createInstance({
  name: 'ai_outfit_planner',
  storeName: 'profile',
});

const preferencesStore = localforage.createInstance({
  name: 'ai_outfit_planner',
  storeName: 'preferences',
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [statistics, setStatistics] = useState<UsageStatistics>({
    totalWardrobeItems: 0,
    totalOutfits: 0,
    totalChats: 0,
    outfitsGenerated: 0,
    outfitsSaved: 0,
    mostUsedColors: [],
    itemsAddedThisMonth: 0,
    outfitsCreatedThisMonth: 0,
    lastActive: Date.now(),
  });

  const { items } = useWardrobe();
  const { outfits } = useOutfits();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load profile and preferences
  useEffect(() => {
    const loadData = async () => {
      try {
        // Do not automatically load local profile into memory on app start.
        // Loading the profile here caused the UI to display user info even when signed out.
        // Preferences are safe to load so the UI can show correct toggles.
        const savedPreferences = await preferencesStore.getItem<UserPreferences>('user_preferences');
        if (savedPreferences) {
          setPreferences(savedPreferences);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };
    loadData();
  }, []);

  // Supabase auth: initial session + listener
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session: Session | null = data?.session ?? null;
        if (mounted) {
          setAuthUser(session?.user ?? null);
          setIsAuthLoading(false);
        }

        // If user exists, hydrate profile from user metadata
        if (session?.user) {
          const u = session.user;

          // First, read any locally saved profile so we don't overwrite local edits
          const localSaved = await profileStore.getItem<UserProfile>('user_profile');

          // Prefer a remote profile stored in Supabase (profiles table) if available
          if (isSupabaseConfigured) {
            try {
              // profiles table is expected to have id = user's id and columns: full_name, avatar_url, profile (json), preferences (json)
              const { data: remote, error: fetchErr } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', u.id)
                .maybeSingle();

              if (!fetchErr && remote) {
                // remote.profile may contain profile fields matching UserProfile
                const remoteProfile = (remote.profile as any) ?? {};
                const remotePrefs = (remote.preferences as any) ?? {};

                // Merge remoteProfile fields so we keep bio, location, style, etc.
                const newProfile: UserProfile = {
                  ...(remoteProfile as Partial<UserProfile>),
                  name: remoteProfile.name || (u.user_metadata as any)?.full_name || (u.user_metadata as any)?.name || u.email || 'User',
                  avatar: remoteProfile.avatar || (u.user_metadata as any)?.avatar_url || (u.user_metadata as any)?.picture,
                  createdAt: remoteProfile.createdAt || Date.now(),
                  updatedAt: Date.now(),
                } as UserProfile;

                setProfile(newProfile);
                await profileStore.setItem('user_profile', newProfile);

                if (remotePrefs) {
                  // merge with defaults
                  const mergedPrefs = { ...DEFAULT_PREFERENCES, ...remotePrefs };
                  setPreferences(mergedPrefs);
                  await preferencesStore.setItem('user_preferences', mergedPrefs);
                }

                // done hydration from remote
                return;
              }
            } catch (err) {
              console.error('Failed to fetch remote profile', err);
            }
          }
          // If a local saved profile exists, prefer it (don't overwrite user edits)
          if (localSaved) {
            // keep localSaved as current profile
            setProfile(localSaved);
            setPreferences((await preferencesStore.getItem<UserPreferences>('user_preferences')) || DEFAULT_PREFERENCES);
          } else {
            // fallback: hydrate from user metadata
            const fromMeta: Partial<UserProfile> = {
              name: (u.user_metadata as any)?.full_name || (u.user_metadata as any)?.name || u.email || 'User',
              avatar: (u.user_metadata as any)?.avatar_url || (u.user_metadata as any)?.picture,
            };
            const newProfile: UserProfile = profile
              ? { ...profile, ...fromMeta, updatedAt: Date.now() }
              : {
                  name: fromMeta.name || 'User',
                  avatar: fromMeta.avatar,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                };

            setProfile(newProfile);
            await profileStore.setItem('user_profile', newProfile);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth session', err);
        if (mounted) setIsAuthLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setAuthUser(session?.user ?? null);
      if (!session?.user) {
        // user signed out; we keep local profile but mark auth as null
        setIsAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Calculate statistics based on actual data
  const refreshStatistics = useCallback(() => {
    const now = Date.now();
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Count items added this month
    const itemsThisMonth = items.filter(item => item.createdAt >= monthAgo).length;

    // Count outfits created this month
    const outfitsThisMonth = outfits.filter(outfit => outfit.createdAt >= monthAgo).length;

    // Find most used colors
    const colorCount: Record<string, number> = {};
    items.forEach(item => {
      item.colors.forEach(color => {
        colorCount[color] = (colorCount[color] || 0) + 1;
      });
    });
    const mostUsedColors = Object.entries(colorCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color);

    // Find favorite occasion
    const occasionCount: Record<string, number> = {};
    outfits.forEach(outfit => {
      occasionCount[outfit.occasion] = (occasionCount[outfit.occasion] || 0) + 1;
    });
    const favoriteOccasion = Object.entries(occasionCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    setStatistics({
      totalWardrobeItems: items.length,
      totalOutfits: outfits.length,
      totalChats: 0, // Would need to track this separately
      outfitsGenerated: outfits.length, // Simplified
      outfitsSaved: outfits.length,
      favoriteOccasion,
      mostUsedColors,
      itemsAddedThisMonth: itemsThisMonth,
      outfitsCreatedThisMonth: outfitsThisMonth,
      lastActive: now,
    });
  }, [items, outfits]);

  // Refresh statistics when data changes
  useEffect(() => {
    refreshStatistics();
  }, [refreshStatistics]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const newProfile: UserProfile = profile
      ? { ...profile, ...updates, updatedAt: Date.now() }
      : {
          name: updates.name || 'User',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          ...updates,
        };

    setProfile(newProfile);
    await profileStore.setItem('user_profile', newProfile);
    // Persist to Supabase profiles table if configured and user is authenticated
    try {
      if (isSupabaseConfigured && authUser) {
        const payload = {
          id: authUser.id,
          full_name: newProfile.name,
          avatar_url: newProfile.avatar,
          profile: newProfile,
          preferences: preferences || DEFAULT_PREFERENCES,
          updated_at: new Date().toISOString(),
        } as any;

        const { error } = await supabase.from('profiles').upsert(payload, { returning: 'minimal' });
        if (error) console.error('Failed to upsert profile to Supabase:', error);
      }
    } catch (err) {
      console.error('Error saving profile to Supabase', err);
    }
  }, [profile, authUser, isSupabaseConfigured, preferences]);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      console.warn('Attempted sign-in but Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    try {
      // Starts OAuth redirect to Supabase (Google provider must be enabled in Supabase)
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    } catch (err) {
      console.error('Failed to start Google sign-in', err);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Clear in-memory auth/profile state so UI hides sensitive info,
      // but do NOT delete local storage so the user's edits remain saved for next sign-in.
      setAuthUser(null);
      setProfile(null);
      setPreferences(DEFAULT_PREFERENCES);
      setIsAuthLoading(false);
    } catch (err) {
      console.error('Failed to sign out', err);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      // If Supabase is configured and we have an authenticated user, delete their profiles row
      if (isSupabaseConfigured && authUser) {
        const { error } = await supabase.from('profiles').delete().eq('id', authUser.id);
        if (error) console.error('Failed to delete profile row in Supabase:', error);
      }

      // Clear local storage and in-memory state
      await profileStore.clear();
      await preferencesStore.clear();
      setProfile(null);
      setPreferences(DEFAULT_PREFERENCES);

      // Finally, sign out the auth session if possible
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
      setAuthUser(null);
      setIsAuthLoading(false);
    } catch (err) {
      console.error('Failed to delete account', err);
    }
  }, [authUser]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    await preferencesStore.setItem('user_preferences', newPreferences);
    // Persist preferences to Supabase if configured and user is authenticated
    try {
      if (isSupabaseConfigured && authUser) {
        // Include current profile fields when upserting preferences so the row is updated fully
        const payload = {
          id: authUser.id,
          full_name: profile?.name || null,
          avatar_url: profile?.avatar || null,
          profile: profile || null,
          preferences: newPreferences,
          updated_at: new Date().toISOString(),
        } as any;

        const { error } = await supabase.from('profiles').upsert(payload, { returning: 'minimal' });
        if (error) console.error('Failed to upsert preferences to Supabase:', error);
      }
    } catch (err) {
      console.error('Error saving preferences to Supabase', err);
    }
  }, [preferences, authUser, isSupabaseConfigured]);

  const exportData = useCallback(async () => {
    const data = {
      profile,
      preferences,
      statistics,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outfit-planner-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [profile, preferences, statistics]);

  const clearAllData = useCallback(async () => {
    // If Supabase is configured, sign the user out so auth state is cleared too
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
        setAuthUser(null);
      }
    } catch (err) {
      console.error('Failed to sign out during clearAllData', err);
    }

    await profileStore.clear();
    await preferencesStore.clear();
    setProfile(null);
    setPreferences(DEFAULT_PREFERENCES);
    // Note: Wardrobe and outfit data would be cleared by their respective contexts
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        preferences,
        statistics,
        authUser,
        isAuthLoading,
        updateProfile,
        updatePreferences,
        refreshStatistics,
        exportData,
        clearAllData,
        signInWithGoogle,
          signOut,
          deleteAccount,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}

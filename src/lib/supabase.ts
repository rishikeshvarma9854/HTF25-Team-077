import { createClient } from '@supabase/supabase-js';

// Uses Vite env variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// If env vars are present, create a real Supabase client. Otherwise export a safe noop fallback
let supabase: any;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // Do NOT call createClient with empty values (it throws). Provide a noop shim so app doesn't crash in dev.
  console.warn('Supabase env vars are not set. Auth will not work until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided.');

  supabase = {
    // minimal auth shim matching the parts the app uses
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signInWithOAuth: async (_: any) => {
        console.warn('supabase.auth.signInWithOAuth called but Supabase is not configured.');
        return { error: new Error('Supabase not configured') };
      },
      signOut: async () => ({ error: null }),
      onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    // basic placeholder for storage/queries to avoid runtime errors if used accidentally
    from: () => ({ insert: async () => ({ error: new Error('Supabase not configured') }) }),
  };
}

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export { supabase };
export default supabase;

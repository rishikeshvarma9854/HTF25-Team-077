/// <reference types="vite/client" />

// Minimal typing for Vite env vars used in this project.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  // add other VITE_... env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

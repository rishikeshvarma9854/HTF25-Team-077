# Supabase setup for AI Outfit Planner (profiles table)

This file documents the SQL and steps to create the `profiles` table used by the frontend for profile/preferences persistence.

Why this is needed
- The frontend upserts/deletes rows in `public.profiles` keyed by the user's auth UID.
- Supabase `auth.uid()` returns `text`; in some projects `profiles.id` may be `uuid`, which leads to the error `operator does not exist: uuid = text` when the RLS policy compares `auth.uid()` directly to `id`.

What to run (safe, idempotent)
- Open Supabase → Your Project → Database → SQL editor and paste the contents of `supabase-schema.sql` in the editor, then click RUN.
- The script will:
  - create the `profiles` table if missing (id as `text` by default),
  - detect if `profiles.id` is `uuid` and, if so, create a policy that casts `auth.uid()` to `uuid`,
  - otherwise create a `text`-based policy,
  - enable RLS and create a policy named `profiles_is_owner_or_insert`.

Quick verification queries you can run after the script

-- Check columns and types
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Check policies
SELECT pol.polname AS policy_name,
       pg_get_expr(pol.polqual, pol.polrelid) AS using_expression,
       pg_get_expr(pol.polwithcheck, pol.polrelid) AS with_check_expression
FROM pg_policy pol
JOIN pg_class c ON c.oid = pol.polrelid
WHERE c.relname = 'profiles';

-- Sample select (no rows is fine)
SELECT id, full_name, created_at FROM public.profiles LIMIT 5;

Notes & troubleshooting
- If you see errors about permissions, ensure you're running the SQL as the project owner in Supabase SQL editor.
- If you still see `operator does not exist: uuid = text`, paste the output of the verification queries above here and I'll help debug.

After this is set up
- With `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` present in your frontend env, the app should be able to upsert and delete rows in `profiles` when the user signs in/out.
- Restart the dev server if necessary and test sign-in → edit → save → delete flows.

If you want, I can also replace the prompt-based delete confirmation with a modal and add a small "Cloud synced" indicator in the UI.

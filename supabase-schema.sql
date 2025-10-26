-- Safe, idempotent PostgreSQL script for Supabase 'profiles' table and RLS
-- Works whether `id` is UUID or text.

-- 1) Ensure table exists (id as text by default)
CREATE TABLE IF NOT EXISTS public.profiles (
  id text PRIMARY KEY,
  full_name text,
  avatar_url text,
  profile jsonb,
  preferences jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2) Detect column type and create an appropriate RLS policy
DO $$
DECLARE
  col_type text;
  col_udt text;
BEGIN
  SELECT c.data_type, c.udt_name
  INTO col_type, col_udt
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'profiles'
    AND c.column_name = 'id';

  -- Enable RLS (safe even if already enabled)
  EXECUTE 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY';

  -- Drop previous policy if exists
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'profiles_is_owner_or_insert') THEN
    EXECUTE 'DROP POLICY profiles_is_owner_or_insert ON public.profiles';
  END IF;

  -- Create the correct policy based on id type
  IF col_type = 'uuid' OR col_udt = 'uuid' THEN
    RAISE NOTICE 'profiles.id is uuid; creating policy using auth.uid()::uuid = id';
    EXECUTE $policy$
      CREATE POLICY profiles_is_owner_or_insert ON public.profiles
        FOR ALL
        USING (auth.uid()::uuid = id)
        WITH CHECK (auth.uid()::uuid = id);
    $policy$;
  ELSE
    RAISE NOTICE 'profiles.id is not uuid (using text-based policy)';
    EXECUTE $policy$
      CREATE POLICY profiles_is_owner_or_insert ON public.profiles
        FOR ALL
        USING (auth.uid()::text = id)
        WITH CHECK (auth.uid()::text = id);
    $policy$;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 3) Optional: index (id is PK, so already indexed)
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles (id);

-- 4) Verification snippet (run manually if needed)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles';
-- SELECT pol.polname AS policy_name, pg_get_expr(pol.polqual, pol.polrelid) AS using_expression, pg_get_expr(pol.polwithcheck, pol.polrelid) AS with_check_expression
-- FROM pg_policy pol JOIN pg_class c ON c.oid = pol.polrelid WHERE c.relname = 'profiles';
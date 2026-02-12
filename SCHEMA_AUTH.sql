-- MIGRATE TABLES TO INCLUDE USER_ID
-- This SQL will add user_id to existing tables and set up proper RLS policies.

-- 1. Add user_id column to balances
ALTER TABLE balances ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. Add user_id column to goals
ALTER TABLE goals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 3. Update unique constraint on balances to include user_id
ALTER TABLE balances DROP CONSTRAINT IF EXISTS balances_month_category_key;
ALTER TABLE balances ADD CONSTRAINT balances_month_category_user_key UNIQUE (month, category, user_id);

-- 4. Enable RLS (already enabled in SCHEMA.sql, but ensuring)
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- 5. Drop old public policies
DROP POLICY IF EXISTS "Acceso total balances" ON balances;
DROP POLICY IF EXISTS "Acceso total goals" ON goals;

-- 6. Create new secure policies
-- Only authenticated users can see their own data
CREATE POLICY "Users can view their own balances" ON balances
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own balances" ON balances
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own balances" ON balances
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own balances" ON balances
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON goals
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

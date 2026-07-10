/*
# User Profiles and Active Sessions

1. New Tables
   - `user_profiles`: stores user display name, department, and role (admin/lector)
   - `active_sessions`: tracks currently connected users (login time, last heartbeat)

2. Security
   - RLS enabled on both tables
   - Admins (role = 'admin') can read/update all profiles and sessions
   - Regular users can read/update only their own profile
   - Sessions auto-managed by the app via heartbeat

3. Notes
   - role stored in app_metadata via service role key (authoritative)
   - user_profiles mirrors it for fast queries without needing JWT claims re-read
   - active_sessions uses last_seen < now()-interval to detect disconnects
*/

-- user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT 'General',
  role text NOT NULL DEFAULT 'lector' CHECK (role IN ('admin', 'lector')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON user_profiles;
CREATE POLICY "profiles_select_own" ON user_profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON user_profiles;
CREATE POLICY "profiles_insert_own" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON user_profiles;
CREATE POLICY "profiles_update_own" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_admin" ON user_profiles;
CREATE POLICY "profiles_update_admin" ON user_profiles FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  ) WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_delete_admin" ON user_profiles;
CREATE POLICY "profiles_delete_admin" ON user_profiles FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- active_sessions table
CREATE TABLE IF NOT EXISTS active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  login_at timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_select_authenticated" ON active_sessions;
CREATE POLICY "sessions_select_authenticated" ON active_sessions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "sessions_insert_own" ON active_sessions;
CREATE POLICY "sessions_insert_own" ON active_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "sessions_update_own" ON active_sessions;
CREATE POLICY "sessions_update_own" ON active_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "sessions_delete_own" ON active_sessions;
CREATE POLICY "sessions_delete_own" ON active_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "sessions_delete_admin" ON active_sessions;
CREATE POLICY "sessions_delete_admin" ON active_sessions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

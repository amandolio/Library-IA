/*
# Create user_app_state (last screen and history per user)

1. New Tables
- `user_app_state`
  - `user_id` (uuid, primary key, defaults to the signed-in user, references auth.users)
  - `last_tab` (text, the last screen the user opened)
  - `history` (jsonb, recent navigation entries as a list of { tab, at })
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `user_app_state`.
- Grant SELECT, INSERT, UPDATE to `authenticated` only.
- Owner-scoped policies: each user can only read and write their own row.

3. Notes
- Used to restore the last screen and history when the app opens without a connection.
*/

CREATE TABLE IF NOT EXISTS user_app_state (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  last_tab text NOT NULL DEFAULT 'dashboard',
  history jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_app_state ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON user_app_state TO authenticated;

DROP POLICY IF EXISTS "select_own_app_state" ON user_app_state;
CREATE POLICY "select_own_app_state" ON user_app_state FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_app_state" ON user_app_state;
CREATE POLICY "insert_own_app_state" ON user_app_state FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_app_state" ON user_app_state;
CREATE POLICY "update_own_app_state" ON user_app_state FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

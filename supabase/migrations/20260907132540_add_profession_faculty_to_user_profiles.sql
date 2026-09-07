ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS profession text DEFAULT '',
  ADD COLUMN IF NOT EXISTS faculty text DEFAULT '';

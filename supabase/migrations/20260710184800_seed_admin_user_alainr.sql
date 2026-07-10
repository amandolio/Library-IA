
/*
# Seed admin user alainr

Creates the admin user alainr@administrador.uci.cu with password 123456
and inserts the corresponding user_profile with role=admin.
Uses Supabase's built-in auth schema functions.
*/

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Only insert if user doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'alainr@administrador.uci.cu'
  ) THEN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      raw_app_meta_data,
      is_super_admin,
      role,
      aud
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'alainr@administrador.uci.cu',
      crypt('123456', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"name": "alainr", "department": "Computer Science", "role": "admin"}'::jsonb,
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      false,
      'authenticated',
      'authenticated'
    );

    -- Create the identity record required for email/password login
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      provider,
      identity_data,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
      gen_random_uuid(),
      new_user_id,
      'alainr@administrador.uci.cu',
      'email',
      jsonb_build_object('sub', new_user_id::text, 'email', 'alainr@administrador.uci.cu'),
      now(),
      now(),
      now()
    );

    -- Create user profile with admin role
    INSERT INTO user_profiles (id, name, department, role)
    VALUES (new_user_id, 'alainr', 'Computer Science', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', name = 'alainr';

  ELSE
    -- User exists, ensure profile is admin
    UPDATE user_profiles
    SET role = 'admin', name = 'alainr'
    WHERE id = (SELECT id FROM auth.users WHERE email = 'alainr@administrador.uci.cu');

    -- Also reset the password in case it changed
    UPDATE auth.users
    SET encrypted_password = crypt('123456', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE email = 'alainr@administrador.uci.cu';
  END IF;
END $$;

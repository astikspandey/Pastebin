-- Create a function to reset the pastes ID sequence to 1
-- Run this SQL in your Supabase SQL Editor once

CREATE OR REPLACE FUNCTION reset_paste_sequence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reset the sequence to 1
  ALTER SEQUENCE pastes_id_seq RESTART WITH 1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION reset_paste_sequence() TO anon;
GRANT EXECUTE ON FUNCTION reset_paste_sequence() TO authenticated;

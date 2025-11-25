# Reset ID to 1 - Setup Guide

The reset script (`./reset.sh`) now deletes all data **and** resets the paste IDs back to 1!

## Quick Setup (One-Time)

To enable automatic ID reset, run this SQL once in your Supabase dashboard:

### 1. Go to SQL Editor

https://app.supabase.com/project/juivzmngvrdvmwlesncb/sql

### 2. Copy and paste this SQL:

```sql
CREATE OR REPLACE FUNCTION reset_paste_sequence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  ALTER SEQUENCE pastes_id_seq RESTART WITH 1;
END;
$$;

GRANT EXECUTE ON FUNCTION reset_paste_sequence() TO anon;
GRANT EXECUTE ON FUNCTION reset_paste_sequence() TO authenticated;
```

### 3. Click "Run"

That's it! Now whenever you run `./reset.sh`, the IDs will automatically reset to 1.

## How It Works

**Before:**
- Delete all data → IDs continue from where they left off
- Paste 1, 2, 3 deleted → Next paste = ID 4

**After:**
- Delete all data → IDs reset to 1
- Paste 1, 2, 3 deleted → Next paste = ID 1 ✅

## Testing

```bash
# Store some data
# (IDs will be 1, 2, 3...)

# Reset everything
./reset.sh
# Type "yes" to confirm

# Store new data
# (IDs will be 1, 2, 3... starting fresh!)
```

## What If I Don't Set This Up?

The reset script will still work perfectly! It will:
- ✅ Delete all pastes
- ✅ Delete site registration
- ⚠️ IDs will continue from previous count

You'll just see a message like:
```
⚠️  Sequence reset function not found
To reset the ID to 1 manually, run this SQL...
```

## Manual Reset (Alternative)

If you prefer not to create the function, you can manually reset IDs after running `./reset.sh`:

```sql
ALTER SEQUENCE pastes_id_seq RESTART WITH 1;
```

Run this in Supabase SQL Editor whenever you want IDs to start from 1 again.

## Summary

- **Automatic** (recommended): Run the SQL function once, `./reset.sh` handles everything
- **Manual**: Run `./reset.sh`, then run the ALTER SEQUENCE command in Supabase

Choose whichever you prefer! Both work perfectly.

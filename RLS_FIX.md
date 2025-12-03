# Fix RLS Error - Get Service Role Key

## Solution: Use Service Role Key (Recommended)

The RLS error happens because your bucket has security policies. The easiest fix is to use your **Service Role Key** which bypasses RLS.

### Step 1: Get Service Role Key

1. Go to Supabase Dashboard:
   ```
   https://app.supabase.com/project/ruuezvgeduepdgxoqmhb
   ```

2. Click **Settings** → **API** (left sidebar)

3. Look for **"Service role key"** (under "Project API keys")
   - It's different from "Anon key"
   - It's labeled as "service_role" 
   - Copy it

### Step 2: Update .env

Add to your `.env` file:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (paste your service role key here)
```

### Step 3: Rebuild & Test

```bash
npm run build
npm start
```

Then test in Postman - it should work now!

---

## Why Service Role Key?

- ✅ Bypasses RLS policies
- ✅ Full admin access
- ✅ Safe for backend use (never expose to frontend)
- ✅ Recommended for server-side operations

## Alternative: Manual Policy Fix

If you prefer, you can also manually fix the bucket policies in Supabase:

1. Go to **Storage** → **customizer-uploads** → **Policies**
2. Create a new policy: **"For INSERT"** → **"Everyone can insert"**
3. This allows public uploads (less secure)

**Recommendation:** Use Service Role Key approach (Step 1-3 above).

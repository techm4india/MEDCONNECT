# ⚡ QUICK FIX: password_hash Error

## 🔴 **Error You're Seeing**

```
null value in column "password_hash" of relation "users" violates not-null constraint
```

## ✅ **Solution (2 Minutes)**

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Sign in
3. Select your project

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### Step 3: Run This SQL
Copy and paste this into the SQL Editor:

```sql
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
```

### Step 4: Execute
1. Click **"Run"** button (or press `Ctrl+Enter`)
2. Wait for success message: **"Success. No rows returned"**

### Step 5: Restart Server
1. Stop your server (Ctrl+C)
2. Start again: `uvicorn app.main:app --reload`

### Step 6: Test Registration
Try registering a user again - it should work now! ✅

---

## 📸 **Visual Guide**

```
Supabase Dashboard
  └─ SQL Editor (left sidebar)
      └─ New query
          └─ Paste SQL
              └─ Run (Ctrl+Enter)
                  └─ Success! ✅
```

---

## 🎯 **Why This Happens**

- **Old Schema**: `password_hash TEXT NOT NULL` (required)
- **New System**: Using Supabase Auth (passwords stored separately)
- **Fix**: Make `password_hash` nullable since we don't use it anymore

---

## ✅ **After Fix**

Registration will work because:
- ✅ `password_hash` is now optional (nullable)
- ✅ Passwords are handled by Supabase Auth
- ✅ User profile is created without password_hash

---

**That's it! Just run the SQL and restart your server.** 🚀




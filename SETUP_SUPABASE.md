# Supabase Setup Guide

## Quick Setup Steps

### 1. Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details
4. Wait for project to be created

### 2. Get Your Credentials
1. In Supabase Dashboard, go to **Settings > API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon (public) key** (starts with `eyJ...`)
   - **JWT Secret** (from Settings > API > JWT Settings)

### 3. Update .env File
Open `.env` in the project root and update:

```bash
# Frontend (these are PUBLIC - safe to expose)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend (PRIVATE - do NOT expose)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret-here
```

### 4. Run Database Migration
The database schema is already in `supabase/migrations/`.

In Supabase Dashboard:
1. Go to **SQL Editor**
2. Copy contents from `supabase/migrations/20251210190227_7b27dece-bbe5-4b3e-b769-70dcd9eb8823.sql`
3. Paste and run the SQL

Or use Supabase CLI:
```bash
supabase db push
```

### 5. Restart Dev Server
```bash
npm run dev
```

### 6. Test Login/Signup
- Navigate to http://localhost:5173/login
- Try creating a student account
- Check browser console for any errors

## Troubleshooting

### "Supabase environment variables are missing"
- Check that `.env` file exists in project root
- Make sure variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after editing `.env`

### "Invalid JWT"
- Verify `SUPABASE_JWT_SECRET` matches the JWT Secret in Supabase Dashboard
- Check that backend server is running with correct `.env` values

### Database Tables Missing
- Run the migration SQL in Supabase Dashboard
- Check that tables exist: profiles, user_roles, schools

### Authentication Not Working
1. Open browser console (F12)
2. Check for error messages
3. Verify Supabase URL is correct
4. Test connection: Go to `https://your-project.supabase.co/rest/v1/` (should return JSON)

# Dual Database Setup Guide

## Overview

This setup allows BoluLife to connect to **two separate Supabase databases**:
1. **BoluLife Main Database** - For all BoluLife features (calendar, notes, finance, etc.)
2. **Accountability Database** - For the accountability system (shared with Check app)

## Database Configuration

### 1. BoluLife Main Database (Already Configured)
- **Current Project**: `kigadldparzpbpzfygok`
- **Purpose**: Calendar, notes, finance, plant care, health habits, etc.
- **Environment Variables**: Already set in `.env.local`

### 2. Accountability Database (Check App's Database)
- **Purpose**: Tasks, penalties, achievements, user management
- **Shared With**: Check app (same data, different interface)
- **Environment Variables**: Need to be added

## Setup Instructions

### Step 1: Get Check App's Database Credentials

#### Option A: From Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your Check app project (`accountability-app-gray`)
3. Go to **Settings** → **Environment Variables**
4. Copy the values for:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

#### Option B: From Check App's Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Find the Check app's Supabase project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

### Step 2: Update BoluLife Environment Variables

1. **Open** `bolulife/.env.local`
2. **Add** the Check app's database credentials:

```env
# BoluLife Main Database (existing)
VITE_SUPABASE_URL=https://kigadldparzpbpzfygok.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Accountability Database (Check App's Database)
VITE_ACCOUNTABILITY_SUPABASE_URL=https://your-check-app-project.supabase.co
VITE_ACCOUNTABILITY_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Verify Setup

1. **Restart** your BoluLife development server
2. **Navigate** to the Accountability page
3. **Check** that data loads without errors
4. **Test** adding tasks and users

## Database Structure

### BoluLife Main Database Tables
- `calendar_events`
- `agenda_tasks`
- `plants`
- `notes`
- `finance_transactions`
- `health_habits`
- `job_applications`
- `company_goals`
- `portfolio_links`

### Accountability Database Tables (Check App)
- `users` - User profiles and stats
- `tasks` - Daily tasks with completion status
- `penalties` - Penalty tracking
- `achievements` - Achievement progress
- `settings` - App configuration

## Benefits of This Setup

### ✅ **Data Separation**
- BoluLife data stays in BoluLife database
- Accountability data stays in Check app database
- No data conflicts or mixing

### ✅ **Shared Accountability Data**
- Both BoluLife and Check app access the same accountability data
- Changes in one app reflect in the other
- Single source of truth for accountability

### ✅ **Independent Development**
- Can modify BoluLife without affecting Check app
- Can modify Check app without affecting BoluLife
- Each app maintains its own database schema

### ✅ **Scalability**
- Each database can be optimized for its specific use case
- Can scale databases independently
- Better performance and resource management

## Troubleshooting

### Issue: "Missing Accountability Supabase environment variables"
**Solution**: Add the accountability database credentials to `.env.local`

### Issue: "Could not find table in schema cache"
**Solution**: Verify the accountability database credentials are correct

### Issue: Data not syncing between apps
**Solution**: Ensure both apps are using the same accountability database

### Issue: Performance issues
**Solution**: Check that both databases are in the same region for better performance

## Security Considerations

### Row Level Security (RLS)
- Both databases have RLS enabled
- Accountability database allows public access (personal app)
- BoluLife database has proper user authentication

### Environment Variables
- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate keys regularly for security

## Migration Notes

### From Single Database Setup
If you previously set up accountability tables in BoluLife's database:
1. **Export** any existing accountability data
2. **Import** into the Check app's database
3. **Remove** accountability tables from BoluLife's database
4. **Update** environment variables as shown above

### Data Backup
- Regularly backup both databases
- Use Supabase's built-in backup features
- Test restore procedures periodically

---

**Your BoluLife app now connects to two separate databases!** 🎉

- **Main features** use BoluLife's database
- **Accountability features** use Check app's database
- **Data is properly separated** and **shared where needed**

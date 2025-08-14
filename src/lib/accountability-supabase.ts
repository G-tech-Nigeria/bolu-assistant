import { createClient } from '@supabase/supabase-js'

// Separate Supabase configuration for accountability system
// This connects to the Check app's database
const accountabilitySupabaseUrl = import.meta.env.VITE_ACCOUNTABILITY_SUPABASE_URL
const accountabilitySupabaseAnonKey = import.meta.env.VITE_ACCOUNTABILITY_SUPABASE_ANON_KEY

// Validate environment variables
if (!accountabilitySupabaseUrl || !accountabilitySupabaseAnonKey) {
  console.error('Missing Accountability Supabase environment variables.')
  console.error('Required: VITE_ACCOUNTABILITY_SUPABASE_URL and VITE_ACCOUNTABILITY_SUPABASE_ANON_KEY')
  console.error('Please add these to your .env.local file with the Check app\'s Supabase credentials')
}

// Create separate Supabase client for accountability
export const accountabilitySupabase = createClient(accountabilitySupabaseUrl, accountabilitySupabaseAnonKey)

// Database table names (same as Check app)
export const ACCOUNTABILITY_TABLES = {
  USERS: 'users',
  TASKS: 'tasks',
  PENALTIES: 'penalties',
  ACHIEVEMENTS: 'achievements',
  SETTINGS: 'settings'
}

// Helper function to handle database errors
export const handleAccountabilityDatabaseError = (error: any, operation: string) => {
  console.error(`Accountability database error during ${operation}:`, error)
  throw new Error(`Failed to ${operation}: ${error.message}`)
}

// Helper function to generate unique IDs
export const generateAccountabilityUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

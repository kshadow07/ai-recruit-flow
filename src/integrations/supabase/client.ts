
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Load environment variables from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

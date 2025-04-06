
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Define hardcoded values for Supabase URL and anon key
// These values are necessary since environment variables aren't loading properly
const supabaseUrl = 'https://hjsptwfpbdewwnnrqdlo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc3B0d2ZwYmRld3dubnJxZGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NDUxNTQsImV4cCI6MjA1OTMyMTE1NH0.MKi1dGuqwMNtnoAUnSfGkXN9ZHqZagqtZOBTCc3HI7c';

// Check console if values are loaded
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Key exists' : 'Key missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Using fallback values.');
}

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Admin client with service role key (bypasses RLS - use carefully)
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client for general use (respects RLS when user token provided)
export const createSupabaseClient = (userToken?: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: userToken ? { Authorization: `Bearer ${userToken}` } : {}
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export default supabaseAdmin;

/**
 * supabase.js — Supabase client singleton.
 *
 * Reads project URL and anon key from environment variables.
 * These are safe to expose client-side — RLS policies protect data.
 *
 * Setup:
 *   1. Create a Supabase project at https://supabase.com
 *   2. Create .env with:
 *        VITE_SUPABASE_URL=https://yourproject.supabase.co
 *        VITE_SUPABASE_ANON_KEY=eyJ...
 *   3. Run the SQL migrations in /supabase/migrations/
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || '';
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// When env vars are missing, create a dummy client that won't crash but won't connect.
// This allows local dev without Supabase configured.
const isConfigured = !!(supabaseUrl && supabaseAnon);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnon, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export { isConfigured };

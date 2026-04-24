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

// No-op cross-tab lock. supabase-js defaults to `navigator.locks` on an
// exclusive lock named `lock:sb-<project>-auth-token` to serialize token
// refreshes across tabs. If a previous tab/HMR-reloaded module dies while
// holding that lock, every subsequent `getSession()`/`getUser()` call in
// the app hangs forever waiting on a ghost holder — with no timeout, no
// error. This SPA doesn't coordinate refreshes across tabs (localStorage
// is the source of truth either way), so we replace the lock with a noop
// that just runs the inner function immediately.
//
// Safe because: (a) the token in localStorage is the canonical record,
// (b) in-tab serialization still happens via supabase-js's internal
// in-memory guards, (c) the worst-case multi-tab collision is two parallel
// refresh attempts — one wins, the other sees a fresh token on retry.
const noopLock = async (_name, _acquireTimeout, fn) => await fn();

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnon, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        lock: noopLock,
      },
    })
  : null;

export { isConfigured };

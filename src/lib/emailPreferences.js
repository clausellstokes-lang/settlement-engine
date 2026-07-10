/**
 * emailPreferences.js — client wrappers for the per-category email-preference
 * RPCs (migration 126). The Account "Email preferences" section reads the three
 * category flags and flips them one at a time; both go through SECURITY DEFINER
 * RPCs keyed on auth.uid(), so a client can only ever read/write its OWN row and
 * never sees the opaque unsubscribe token (that stays server-side for the mailer
 * / one-click unsubscribe route).
 *
 * The categories here are the MARKETING / lifecycle mail a user may opt out of.
 * Transactional mail (receipts, password recovery, email confirmation) is never
 * represented and is always sent.
 *
 * No React, no store — pure service calls, so the section can stay a thin
 * controlled form and this stays unit-testable. Degrades to the opt-out default
 * (all subscribed) when no backend is configured.
 */
import { supabase, isConfigured } from './supabase.js';

/**
 * The three opt-out categories, in display order. `id` is the DB column /
 * RPC category (mirrors migration 126's is_allowed_email_category); label +
 * description are UI copy.
 */
export const EMAIL_CATEGORIES = Object.freeze([
  {
    id: 'product_updates',
    label: 'Product updates',
    description: 'Occasional notes when a meaningful new feature ships. Rare, never a newsletter.',
  },
  {
    id: 'referral',
    label: 'Referral rewards',
    description: 'When a friend you referred subscribes and a reward lands on your account.',
  },
  {
    id: 'lifecycle',
    label: 'Realm activity',
    description: 'Nudges when a saved realm has stirred and there is something new to review.',
  },
]);

/** The all-subscribed opt-out default, used before a row exists / offline. */
const DEFAULT_PREFERENCES = Object.freeze({ product_updates: true, referral: true, lifecycle: true });

/**
 * Read the caller's three category flags. Returns the all-true default when no
 * backend is configured or the row has not been minted yet (the server RPC
 * itself already defaults unset flags to true).
 *
 * @returns {Promise<{ product_updates: boolean, referral: boolean, lifecycle: boolean }>}
 */
export async function getMyEmailPreferences() {
  if (!isConfigured || !supabase) return { ...DEFAULT_PREFERENCES };
  const { data, error } = await supabase.rpc('get_my_email_preferences');
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row) return { ...DEFAULT_PREFERENCES };
  return {
    product_updates: row.product_updates !== false,
    referral: row.referral !== false,
    lifecycle: row.lifecycle !== false,
  };
}

/**
 * Flip ONE category flag for the caller. Throws on failure so the UI can roll
 * the toggle back and never lie about persisted state.
 *
 * @param {'product_updates'|'referral'|'lifecycle'} category
 * @param {boolean} enabled
 */
export async function setMyEmailPreference(category, enabled) {
  if (!isConfigured || !supabase) return;
  const { error } = await supabase.rpc('set_my_email_preference', {
    p_category: category,
    p_enabled: enabled,
  });
  if (error) throw error;
}

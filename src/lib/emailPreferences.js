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
 * controlled form and this stays unit-testable. Product updates are explicit
 * opt-in; an unavailable or malformed backend must never fabricate that grant.
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

/**
 * Read the caller's three category flags. The server always returns one complete
 * boolean row. Anything else is an unavailable preference store, not consent.
 *
 * @returns {Promise<{ product_updates: boolean, referral: boolean, lifecycle: boolean }>}
 */
export async function getMyEmailPreferences() {
  if (!isConfigured || !supabase) {
    throw new Error('Email preferences are unavailable in this environment.');
  }
  const { data, error } = await supabase.rpc('get_my_email_preferences');
  const row = Array.isArray(data) ? data[0] : data;
  if (error) throw error;
  if (!row || typeof row !== 'object'
    || typeof row.product_updates !== 'boolean'
    || typeof row.referral !== 'boolean'
    || typeof row.lifecycle !== 'boolean') {
    throw new Error('Email preferences returned an invalid response.');
  }
  return {
    product_updates: row.product_updates === true,
    referral: row.referral === true,
    lifecycle: row.lifecycle === true,
  };
}

/**
 * Flip ONE category flag for the caller. Throws on failure so the UI can roll
 * the toggle back and never lie about persisted state.
 *
 * @param {'product_updates'|'referral'|'lifecycle'} category
 * @param {boolean} enabled
 * @param {string|null} expectedOwnerId owner captured before any queued delay
 */
export async function setMyEmailPreference(category, enabled, expectedOwnerId = null) {
  if (!EMAIL_CATEGORIES.some(row => row.id === category) || typeof enabled !== 'boolean') {
    throw new Error('A valid email preference and boolean value are required.');
  }
  if (!isConfigured || !supabase) {
    throw new Error('Email preferences are unavailable in this environment.');
  }
  const { data: { user } = {}, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('Not authenticated');
  const ownerId = expectedOwnerId == null ? String(user.id) : String(expectedOwnerId);
  if (String(user.id) !== ownerId) {
    throw Object.assign(new Error('Auth session changed before email preference mutation.'), {
      code: 'auth_session_changed',
    });
  }
  const { error } = await supabase.rpc('set_my_email_preference', {
    p_expected_user: ownerId,
    p_category: category,
    p_enabled: enabled,
  });
  if (error) throw error;
}

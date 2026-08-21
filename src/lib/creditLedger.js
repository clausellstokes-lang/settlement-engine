/**
 * creditLedger.js — Client reader for the credit ledger (migration 007).
 *
 * Background:
 *   The legacy approach stored a `credits` counter column on profiles
 *   and inserted signed rows into `credit_transactions`. That worked
 *   for "what's my balance" but didn't answer:
 *     - Has this user ever paid us anything?
 *     - When does this grant expire?
 *     - Refund only the unspent portion of this purchase.
 *
 *   The ledger (supabase/migrations/007_credit_ledger.sql) separates
 *   grants and spends, tags each with a source + metadata, and
 *   supports per-grant expiry. The server-side `get_credit_balance()`
 *   SQL function is the canonical answer to "current balance".
 *
 * Client responsibilities (this file):
 *   - Fetch current balance (delegates to the SQL function).
 *   - Fetch recent transactions for the history UI.
 *   - Format ledger rows for human display.
 *
 * Client does NOT compute balance from rows. The SQL function is the
 * source of truth; reimplementing the same logic in JS guarantees
 * drift the first time we add a grant kind on the server.
 */

import { supabase, isConfigured } from './supabase.js';

// ── Source labels (UI-friendly) ───────────────────────────────────────────
// Keys mirror `credit_ledger.source` values in 007_credit_ledger.sql.

const SOURCE_LABELS = Object.freeze({
  // Grants
  purchase:       'Credit purchase',
  founder_grant:  'Founder grant',
  welcome:        'Welcome bonus',
  daily_refresh:  'Daily refresh',
  promo:          'Promo code',
  refund:         'Refund',
  admin_grant:    'Granted by admin',
  // Spends
  narrative:      'Narrative synthesis',
  daily_life:     'Daily life generation',
  progression:    'Progression evolution',
});

/**
 * Get the user's current credit balance from the server. Returns 0 if
 * Supabase is not configured (local-only mode) or the user is signed
 * out.
 */
export async function fetchCreditBalanceFromLedger() {
  if (!isConfigured) return 0;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  // The RPC is `get_credit_balance(target_user uuid)`. Supabase v2
  // exposes Postgres functions via `.rpc()`.
  const { data, error } = await supabase.rpc('get_credit_balance', {
    target_user: user.id,
  });

  if (error) {
    // Fall back to the legacy profiles.credits column if the ledger
    // isn't migrated yet. This lets us deploy the client before the
    // server migration without breaking the balance display.
    return fetchLegacyBalance();
  }
  return Number(data) || 0;
}

/**
 * Fetch recent ledger rows for the transactions UI. Most recent first.
 * @param {number} limit — How many rows to return (default 50).
 */
export async function fetchRecentTransactions(limit = 50) {
  if (!isConfigured) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('credit_ledger')
    .select('id, kind, amount, source, metadata, expires_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    // Same fallback: read from the legacy table so the UI doesn't
    // break before the migration runs.
    return fetchLegacyTransactions(limit);
  }
  return data;
}

/** Pretty label for a ledger row's `source` field. */
export function labelForSource(source) {
  return SOURCE_LABELS[source] ?? source ?? 'Adjustment';
}

/**
 * Format a ledger row for a list-row display: signed amount, label, when.
 *   { sign: '+', amount: 25, label: 'Credit purchase', when: Date, expiresAt: null }
 */
export function formatLedgerRow(row) {
  if (!row) return null;
  const sign = row.kind === 'grant' ? '+' : '−';
  return {
    id:        row.id,
    sign,
    amount:    row.amount,
    label:     labelForSource(row.source),
    when:      row.created_at ? new Date(row.created_at) : null,
    expiresAt: row.expires_at ? new Date(row.expires_at) : null,
    kind:      row.kind,
    source:    row.source,
    metadata:  row.metadata || {},
  };
}

// ── Legacy fallbacks (transitional) ───────────────────────────────────────
// These read from the pre-007 schema. They exist only so the client can
// ship before the server migration runs, then both sides line up after
// migration. Once the migration is live everywhere, delete these.

async function fetchLegacyBalance() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (error) return 0;
  return Number(data?.credits) || 0;
}

async function fetchLegacyTransactions(limit) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('credit_transactions')
    .select('id, amount, reason, settlement_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  // Reshape into ledger-row shape so the UI can render uniformly.
  return data.map(row => ({
    id:         row.id,
    kind:       row.amount >= 0 ? 'grant' : 'spend',
    amount:     Math.abs(row.amount),
    source:     row.reason,
    metadata:   row.settlement_id ? { settlement_id: row.settlement_id } : {},
    expires_at: null,
    created_at: row.created_at,
  }));
}

/**
 * accountData.js — Data & Privacy service: export and account-deletion request.
 *
 * Two user-data operations the Account page's "Data & Privacy" section needs,
 * kept out of the component so they're unit-testable and free of React:
 *
 *   • buildAccountExport(state) — assemble a portable JSON snapshot of the
 *     user's OWN data (profile basics + saved settlements + campaigns). Pure;
 *     takes a plain store snapshot so it's trivial to test and never touches
 *     the network.
 *   • downloadAccountExport(state) — wrap buildAccountExport in a browser
 *     download (Blob + anchor click). Returns the filename used.
 *   • requestAccountDeletion(user) — file a SOFT-DELETE request, never a client
 *     hard-delete. We route to the `account-actions` edge function if present;
 *     otherwise we record a row in `deletion_requests`. The client deliberately
 *     CANNOT erase the account itself (RLS forbids it) — a server job processes
 *     the request after a grace window. Returns { status, requestedAt }.
 *
 * Security note: deletion is intentionally a *request*, gated by confirmation in
 * the UI. Hard deletion requires the service-role key, which never ships to the
 * browser; doing it client-side would be both impossible (RLS) and unsafe.
 */

import { supabase, isConfigured } from './supabase.js';

/** Current export schema version, so a future importer can branch on it. */
export const ACCOUNT_EXPORT_VERSION = 1;

/**
 * Build a portable, user-owned JSON object from a store snapshot. Pure — no
 * network, no side effects. We export STRUCTURE the user authored (their
 * settlements + campaigns) plus minimal profile identity, never internal
 * grants (role/credits) which aren't theirs to carry off.
 *
 * @param {{ auth?: any, savedSettlements?: any[], campaigns?: any[] }} state
 * @returns {{ version: number, exportedAt: string, profile: object, settlements: any[], campaigns: any[] }}
 */
export function buildAccountExport(state = {}) {
  const auth = state.auth || {};
  const profile = {
    email: auth.user?.email || null,
    displayName: auth.displayName || null,
    tier: auth.tier || null,
  };
  return {
    version: ACCOUNT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    profile,
    settlements: Array.isArray(state.savedSettlements) ? state.savedSettlements : [],
    campaigns: Array.isArray(state.campaigns) ? state.campaigns : [],
  };
}

/** Slugify an email into a safe filename stem. */
function exportFilename(email) {
  const stem = String(email || 'account').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  return `settlementforge-${stem || 'account'}-${date}.json`;
}

/**
 * Trigger a client-side download of the account export. Returns the filename
 * so callers/tests can assert on it. Guards the DOM/Blob APIs so a non-browser
 * environment (or a stubbed test) doesn't throw.
 *
 * @param {object} state store snapshot (see buildAccountExport)
 * @returns {string} the download filename
 */
export function downloadAccountExport(state = {}) {
  const payload = buildAccountExport(state);
  const json = JSON.stringify(payload, null, 2);
  const filename = exportFilename(payload.profile?.email);

  // Browser-only side effect; skip cleanly when the APIs are unavailable.
  if (typeof document !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    try { URL.revokeObjectURL(url); } catch { /* ignore */ }
  }
  return filename;
}

/**
 * File a SOFT-DELETE account-deletion request. Never hard-deletes client-side.
 *
 * Path 1 (preferred): an `account-actions` edge function with { action:
 * 'request_deletion' } — a server endpoint that flags the account and schedules
 * erasure after a grace window.
 * Path 2 (fallback): insert into a `deletion_requests` table (RLS lets a user
 * file their own request only).
 *
 * In local/mock mode (no Supabase) we resolve a synthetic queued result so the
 * UI flow is exercisable without a backend.
 *
 * @param {{ id?: string, email?: string }} user
 * @returns {Promise<{ status: 'queued', requestedAt: string }>}
 */
export async function requestAccountDeletion(user) {
  const requestedAt = new Date().toISOString();

  if (!isConfigured || !supabase) {
    // Local dev: no backend to route to; report queued so the UI can confirm.
    return { status: 'queued', requestedAt };
  }

  // Preferred: dedicated server endpoint.
  try {
    const { error } = await supabase.functions.invoke('account-actions', {
      body: { action: 'request_deletion' },
    });
    if (!error) return { status: 'queued', requestedAt };
  } catch {
    // Fall through to the table path.
  }

  // Fallback: record a deletion request row (server job picks it up).
  const { error: tableErr } = await supabase
    .from('deletion_requests')
    .insert({ user_id: user?.id || null, email: user?.email || null, requested_at: requestedAt });
  if (tableErr) {
    throw new Error('Could not submit your deletion request. Please contact support.');
  }
  return { status: 'queued', requestedAt };
}

/**
 * lib/purchaseHistory.js — the account "Past purchases" read (DESIGN_MONEY_WAVE
 * §3 / #14). Reads OUR money_events table through its owner-SELECT RLS policy —
 * no client Stripe calls, instant, offline-proof.
 *
 * FAIL-CLOSED, by design and by deploy-state. money_events (157) is
 * written-not-applied until the owner's db push, so the table is absent in prod
 * today; any error — not-configured, missing table, transient hiccup — returns an
 * EMPTY page. The panel then renders a quiet "no purchases / couldn't load" line.
 * Never throws (the founderLineage idiom).
 *
 * Kind→label + money/date formatting live HERE (not pricing.js) so they add ZERO
 * eager bytes: this module is imported LAZILY from the (already-lazy) account
 * panel, so it never touches the first-paint graph (LAW 4).
 */

import { supabase, isConfigured } from './supabase.js';

/** Rows per page; the panel shows this many then offers "Show earlier". */
export const PURCHASE_PAGE_SIZE = 25;

/**
 * Human labels for each money_events.kind. The UI maps kind→label from HERE, so the
 * server description column stays a pure audit string. Unknown kinds fall back to
 * a generic label (never blank).
 */
export const PURCHASE_KIND_LABELS = Object.freeze({
  credit_pack: 'AI credits',
  founder_seat: 'Founder Lifetime seat',
  single_dossier: 'Dossier export',
  subscription_start: 'Cartographer subscription',
  subscription_renewal: 'Cartographer renewal',
  surveyor_start: 'Surveyor subscription',
  surveyor_renewal: 'Surveyor renewal',
  auto_reload: 'AI credit auto-reload',
  seat_transfer_payment: 'Founder seat transfer',
  seat_transfer_payout: 'Seat transfer payout',
  refund_note: 'Refund',
});

/** @param {string} kind @returns {string} */
export function kindLabel(kind) {
  return PURCHASE_KIND_LABELS[kind] || 'Purchase';
}

/** Format integer cents as a localized currency string. Never throws. */
export function formatMoney(cents, currency = 'usd') {
  const n = Number(cents);
  const amount = Number.isFinite(n) ? n / 100 : 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: (typeof currency === 'string' && currency ? currency : 'usd').toUpperCase(),
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

/** Format an ISO timestamp as a short date. Empty string on bad input. */
export function formatPurchaseDate(iso) {
  if (typeof iso !== 'string' || !iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
  } catch {
    return iso.slice(0, 10);
  }
}

/**
 * A single ledger row as the panel consumes it.
 * @typedef {Object} PurchaseRow
 * @property {string}      id
 * @property {string}      occurredAt   raw ISO (also the pager cursor)
 * @property {string}      dateLabel    formatted date
 * @property {string}      kind
 * @property {string}      label        human kind label
 * @property {string}      status       'paid' | 'refunded' | 'disputed' | 'reversed'
 * @property {number}      amountCents
 * @property {string}      amountLabel  formatted currency
 * @property {string}      currency
 * @property {string|null} receiptUrl
 */

/** Map a raw money_events row to the panel shape, dropping anything unusable. */
export function normalizePurchaseRow(row) {
  if (!row || typeof row !== 'object') return null;
  const id = row.id;
  const occurredAt = typeof row.occurred_at === 'string' ? row.occurred_at : null;
  if (!id || !occurredAt) return null;
  const kind = typeof row.kind === 'string' ? row.kind : 'refund_note';
  const status = typeof row.status === 'string' ? row.status : 'paid';
  const amountCents = Number.isFinite(Number(row.amount_cents)) ? Number(row.amount_cents) : 0;
  const currency = typeof row.currency === 'string' && row.currency ? row.currency : 'usd';
  const receiptUrl = typeof row.receipt_url === 'string' && row.receipt_url ? row.receipt_url : null;
  return {
    id,
    occurredAt,
    dateLabel: formatPurchaseDate(occurredAt),
    kind,
    label: kindLabel(kind),
    status,
    amountCents,
    amountLabel: formatMoney(amountCents, currency),
    currency,
    receiptUrl,
  };
}

/**
 * Fetch one page of the caller's purchase history, newest first. The owner-SELECT
 * RLS policy scopes it to the caller's own rows. NEVER throws.
 *
 * @param {{ before?: string|null, limit?: number }} [opts]
 *   before — occurred_at cursor: return only rows strictly older than this.
 * @returns {Promise<{ rows: PurchaseRow[], hasMore: boolean, nextBefore: string|null }>}
 */
export async function fetchPurchaseHistory({ before = null, limit = PURCHASE_PAGE_SIZE } = {}) {
  const empty = { rows: [], hasMore: false, nextBefore: null };
  if (!isConfigured) return empty;
  const pageLimit = Number.isInteger(limit) && limit > 0 ? limit : PURCHASE_PAGE_SIZE;
  try {
    let q = supabase
      .from('money_events')
      .select('id, occurred_at, kind, amount_cents, currency, description, receipt_url, status')
      .order('occurred_at', { ascending: false })
      .limit(pageLimit + 1); // one extra row detects "has earlier"
    if (before) q = q.lt('occurred_at', before);
    const { data, error } = await q;
    if (error) {
      // Pre-deploy the table is absent; that is the expected pre-launch path, not
      // an incident. Log at debug volume and fall back to empty.
      console.debug('[purchaseHistory] unavailable', error?.message ?? error);
      return empty;
    }
    if (!Array.isArray(data)) return empty;
    const hasMore = data.length > pageLimit;
    const rows = data.slice(0, pageLimit).map(normalizePurchaseRow).filter(Boolean);
    const nextBefore = hasMore && rows.length ? rows[rows.length - 1].occurredAt : null;
    return { rows, hasMore, nextBefore };
  } catch (e) {
    console.debug('[purchaseHistory] unexpected error', e);
    return empty;
  }
}

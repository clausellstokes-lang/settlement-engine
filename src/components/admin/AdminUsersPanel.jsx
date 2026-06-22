/**
 * AdminUsersPanel.jsx — Phase A4 admin/developer user search + inspect + actions.
 *
 * Built on the A3 least-privilege foundation: every read is REDACTED by default
 * and every write goes through the audited, role-gated admin-actions edge fn.
 *   • Search users (by id / email / display-name) via the audited `list_users`
 *     action — the response carries only MASKED emails (no raw PII).
 *   • Open a user → REDACTED summary from `admin_user_summary` (masked email,
 *     account age, tier, credits, settlement/gallery/campaign/ticket/warning
 *     counts, ban/disable status).
 *   • "Reveal full details" → prompts for a REASON (in-app TextInputDialog),
 *     then calls `get_user_full` (highest role + reason + one audit row) to
 *     unmask the raw email.
 *   • The action set — each button invokes the matching edge action, which is
 *     role-gated server-side and writes one audit row. Soft-delete-first: ban /
 *     disable / remove / revoke are reversible flags, never hard deletes.
 *
 * Text input uses the in-app TextInputDialog (no native window.prompt — the
 * project forbids native dialogs in components).
 *
 * The panel itself is rendered only for elevated users (the parent gates on
 * isElevated). The real authority is server-side; this gate is UX, not security.
 */
import { useCallback, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import Button from '../primitives/Button.jsx';
import Stat from '../primitives/Stat.jsx';
import { TextInputDialog } from '../primitives/Dialog.jsx';
import {
  INK, MUTED, BODY, BORDER, BORDER2, CARD_HDR, RED, GREEN,
  sans, serif_, SP, R, FS, swatch,
} from '../theme.js';

/** Invoke an admin-actions edge action. Returns the data payload or throws. */
async function callAdmin(body) {
  const { data, error } = await supabase.functions.invoke('admin-actions', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Deliver a diagnostic bundle as a downloaded JSON file. Guards the DOM/Blob
 * APIs so a non-browser environment (or a stubbed test) doesn't throw. Returns
 * the filename used so callers can surface it. Mirrors downloadAccountExport.
 */
function downloadBundle(bundle, userId, full) {
  const json = JSON.stringify(bundle ?? {}, null, 2);
  const stamp = new Date().toISOString().slice(0, 10);
  const variant = full ? 'full-debug' : 'diagnostic';
  const filename = `${variant}-${(userId || 'user').slice(0, 8)}-${stamp}.json`;
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

export default function AdminUsersPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);   // redacted summary
  const [billing, setBilling] = useState(null);      // review_billing payload
  const [fullEmail, setFullEmail] = useState(null);  // unmasked email after reveal
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);        // last action result message
  // The single in-app text-prompt. `prompt.onSubmit(value)` runs the action.
  const [prompt, setPrompt] = useState(null);        // { title, body, label, onSubmit } | null

  const search = useCallback(async () => {
    setSearching(true); setError(null);
    try {
      const data = await callAdmin({ action: 'list_users', metadata: { search: query.trim() } });
      setResults(Array.isArray(data?.users) ? data.users : []);
    } catch (e) {
      setError(e?.message || 'Search failed'); setResults([]);
    } finally {
      setSearching(false);
    }
  }, [query]);

  const openUser = useCallback(async (id) => {
    setBusy(true); setError(null); setStatus(null); setFullEmail(null); setBilling(null);
    try {
      const data = await callAdmin({ action: 'get_user_summary', userId: id });
      setSelected(data?.summary || null);
    } catch (e) {
      setError(e?.message || 'Failed to load user');
    } finally {
      setBusy(false);
    }
  }, []);

  /**
   * Run an action against the selected user, then refresh the summary. Returns
   * the action's response payload so a caller can deliver it (e.g. render a
   * billing summary or download a bundle), or null on failure.
   */
  const runAction = useCallback(async (body, successMsg) => {
    if (!selected?.id) return null;
    setBusy(true); setError(null); setStatus(null);
    try {
      const result = await callAdmin(body);
      setStatus(successMsg);
      const data = await callAdmin({ action: 'get_user_summary', userId: selected.id });
      setSelected(data?.summary || null);
      return result;
    } catch (e) {
      setError(e?.message || 'Action failed');
      return null;
    } finally {
      setBusy(false);
    }
  }, [selected]);

  /** Review billing — capture the summary payload and render it in the panel. */
  const reviewBilling = useCallback(async () => {
    setBilling(null);
    const result = await runAction({ action: 'review_billing', userId: selected?.id }, 'Billing summary loaded.');
    if (result?.billing) setBilling(result.billing);
  }, [runAction, selected]);

  /**
   * Export the redacted diagnostic bundle — capture the payload and deliver it
   * as a downloaded JSON file rather than dropping it on the floor.
   */
  const exportBundle = useCallback(async () => {
    const result = await runAction({ action: 'diagnostic_bundle', userId: selected?.id }, null);
    if (result?.bundle) {
      const name = downloadBundle(result.bundle, selected?.id, false);
      setStatus(`Redacted bundle downloaded (${name}).`);
    }
  }, [runAction, selected]);

  /**
   * Create the full debug copy (audited, includes raw PII) — capture the
   * payload and deliver it: download the JSON file and copy it to the clipboard.
   */
  const fullDebugCopy = useCallback(async (reason) => {
    const result = await runAction(
      { action: 'diagnostic_bundle', userId: selected?.id, full: true, reason },
      null,
    );
    if (result?.bundle) {
      const name = downloadBundle(result.bundle, selected?.id, true);
      let copied = false;
      const json = JSON.stringify(result.bundle, null, 2);
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try { await navigator.clipboard.writeText(json); copied = true; } catch { /* clipboard blocked */ }
      }
      setStatus(copied
        ? `Full debug copy downloaded (${name}) and copied to clipboard (audited).`
        : `Full debug copy downloaded (${name}) (audited).`);
    }
  }, [runAction, selected]);

  /** Reveal full PII — requires a reason; calls the audited highest-role RPC. */
  const revealFull = useCallback(() => {
    if (!selected?.id) return;
    setPrompt({
      title: 'Reveal full details',
      body: 'Revealing full details is audited. Enter a reason (e.g. "GDPR data request #42").',
      label: 'Reason',
      onSubmit: async (reason) => {
        if (!reason || !reason.trim()) return;
        setBusy(true); setError(null);
        try {
          const data = await callAdmin({ action: 'get_user_full', userId: selected.id, reason: reason.trim() });
          setFullEmail(data?.user?.email || null);
          setStatus('Full details revealed (audited).');
        } catch (e) {
          setError(e?.message || 'Reveal failed');
        } finally {
          setBusy(false);
        }
      },
    });
  }, [selected]);

  const id = selected?.id;

  /** Open the in-app prompt; on confirm, trim + hand the value to `onValue`. */
  const ask = useCallback((cfg, onValue) => {
    setPrompt({
      ...cfg,
      onSubmit: (raw) => {
        const v = (raw || '').trim();
        if (v) onValue(v);
      },
    });
  }, []);

  return (
    // P5 anti-box-soup: render flat. This panel only mounts inside AdminPanel's
    // <Section>, which already supplies the card frame + the "User Search &
    // Actions" <h2> and its body padding — a self-framed card-in-card here
    // would be a doubled boundary + doubled padding (the nested-card false
    // floor). The inner reveal-detail panels below keep their own frame.
    <section aria-label="User management">

      {/* In-app text prompt (replaces native window.prompt). */}
      <TextInputDialog
        open={!!prompt}
        title={prompt?.title || ''}
        body={prompt?.body}
        label={prompt?.label}
        confirmLabel={prompt?.confirmLabel || 'Confirm'}
        onCancel={() => setPrompt(null)}
        onConfirm={(value) => { const p = prompt; setPrompt(null); p?.onSubmit?.(value); }}
      />

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.sm}px ${SP.md}px`, marginBottom: SP.md,
        background: swatch.white, border: `1px solid ${BORDER}`, borderRadius: R.md,
      }}>
        <input
          type="text" aria-label="Search users by id, email, or name"
          placeholder="Search by id, email, or display name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          style={{ flex: 1, border: 'none', fontSize: FS.sm, fontFamily: sans, background: 'transparent' }}
        />
        <Button variant="gold" size="sm" onClick={search} disabled={searching}>
          Search
        </Button>
      </div>

      {error && (
        <p role="alert" style={{ fontSize: FS.sm, color: RED, fontFamily: sans }}>{error}</p>
      )}
      {status && (
        <p style={{ fontSize: FS.sm, color: GREEN, fontFamily: sans }}>{status}</p>
      )}

      {/* Results list */}
      {results.length > 0 && (
        <div role="table" aria-label="Search results"
          style={{ maxHeight: 220, overflowY: 'auto', marginBottom: SP.md, border: `1px solid ${BORDER2}`, borderRadius: R.md }}>
          <div role="row" style={{
            display: 'flex', gap: SP.sm, padding: `${SP.xs}px ${SP.md}px`,
            background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`,
            fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: sans,
          }}>
            <span role="columnheader" style={{ flex: 2, textAlign: 'left' }}>Name</span>
            <span role="columnheader" style={{ flex: 2, textAlign: 'left' }}>Email (masked)</span>
            <span role="columnheader" style={{ flex: 1, textAlign: 'left' }}>Role</span>
          </div>
          {results.map((u) => (
            <Button key={u.id} variant="ghost" size="sm" fullWidth role="row" onClick={() => openUser(u.id)}
              style={{
                gap: SP.sm, justifyContent: 'flex-start', whiteSpace: 'normal',
                padding: `${SP.sm}px ${SP.md}px`, background: u.id === id ? CARD_HDR : 'transparent',
                borderRadius: 0, borderBottom: `1px solid ${BORDER2}`, fontSize: FS.sm,
                fontWeight: 400, color: INK,
              }}>
              <span role="cell" style={{ flex: 2, fontWeight: 600, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.display_name || u.email_masked || u.id.slice(0, 8)}
              </span>
              <span role="cell" title="Masked email" style={{ flex: 2, color: MUTED, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.email_masked || '–'}
              </span>
              <span role="cell" style={{ flex: 1, color: MUTED, textTransform: 'uppercase', fontSize: FS.xxs, textAlign: 'left' }}>{u.role}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Selected user — REDACTED summary */}
      {selected && (
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.md, padding: SP.lg, background: swatch.white }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: SP.sm, marginBottom: SP.md }}>
            <div>
              <h4 style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, color: INK }}>
                {selected.display_name || 'User'}
              </h4>
              <div style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans }}>
                <span title={fullEmail ? undefined : 'Masked email'}>
                  {fullEmail || selected.email_masked || '–'}
                </span>
                {' · '}{selected.role}{' · '}{selected.tier}
                {selected.banned && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: RED, fontWeight: 600 }}>
                    {' · '}Banned
                  </span>
                )}
                {selected.disabled && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: RED, fontWeight: 600 }}>
                    {' · '}Disabled
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={revealFull} disabled={busy}>
              Reveal full details
            </Button>
          </div>

          {/* Redacted counters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.lg, padding: `${SP.md}px 0`, borderTop: `1px solid ${BORDER2}`, borderBottom: `1px solid ${BORDER2}`, marginBottom: SP.md }}>
            <Stat size="sm" label="Account age" value={selected.account_age_days != null ? `${selected.account_age_days}d` : '–'} />
            <Stat size="sm" label="Credits" value={selected.credits == null ? '–' : selected.credits} />
            <Stat size="sm" label="Settlements" value={selected.settlements == null ? '–' : selected.settlements} />
            <Stat size="sm" label="Gallery" value={selected.gallery_items == null ? '–' : selected.gallery_items} />
            <Stat size="sm" label="Campaigns" value={selected.campaigns == null ? '–' : selected.campaigns} />
            <Stat size="sm" label="Tickets" value={selected.tickets == null ? '–' : selected.tickets} />
            <Stat size="sm" label="Warnings" value={selected.warnings == null ? '–' : selected.warnings} />
          </div>

          {/* Billing summary — rendered after Review billing captures the payload.
              Redacted by contract: masked Stripe customer id, no raw payment data. */}
          {billing && (
            <div aria-label="Billing summary" style={{
              display: 'flex', flexWrap: 'wrap', gap: SP.lg, alignItems: 'center',
              padding: SP.md, marginBottom: SP.md,
              background: CARD_HDR, border: `1px solid ${BORDER2}`, borderRadius: R.md,
            }}>
              <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Billing
              </span>
              <Stat size="sm" label="Tier" value={billing.tier || '–'} />
              <Stat size="sm" label="Credits" value={billing.credits == null ? '–' : billing.credits} />
              <Stat size="sm" label="Founder" value={billing.is_founder ? 'Yes' : 'No'} />
              <Stat size="sm" label="Stripe customer" value={billing.customer_masked || 'None on file'} />
            </div>
          )}

          {/* Action set */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm }}>
            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Send email to user', label: 'Message', confirmLabel: 'Send' },
                (body) => runAction(
                  { action: 'send_user_email', userId: id, emailPayload: { subject: 'A message from SettlementForge', body } },
                  'Email sent (if configured).',
                ),
              )}>Send email</Button>

            <Button variant="warning" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Issue warning', label: 'Warning reason', confirmLabel: 'Issue' },
                (reason) => runAction(
                  { action: 'issue_warning', userId: id, severity: 'minor', reason, metadata: { notify: true } },
                  'Warning issued.',
                ),
              )}>Issue warning</Button>

            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Add internal note', body: 'The user can never read this note.', label: 'Note', confirmLabel: 'Add' },
                (note) => runAction(
                  { action: 'add_internal_note', userId: id, note },
                  'Internal note added.',
                ),
              )}>Add note</Button>

            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Grant / refund credits', body: 'Positive grants, negative refunds (e.g. 50 or -10).', label: 'Credits delta', confirmLabel: 'Apply' },
                (raw) => {
                  const delta = parseInt(raw, 10);
                  if (Number.isFinite(delta) && delta !== 0) runAction(
                    { action: 'grant_credits', userId: id, credits: delta, reason: 'admin adjustment' },
                    'Credits adjusted.',
                  );
                },
              )}>Grant / refund</Button>

            <Button variant="ghost" size="sm" disabled={busy} onClick={reviewBilling}>
              Review billing</Button>

            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => runAction(
                { action: 'set_account_disabled', userId: id, enabled: !!selected.disabled, reason: 'admin action' },
                selected.disabled ? 'Account enabled.' : 'Account disabled.',
              )}>{selected.disabled ? 'Enable' : 'Disable'}</Button>

            <Button variant="danger" size="sm" disabled={busy}
              onClick={() => runAction(
                { action: 'set_account_banned', userId: id, enabled: !!selected.banned, reason: 'admin action', metadata: { notify: !selected.banned } },
                selected.banned ? 'Account unbanned.' : 'Account banned.',
              )}>{selected.banned ? 'Unban' : 'Ban'}</Button>

            <Button variant="ghost" size="sm" disabled={busy} onClick={exportBundle}>
              Export bundle</Button>

            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Create full debug copy', body: 'A full debug copy is audited and includes raw PII. The copy downloads as a file and is placed on your clipboard.', label: 'Justification', confirmLabel: 'Create' },
                (reason) => fullDebugCopy(reason),
              )}>Full debug copy</Button>
          </div>

          {/* Per-settlement moderation (id-driven; soft-delete-first) */}
          <div style={{ marginTop: SP.md, paddingTop: SP.md, borderTop: `1px solid ${BORDER2}`, display: 'flex', flexWrap: 'wrap', gap: SP.sm, alignItems: 'center' }}>
            <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>Content moderation (by settlement id):</span>
            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Soft-delete settlement', body: 'Reversible: hides and unpublishes the settlement.', label: 'Settlement id', confirmLabel: 'Soft-delete' },
                (sid) => runAction(
                  { action: 'soft_delete_settlement', settlementId: sid, reason: 'moderation' },
                  'Settlement soft-deleted (reversible).',
                ),
              )}>Soft-delete settlement</Button>
            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Remove gallery item', body: 'Reversible: unpublishes the public dossier.', label: 'Settlement id', confirmLabel: 'Remove' },
                (sid) => runAction(
                  { action: 'remove_gallery_item', settlementId: sid, reason: 'moderation' },
                  'Removed from gallery (reversible).',
                ),
              )}>Remove gallery item</Button>
            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Revoke share link', body: 'Reversible: clears the share slug (re-sharing mints a new one).', label: 'Settlement id', confirmLabel: 'Revoke' },
                (sid) => runAction(
                  { action: 'revoke_share_link', settlementId: sid, reason: 'moderation' },
                  'Share link revoked (reversible).',
                ),
              )}>Revoke share link</Button>
          </div>
        </div>
      )}

      {!selected && !searching && results.length === 0 && (
        <p style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
          Search for a user to inspect their redacted profile and take action.
        </p>
      )}
    </section>
  );
}

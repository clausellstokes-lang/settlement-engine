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
import {
  Search, RefreshCw, Eye, AlertTriangle, StickyNote, Coins, CreditCard,
  Ban, Power, Trash2, Link2, FileDown, Mail, ShieldCheck,
} from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import Button from '../primitives/Button.jsx';
import { TextInputDialog } from '../primitives/Dialog.jsx';
import {
  INK, MUTED, BORDER, BORDER2, CARD, CARD_HDR, RED, GREEN,
  sans, serif_, SP, R, FS, swatch,
} from '../theme.js';

/** Invoke an admin-actions edge action. Returns the data payload or throws. */
async function callAdmin(body) {
  const { data, error } = await supabase.functions.invoke('admin-actions', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 78 }}>
      <div style={{ fontSize: FS.lg, fontWeight: 700, color: INK, fontFamily: sans }}>
        {value == null ? '—' : String(value)}
      </div>
      <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
    </div>
  );
}

export default function AdminUsersPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);   // redacted summary
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
    setBusy(true); setError(null); setStatus(null); setFullEmail(null);
    try {
      const data = await callAdmin({ action: 'get_user_summary', userId: id });
      setSelected(data?.summary || null);
    } catch (e) {
      setError(e?.message || 'Failed to load user');
    } finally {
      setBusy(false);
    }
  }, []);

  /** Run an action against the selected user, then refresh the summary. */
  const runAction = useCallback(async (body, successMsg) => {
    if (!selected?.id) return;
    setBusy(true); setError(null); setStatus(null);
    try {
      await callAdmin(body);
      setStatus(successMsg);
      const data = await callAdmin({ action: 'get_user_summary', userId: selected.id });
      setSelected(data?.summary || null);
    } catch (e) {
      setError(e?.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  }, [selected]);

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
    <section aria-label="User management" style={{
      border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, padding: SP.lg,
    }}>
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
        <Search size={14} color={MUTED} />
        <input
          type="text" aria-label="Search users by id, email, or name"
          placeholder="Search by id, email, or display name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: FS.sm, fontFamily: sans, background: 'transparent' }}
        />
        <Button variant="gold" size="sm" onClick={search} disabled={searching}
          icon={<RefreshCw size={12} />}>
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
        <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: SP.md, border: `1px solid ${BORDER2}`, borderRadius: R.md }}>
          {results.map((u) => (
            <Button key={u.id} variant="ghost" size="sm" fullWidth onClick={() => openUser(u.id)}
              style={{
                gap: SP.sm, justifyContent: 'flex-start', whiteSpace: 'normal',
                padding: `${SP.sm}px ${SP.md}px`, background: u.id === id ? CARD_HDR : 'transparent',
                borderRadius: 0, borderBottom: `1px solid ${BORDER2}`, fontSize: FS.sm,
                fontWeight: 400, color: INK,
              }}>
              <span style={{ flex: 2, fontWeight: 600, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.display_name || u.email_masked || u.id.slice(0, 8)}
              </span>
              <span style={{ flex: 2, color: MUTED, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.email_masked || '—'}
              </span>
              <span style={{ flex: 1, color: MUTED, textTransform: 'uppercase', fontSize: FS.xxs, textAlign: 'left' }}>{u.role}</span>
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
                {fullEmail || selected.email_masked || '—'}
                {' · '}{selected.role}{' · '}{selected.tier}
                {selected.banned && <span style={{ color: RED, fontWeight: 700 }}> · BANNED</span>}
                {selected.disabled && <span style={{ color: RED, fontWeight: 700 }}> · DISABLED</span>}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={revealFull} disabled={busy}
              icon={<Eye size={12} />}>
              Reveal full details
            </Button>
          </div>

          {/* Redacted counters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.lg, padding: `${SP.md}px 0`, borderTop: `1px solid ${BORDER2}`, borderBottom: `1px solid ${BORDER2}`, marginBottom: SP.md }}>
            <Stat label="Account age" value={selected.account_age_days != null ? `${selected.account_age_days}d` : null} />
            <Stat label="Credits" value={selected.credits} />
            <Stat label="Settlements" value={selected.settlements} />
            <Stat label="Gallery" value={selected.gallery_items} />
            <Stat label="Campaigns" value={selected.campaigns} />
            <Stat label="Tickets" value={selected.tickets} />
            <Stat label="Warnings" value={selected.warnings} />
          </div>

          {/* Action set */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm }}>
            <Button variant="ghost" size="sm" disabled={busy} icon={<Mail size={12} />}
              onClick={() => ask(
                { title: 'Send email to user', label: 'Message', confirmLabel: 'Send' },
                (body) => runAction(
                  { action: 'send_user_email', userId: id, emailPayload: { subject: 'A message from SettlementForge', body } },
                  'Email sent (if configured).',
                ),
              )}>Send email</Button>

            <Button variant="warning" size="sm" disabled={busy} icon={<AlertTriangle size={12} />}
              onClick={() => ask(
                { title: 'Issue warning', label: 'Warning reason', confirmLabel: 'Issue' },
                (reason) => runAction(
                  { action: 'issue_warning', userId: id, severity: 'minor', reason, metadata: { notify: true } },
                  'Warning issued.',
                ),
              )}>Issue warning</Button>

            <Button variant="ghost" size="sm" disabled={busy} icon={<StickyNote size={12} />}
              onClick={() => ask(
                { title: 'Add internal note', body: 'The user can never read this note.', label: 'Note', confirmLabel: 'Add' },
                (note) => runAction(
                  { action: 'add_internal_note', userId: id, note },
                  'Internal note added.',
                ),
              )}>Add note</Button>

            <Button variant="ghost" size="sm" disabled={busy} icon={<Coins size={12} />}
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

            <Button variant="ghost" size="sm" disabled={busy} icon={<CreditCard size={12} />}
              onClick={() => runAction({ action: 'review_billing', userId: id }, 'Billing summary loaded.')}>
              Review billing</Button>

            <Button variant="ghost" size="sm" disabled={busy} icon={<Power size={12} />}
              onClick={() => runAction(
                { action: 'set_account_disabled', userId: id, enabled: !!selected.disabled, reason: 'admin action' },
                selected.disabled ? 'Account enabled.' : 'Account disabled.',
              )}>{selected.disabled ? 'Enable' : 'Disable'}</Button>

            <Button variant="danger" size="sm" disabled={busy} icon={<Ban size={12} />}
              onClick={() => runAction(
                { action: 'set_account_banned', userId: id, enabled: !!selected.banned, reason: 'admin action', metadata: { notify: !selected.banned } },
                selected.banned ? 'Account unbanned.' : 'Account banned.',
              )}>{selected.banned ? 'Unban' : 'Ban'}</Button>

            <Button variant="ghost" size="sm" disabled={busy} icon={<FileDown size={12} />}
              onClick={() => runAction({ action: 'diagnostic_bundle', userId: id }, 'Redacted bundle exported.')}>
              Export bundle</Button>

            <Button variant="ghost" size="sm" disabled={busy} icon={<ShieldCheck size={12} />}
              onClick={() => ask(
                { title: 'Create full debug copy', body: 'A full debug copy is audited and includes raw PII.', label: 'Justification', confirmLabel: 'Create' },
                (reason) => runAction(
                  { action: 'diagnostic_bundle', userId: id, full: true, reason },
                  'Full debug copy created (audited).',
                ),
              )}>Full debug copy</Button>
          </div>

          {/* Per-settlement moderation (id-driven; soft-delete-first) */}
          <div style={{ marginTop: SP.md, paddingTop: SP.md, borderTop: `1px solid ${BORDER2}`, display: 'flex', flexWrap: 'wrap', gap: SP.sm, alignItems: 'center' }}>
            <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>Content moderation (by settlement id):</span>
            <Button variant="ghost" size="sm" disabled={busy} icon={<Trash2 size={12} />}
              onClick={() => ask(
                { title: 'Soft-delete settlement', body: 'Reversible: hides + unpublishes the settlement.', label: 'Settlement id', confirmLabel: 'Soft-delete' },
                (sid) => runAction(
                  { action: 'soft_delete_settlement', settlementId: sid, reason: 'moderation' },
                  'Settlement soft-deleted (reversible).',
                ),
              )}>Soft-delete settlement</Button>
            <Button variant="ghost" size="sm" disabled={busy} icon={<Trash2 size={12} />}
              onClick={() => ask(
                { title: 'Remove gallery item', body: 'Reversible: unpublishes the public dossier.', label: 'Settlement id', confirmLabel: 'Remove' },
                (sid) => runAction(
                  { action: 'remove_gallery_item', settlementId: sid, reason: 'moderation' },
                  'Removed from gallery (reversible).',
                ),
              )}>Remove gallery item</Button>
            <Button variant="ghost" size="sm" disabled={busy} icon={<Link2 size={12} />}
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
        <p style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans }}>
          Search for a user to inspect their redacted profile and take action.
        </p>
      )}
    </section>
  );
}

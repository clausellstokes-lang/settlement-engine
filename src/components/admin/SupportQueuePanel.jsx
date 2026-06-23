/**
 * SupportQueuePanel.jsx — Phase A5 support-agent ticket queue.
 *
 * Built on the A3/A4 least-privilege foundation: every read is REDACTED
 * (masked sender email) and every mutation goes through the audited, role-gated
 * admin-actions edge function.
 *   • List the pool, filter by status (`list_ticket_pool`).
 *   • Open a ticket → its full thread incl. internal notes (`list_ticket_thread`
 *     — support+ sees everything; the OWNER never does).
 *   • Claim it (`claim_ticket`), transition status (`set_ticket_status`), post a
 *     user-visible reply OR an internal note (`post_ticket_reply`), and link an
 *     FAQ article when answering (`link_ticket_faq`).
 *
 * Text input uses the in-app TextInputDialog (no native window.prompt).
 * Rendered only for elevated users (the parent gates on isElevated); the real
 * authority is server-side.
 */
import { useCallback, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import Button from '../primitives/Button.jsx';
import { TextInputDialog } from '../primitives/Dialog.jsx';
import {
  INK, MUTED, BODY, BORDER, BORDER2, CARD_HDR, RED, GREEN, GOLD, GOLD_BG,
  sans, serif_, SP, R, FS, swatch,
} from '../theme.js';

const STATUSES = [
  'new', 'triage', 'assigned', 'in_progress', 'waiting_on_user',
  'resolved', 'closed', 'reopened',
];
// Display labels for the operator <select>. The VALUE stays the raw slug (the
// wire value for set_ticket_status); only the visible text is prettified.
const STATUS_LABELS = {
  new: 'New',
  triage: 'Triage',
  assigned: 'Assigned',
  in_progress: 'In progress',
  waiting_on_user: 'Waiting on user',
  resolved: 'Resolved',
  closed: 'Closed',
  reopened: 'Reopened',
};
// FAQ slugs an agent can attach (mirrors AccountFAQ's Q_KEYS).
const FAQ_SLUGS = [
  'creditGrant', 'cancelAnytime', 'refundWindow', 'founderLifetime',
  'galleryPrivacy', 'aiOrSim',
];
// Display labels for the FAQ <select>. The VALUE stays the raw slug (the wire
// value for link_ticket_faq); only the visible text is prettified.
const FAQ_LABELS = {
  creditGrant: 'Credit grant',
  cancelAnytime: 'Cancel anytime',
  refundWindow: 'Refund window',
  founderLifetime: 'Founder lifetime',
  galleryPrivacy: 'Gallery privacy',
  aiOrSim: 'AI or simulation',
};

/** Invoke an admin-actions edge action. Returns the data payload or throws. */
async function callAdmin(body) {
  const { data, error } = await supabase.functions.invoke('admin-actions', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export default function SupportQueuePanel() {
  const [filter, setFilter] = useState('');           // '' = all
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  const [active, setActive] = useState(null);          // selected ticket row
  const [events, setEvents] = useState([]);
  const [busy, setBusy] = useState(false);
  const [prompt, setPrompt] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await callAdmin({ action: 'list_ticket_pool', status: filter || undefined });
      setTickets(Array.isArray(data?.tickets) ? data.tickets : []);
    } catch (e) {
      setError(e?.message || 'Failed to load queue'); setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const openTicket = useCallback(async (ticket) => {
    setActive(ticket); setEvents([]); setError(null); setStatus(null); setBusy(true);
    try {
      const data = await callAdmin({ action: 'list_ticket_thread', ticketId: ticket.id });
      setEvents(Array.isArray(data?.events) ? data.events : []);
    } catch (e) {
      setError(e?.message || 'Failed to load thread');
    } finally {
      setBusy(false);
    }
  }, []);

  /** Run an action on the active ticket, then refresh the thread + queue. */
  const runAction = useCallback(async (body, successMsg) => {
    if (!active?.id) return;
    setBusy(true); setError(null); setStatus(null);
    try {
      await callAdmin(body);
      setStatus(successMsg);
      const data = await callAdmin({ action: 'list_ticket_thread', ticketId: active.id });
      setEvents(Array.isArray(data?.events) ? data.events : []);
      await load();
    } catch (e) {
      setError(e?.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  }, [active, load]);

  const ask = useCallback((cfg, onValue) => {
    setPrompt({
      ...cfg,
      onSubmit: (raw) => { const v = (raw || '').trim(); if (v) onValue(v); },
    });
  }, []);

  const id = active?.id;

  return (
    // P5 anti-box-soup: render flat. This panel only mounts inside AdminPanel's
    // <Section>, which already owns the card frame + the "Support Queue" <h2>
    // and its body padding — a self-framed card here would be a doubled
    // boundary + doubled padding. The active-ticket detail panel below keeps
    // its own frame.
    <section aria-label="Support ticket queue">

      <TextInputDialog
        open={!!prompt}
        title={prompt?.title || ''}
        body={prompt?.body}
        label={prompt?.label}
        confirmLabel={prompt?.confirmLabel || 'Confirm'}
        onCancel={() => setPrompt(null)}
        onConfirm={(value) => { const p = prompt; setPrompt(null); p?.onSubmit?.(value); }}
      />

      {/* Filter + load */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.md }}>
        <label htmlFor="queue-status-filter" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          Status
          <select id="queue-status-filter" value={filter} onChange={(e) => setFilter(e.target.value)}
            style={{ marginLeft: SP.xs, fontSize: FS.sm, padding: '4px 6px', borderRadius: R.sm, border: `1px solid ${BORDER}` }}>
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
          </select>
        </label>
        <Button variant="gold" size="sm" onClick={load} disabled={loading}>
          Load queue
        </Button>
      </div>

      {error && <p role="alert" style={{ fontSize: FS.sm, color: RED, fontFamily: sans }}>{error}</p>}
      {status && <p style={{ fontSize: FS.sm, color: GREEN, fontFamily: sans }}>{status}</p>}

      {/* Queue list */}
      {tickets.length > 0 && (
        <div role="table" aria-label="Ticket queue"
          style={{ maxHeight: 240, overflowY: 'auto', marginBottom: SP.md, border: `1px solid ${BORDER2}`, borderRadius: R.md }}>
          <div role="row" style={{
            display: 'flex', gap: SP.sm, padding: `${SP.xs}px ${SP.md}px`,
            background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`,
            fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: sans,
          }}>
            <span role="columnheader" style={{ minWidth: 72, textAlign: 'left' }}>Number</span>
            <span role="columnheader" style={{ flex: 2, textAlign: 'left' }}>Subject</span>
            <span role="columnheader" style={{ flex: 1, textAlign: 'left' }}>Email (masked)</span>
            <span role="columnheader" style={{ textAlign: 'left' }}>Priority</span>
            <span role="columnheader" style={{ textAlign: 'left' }}>Status</span>
          </div>
          {tickets.map((t) => (
            <Button key={t.id} variant="ghost" size="sm" fullWidth role="row" onClick={() => openTicket(t)}
              style={{
                gap: SP.sm, justifyContent: 'flex-start', whiteSpace: 'normal',
                padding: `${SP.sm}px ${SP.md}px`, background: t.id === id ? CARD_HDR : 'transparent',
                borderRadius: 0, borderBottom: `1px solid ${BORDER2}`, fontSize: FS.sm,
                fontWeight: 400, color: INK,
              }}>
              <span role="cell" style={{ fontSize: FS.xxs, color: MUTED, minWidth: 72, textAlign: 'left' }}>{t.ticket_number}</span>
              <span role="cell" style={{ flex: 2, fontWeight: 600, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.subject}
              </span>
              <span role="cell" style={{ flex: 1, color: MUTED, textAlign: 'left', fontSize: FS.xxs }}>{t.email_masked || '–'}</span>
              <span role="cell" style={{ color: MUTED, textTransform: 'uppercase', fontSize: FS.xxs }}>{t.priority}</span>
              <span role="cell" style={{ color: t.status === 'new' ? swatch['#8C6F32'] : MUTED, textTransform: 'uppercase', fontSize: FS.xxs, fontWeight: 700 }}>{t.status}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Active ticket */}
      {active && (
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.md, padding: SP.lg, background: swatch.white }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap', marginBottom: SP.md }}>
            <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>{active.ticket_number}</span>
            <h4 style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, color: INK, flex: 1 }}>{active.subject}</h4>
            <span style={{ fontSize: FS.xs, color: MUTED }}>{active.email_masked}</span>
            <span style={{ fontSize: FS.xxs, fontWeight: 700, color: swatch['#8C6F32'], textTransform: 'uppercase' }}>{active.status}</span>
          </div>

          {/* Action set */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm, marginBottom: SP.md }}>
            <Button variant="gold" size="sm" disabled={busy}
              onClick={() => runAction({ action: 'claim_ticket', ticketId: id }, 'Ticket claimed.')}>
              Claim
            </Button>

            <label htmlFor="queue-set-status" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, display: 'flex', alignItems: 'center', gap: 4 }}>
              Set status
              <select id="queue-set-status" value={active.status} disabled={busy}
                onChange={(e) => runAction(
                  { action: 'set_ticket_status', ticketId: id, status: e.target.value, reason: 'agent transition' },
                  `Status set to ${e.target.value}.`,
                )}
                style={{ fontSize: FS.sm, padding: '4px 6px', borderRadius: R.sm, border: `1px solid ${BORDER}` }}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
              </select>
            </label>

            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Reply to user', body: 'This reply is visible to the ticket owner.', label: 'Reply', confirmLabel: 'Send reply' },
                (body) => runAction(
                  { action: 'post_ticket_reply', ticketId: id, body, visibility: 'user' },
                  'Reply posted.',
                ),
              )}>Reply to user</Button>

            <Button variant="ghost" size="sm" disabled={busy}
              onClick={() => ask(
                { title: 'Add internal note', body: 'The ticket owner can never read this note.', label: 'Internal note', confirmLabel: 'Add note' },
                (body) => runAction(
                  { action: 'post_ticket_reply', ticketId: id, body, visibility: 'internal' },
                  'Internal note added.',
                ),
              )}>Internal note</Button>

            <label htmlFor="queue-link-faq" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, display: 'flex', alignItems: 'center', gap: 4 }}>
              Link FAQ
              <select id="queue-link-faq" value={active.linked_faq || ''} disabled={busy}
                onChange={(e) => { if (e.target.value) runAction(
                  { action: 'link_ticket_faq', ticketId: id, faq: e.target.value },
                  'FAQ article linked.',
                ); }}
                style={{ fontSize: FS.sm, padding: '4px 6px', borderRadius: R.sm, border: `1px solid ${BORDER}` }}>
                <option value="">–</option>
                {FAQ_SLUGS.map((s) => <option key={s} value={s}>{FAQ_LABELS[s] || s}</option>)}
              </select>
            </label>
          </div>

          {/* Thread (support sees ALL events, incl. internal notes) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, maxHeight: 300, overflowY: 'auto', borderTop: `1px solid ${BORDER2}`, paddingTop: SP.md }}>
            {busy && events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: SP.md, color: MUTED, fontSize: FS.sm }}>Loading…</div>
            ) : events.length === 0 ? (
              <div style={{ fontSize: FS.sm, color: MUTED }}>No events yet.</div>
            ) : events.map((ev) => {
              const internal = ev.visibility === 'internal';
              return (
                <div key={ev.id} style={{
                  padding: `${SP.sm}px ${SP.md}px`,
                  background: internal ? GOLD_BG : CARD_HDR,
                  border: `1px solid ${internal ? GOLD : BORDER2}`, borderRadius: R.md,
                }}>
                  <div style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans, marginBottom: 2 }}>
                    {ev.author_role || 'user'}
                    {internal ? ' · Internal note. The ticket owner can never read this.' : ''}
                    {ev.kind === 'status_change' ? ' · update' : ''}
                  </div>
                  <div style={{ fontSize: FS.sm, color: INK, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{ev.body}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!active && !loading && tickets.length === 0 && (
        <p style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
          Load the queue to triage tickets. Claim a ticket, transition its status, reply to the user,
          add internal notes, or link an FAQ article.
        </p>
      )}
    </section>
  );
}

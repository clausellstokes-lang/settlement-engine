/**
 * AccountTickets.jsx — Phase A5 user-facing support ticket workflow.
 *
 * Rendered inside the Account "Customer Support" section, AFTER the FAQ
 * (self-resolve first). Surfaces:
 *   • "My tickets" — the caller's own tickets (number + status), via the
 *     account-actions `list_my_tickets` action (RLS/RPC-scoped to the caller).
 *   • "Create ticket" — category / priority / subject / message + an optional
 *     link picker (settlement / campaign / map / payment ref). Calls
 *     account-actions `create_ticket`.
 *   • Per-ticket thread — user-visible events ONLY (internal notes are never
 *     returned to the owner by the server) + a reply box (account-actions
 *     `reply_ticket`).
 *
 * All ticket I/O goes through the account-actions edge function (the user's
 * own-data endpoint). The client never reaches an internal note: the server
 * RPC enforces visibility, so there is nothing to hide client-side — the
 * thread payload simply doesn't contain them.
 */
import { useCallback, useState } from 'react';
import { Plus, ChevronLeft, RefreshCw, Send, CircleDot, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import Button from '../primitives/Button.jsx';
import Pill from '../primitives/Pill.jsx';
import {
  GOLD_TXT, INK, SECOND, BODY, BORDER, BORDER2, CARD_HDR, RED,
  sans, FS, SP, R, swatch, DANGER_BORDER,
} from '../theme.js';

const CATEGORIES = ['general', 'billing', 'bug', 'account', 'gallery', 'feature', 'other'];
const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

const STATUS_LABEL = {
  new: 'New', triage: 'Triage', assigned: 'Assigned', in_progress: 'In progress',
  waiting_on_user: 'Awaiting your reply', resolved: 'Resolved', closed: 'Closed',
  reopened: 'Reopened',
};

/** Invoke an account-actions edge action. Returns data or throws. */
async function callAccount(body) {
  const { data, error } = await supabase.functions.invoke('account-actions', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

function StatusPill({ status }) {
  const open = !['resolved', 'closed'].includes(status);
  // Two-channel + AA: open carries GOLD_TXT (gold-800, 7.25:1 on parchment —
  // brand GOLD failed at 2.20:1) with a dot glyph; closed uses BODY (ink-600,
  // AA-passing) on a deeper neutral with a check glyph. So the state reads in
  // colour + icon + text, never colour alone (P7).
  return (
    <Pill
      bg={open ? swatch['#FBF5E6'] : swatch['#E0D0B0']}
      color={open ? GOLD_TXT : BODY}
      icon={open
        ? <CircleDot size={11} aria-hidden="true" />
        : <CheckCircle2 size={11} aria-hidden="true" />}
      style={{ borderRadius: R.sm }}
    >
      {STATUS_LABEL[status] || status}
    </Pill>
  );
}

export default function AccountTickets() {
  const [view, setView] = useState('list');   // 'list' | 'create' | 'thread'
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // create form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('normal');
  const [settlementId, setSettlementId] = useState('');
  const [creating, setCreating] = useState(false);

  // thread
  const [active, setActive] = useState(null);   // the selected ticket row
  const [events, setEvents] = useState([]);
  const [replyBody, setReplyBody] = useState('');
  const [replying, setReplying] = useState(false);

  const loadTickets = useCallback(async () => {
    if (!supabase) return;
    setLoading(true); setError(null);
    try {
      const data = await callAccount({ action: 'list_my_tickets' });
      setTickets(Array.isArray(data?.tickets) ? data.tickets : []);
    } catch (e) {
      setError(e?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  const openThread = useCallback(async (ticket) => {
    setActive(ticket); setView('thread'); setEvents([]); setError(null);
    setLoading(true);
    try {
      const data = await callAccount({ action: 'list_ticket_thread', ticketId: ticket.id });
      setEvents(Array.isArray(data?.events) ? data.events : []);
    } catch (e) {
      setError(e?.message || 'Failed to load thread');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitCreate = useCallback(async () => {
    if (!subject.trim() || !message.trim()) return;
    setCreating(true); setError(null);
    try {
      const links = settlementId.trim() ? { settlement_id: settlementId.trim() } : {};
      await callAccount({
        action: 'create_ticket',
        subject: subject.trim(), message: message.trim(),
        category, priority, links,
        metadata: typeof navigator !== 'undefined' ? { ua: navigator.userAgent } : {},
      });
      setSubject(''); setMessage(''); setCategory('general'); setPriority('normal'); setSettlementId('');
      setView('list');
      await loadTickets();
    } catch (e) {
      setError(e?.message || 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  }, [subject, message, category, priority, settlementId, loadTickets]);

  const submitReply = useCallback(async () => {
    if (!active || !replyBody.trim()) return;
    setReplying(true); setError(null);
    try {
      await callAccount({ action: 'reply_ticket', ticketId: active.id, body: replyBody.trim() });
      setReplyBody('');
      const data = await callAccount({ action: 'list_ticket_thread', ticketId: active.id });
      setEvents(Array.isArray(data?.events) ? data.events : []);
    } catch (e) {
      setError(e?.message || 'Failed to send reply');
    } finally {
      setReplying(false);
    }
  }, [active, replyBody]);

  const inputStyle = {
    width: '100%', padding: `${SP.sm + 2}px ${SP.md}px`,
    border: `1px solid ${BORDER}`, borderRadius: R.md,
    fontSize: FS.md, fontFamily: sans, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <span style={{ fontSize: FS.md, fontWeight: 700, color: INK, fontFamily: sans, flex: 1 }}>
          My tickets
        </span>
        {view === 'list' && (
          <>
            <Button variant="ghost" size="sm" onClick={loadTickets} icon={<RefreshCw size={12} />}>
              Refresh
            </Button>
            <Button variant="gold" size="sm" onClick={() => { setError(null); setView('create'); }}
              icon={<Plus size={12} />}>
              New ticket
            </Button>
          </>
        )}
        {view !== 'list' && (
          <Button variant="ghost" size="sm" onClick={() => { setError(null); setView('list'); }}
            icon={<ChevronLeft size={12} />}>
            Back to tickets
          </Button>
        )}
      </div>

      {error && (
        <div role="alert" style={{
          padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg,
          border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: RED,
        }}>
          {error}
        </div>
      )}

      {/* ── LIST ─────────────────────────────────────────────────────── */}
      {view === 'list' && (
        loading ? (
          <div style={{ textAlign: 'center', padding: SP.lg, color: BODY, fontSize: FS.sm }}>Loading…</div>
        ) : tickets.length === 0 ? (
          <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5 }}>
            No tickets yet. If the FAQ above did not answer your question, open a new ticket.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
            {tickets.map((t) => (
              <Button key={t.id} variant="ghost" size="md" fullWidth onClick={() => openThread(t)}
                style={{
                  justifyContent: 'flex-start', textAlign: 'left', gap: SP.sm,
                  padding: `${SP.sm + 2}px ${SP.md}px`, border: `1px solid ${BORDER2}`,
                  borderRadius: R.md, background: swatch.white, whiteSpace: 'normal',
                }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: FS.xxs, color: BODY, fontFamily: sans }}>{t.ticket_number}</span>
                  <span style={{ display: 'block', fontSize: FS.sm, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.subject}
                  </span>
                </span>
                <StatusPill status={t.status} />
              </Button>
            ))}
          </div>
        )
      )}

      {/* ── CREATE ───────────────────────────────────────────────────── */}
      {view === 'create' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <div style={{ display: 'flex', gap: SP.sm }}>
            <label htmlFor="ticket-category" style={{ flex: 1, fontSize: FS.xs, color: BODY, fontFamily: sans }}>
              Category
              <select id="ticket-category" value={category} onChange={(e) => setCategory(e.target.value)}
                style={{ ...inputStyle, marginTop: 2 }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label htmlFor="ticket-priority" style={{ flex: 1, fontSize: FS.xs, color: BODY, fontFamily: sans }}>
              Priority
              <select id="ticket-priority" value={priority} onChange={(e) => setPriority(e.target.value)}
                style={{ ...inputStyle, marginTop: 2 }}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          </div>
          <input aria-label="Subject" type="text" placeholder="Subject"
            value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle} />
          <textarea aria-label="Describe your issue or question"
            placeholder="Describe your issue or question…"
            value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
            style={{ ...inputStyle, resize: 'vertical' }} />
          <input aria-label="Related settlement id (optional)" type="text"
            placeholder="Related settlement id (optional)"
            value={settlementId} onChange={(e) => setSettlementId(e.target.value)} style={inputStyle} />
          <Button variant="primary" size="lg" fullWidth busy={creating}
            onClick={submitCreate} disabled={creating || !subject.trim() || !message.trim()}>
            {creating ? 'Creating…' : 'Create ticket'}
          </Button>
        </div>
      )}

      {/* ── THREAD ───────────────────────────────────────────────────── */}
      {view === 'thread' && active && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap' }}>
            <span style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>{active.ticket_number}</span>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: INK, fontFamily: sans, flex: 1 }}>
              {active.subject}
            </span>
            <StatusPill status={active.status} />
          </div>

          {active.linked_faq && (
            <div style={{ fontSize: FS.sm, color: SECOND, background: swatch['#FBF5E6'], padding: `${SP.sm}px ${SP.md}px`, borderRadius: R.md }}>
              Support linked a help article that may answer this: <strong>{active.linked_faq}</strong>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, maxHeight: 320, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: SP.md, color: BODY, fontSize: FS.sm }}>Loading…</div>
            ) : events.length === 0 ? (
              <div style={{ fontSize: FS.sm, color: BODY }}>No replies yet.</div>
            ) : events.map((ev) => {
              const fromAgent = ev.author_role && ev.author_role !== 'user';
              return (
                <div key={ev.id} style={{
                  padding: `${SP.sm}px ${SP.md}px`,
                  background: fromAgent ? CARD_HDR : swatch.white,
                  border: `1px solid ${BORDER2}`, borderRadius: R.md,
                  alignSelf: fromAgent ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                }}>
                  <div style={{ fontSize: FS.xxs, color: BODY, fontFamily: sans, marginBottom: 2 }}>
                    {fromAgent ? 'Support' : 'You'}
                    {ev.kind === 'status_change' ? ' · update' : ''}
                  </div>
                  <div style={{ fontSize: FS.sm, color: INK, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{ev.body}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: SP.sm, alignItems: 'flex-end' }}>
            <textarea aria-label="Your reply" placeholder="Write a reply…"
              value={replyBody} onChange={(e) => setReplyBody(e.target.value)} rows={2}
              style={{ ...inputStyle, resize: 'vertical', flex: 1 }} />
            <Button variant="gold" size="md" busy={replying}
              onClick={submitReply} disabled={replying || !replyBody.trim()} icon={<Send size={13} />}>
              Reply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

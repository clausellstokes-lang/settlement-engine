/**
 * Separate mass-message composer. Audience v1 is deliberately fixed to all;
 * queueing requires the exact SEND TO ALL two-key ceremony and creates a
 * five-minute cancel window on the server.
 */
import { useCallback, useEffect, useId, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import Button from '../primitives/Button.jsx';
import AdminTwoKeyDialog from './AdminTwoKeyDialog.jsx';
import { INK, MUTED, BODY, RED, GREEN, BORDER, BORDER2, CARD_HDR, sans, SP, FS, swatch } from '../theme.js';

const BROADCAST_CONFIRMATION_PHRASE = 'SEND TO ALL';

const BROADCAST_TEMPLATES = Object.freeze({
  product_update: {
    label: 'Product update',
    messageClass: 'announcement',
    subject: 'News from SettlementForge',
    body: '',
  },
  service_notice: {
    label: 'Service notice',
    messageClass: 'service',
    subject: 'A service notice from SettlementForge',
    body: '',
  },
  custom_service: {
    label: 'Custom service notice',
    messageClass: 'service',
    subject: 'A service notice from SettlementForge',
    body: '',
  },
  custom_announcement: {
    label: 'Custom announcement',
    messageClass: 'announcement',
    subject: '',
    body: '',
  },
});

const fieldStyle = {
  padding: `${SP.sm}px ${SP.md}px`,
  border: `1px solid ${BORDER}`,
  background: swatch.white,
  color: INK,
  fontFamily: sans,
  fontSize: FS.sm,
};

async function callAdmin(body) {
  const { data, error } = await supabase.functions.invoke('admin-actions', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

function asBroadcasts(data) {
  return Array.isArray(data?.broadcasts) ? data.broadcasts : [];
}

function cancelSeconds(row, nowMs) {
  const at = Date.parse(row?.sendAfter || row?.send_after || '');
  if (!Number.isFinite(at)) return 0;
  return Math.max(0, Math.ceil((at - nowMs) / 1000));
}

function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function AdminBroadcastPanel() {
  const [template, setTemplate] = useState('product_update');
  const [subject, setSubject] = useState('News from SettlementForge');
  const [body, setBody] = useState('');
  const [twoKey, setTwoKey] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const templateId = useId();
  const subjectId = useId();
  const bodyId = useId();
  const selectedTemplate = BROADCAST_TEMPLATES[template]
    || BROADCAST_TEMPLATES.product_update;
  const messageClass = selectedTemplate.messageClass;

  const refresh = useCallback(async () => {
    if (!supabase) return;
    try {
      const data = await callAdmin({ action: 'list_operator_broadcasts' });
      setBroadcasts(asBroadcasts(data));
    } catch (err) {
      setError(err?.message || 'Could not load queued broadcasts.');
    }
  }, []);

  // Mount-load mirrors the existing admin panels. refresh owns the async state
  // transition; this effect only starts that external request.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    refresh();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [refresh]);
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const chooseTemplate = (key) => {
    const registeredKey = Object.prototype.hasOwnProperty.call(BROADCAST_TEMPLATES, key)
      ? key
      : 'custom_announcement';
    const next = BROADCAST_TEMPLATES[registeredKey];
    setTemplate(registeredKey);
    setSubject(next.subject);
    setBody(next.body);
  };

  const valid = subject.trim().length > 0 && body.trim().length > 0;

  const queue = () => {
    if (!valid) return;
    setTwoKey({
      title: 'Queue broadcast to every account',
      body: 'This creates one broadcast and one delivery job with a five-minute cancel window. Retype the exact phrase and verify your password.',
      expectedText: BROADCAST_CONFIRMATION_PHRASE,
      confirmationLabel: `Retype ${BROADCAST_CONFIRMATION_PHRASE}`,
      confirmationAriaLabel: `Retype ${BROADCAST_CONFIRMATION_PHRASE}`,
      confirmLabel: 'Queue broadcast',
    });
  };

  const cancel = async (messageId) => {
    setBusy(true); setError(null); setStatus(null);
    try {
      await callAdmin({ action: 'cancel_operator_broadcast', messageId });
      setStatus('Broadcast canceled before delivery began.');
      await refresh();
    } catch (err) {
      setError(err?.message || 'Broadcast cancellation failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-label="Broadcast messages">
      <AdminTwoKeyDialog
        config={twoKey}
        onCancel={() => setTwoKey(null)}
        onConfirmed={async ({ typedText }) => {
          setBusy(true); setError(null); setStatus(null);
          try {
            const data = await callAdmin({
              action: 'queue_operator_broadcast',
              audience: 'all',
              messageClass,
              subject: subject.trim(),
              messageBody: body.trim(),
              messageTemplate: template,
              confirm: { typedBroadcastPhrase: typedText },
            });
            setTwoKey(null);
            const count = data?.audienceCount ?? data?.audience_count;
            setStatus(`Broadcast queued${Number.isFinite(Number(count)) ? ` for ${count} accounts` : ''}. It can be canceled for five minutes.`);
            setBody('');
            await refresh();
          } catch (err) {
            setError(err?.message || 'Broadcast queue failed.');
            throw err;
          } finally {
            setBusy(false);
          }
        }}
      />

      <p style={{ margin: `0 0 ${SP.md}px`, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
        Audience is fixed to all accounts. Account Messages always receives the broadcast. Announcement email is limited to explicit product-update consent; service email is transactional.
      </p>

      {error && <p role="alert" style={{ color: RED, fontFamily: sans, fontSize: FS.sm }}>{error}</p>}
      {status && <p role="status" style={{ color: GREEN, fontFamily: sans, fontSize: FS.sm }}>{status}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: SP.lg }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {/* eslint-disable-next-line jsx-a11y/label-has-for -- associated via htmlFor/id; nesting would break the editor layout */}
          <label htmlFor={templateId} style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>Template</label>
          <select id={templateId} aria-label="Broadcast template" value={template} onChange={(event) => chooseTemplate(event.target.value)} style={fieldStyle}>
            {Object.entries(BROADCAST_TEMPLATES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
          </select>

          {/* eslint-disable-next-line jsx-a11y/label-has-for -- associated via htmlFor/id; nesting would break the editor layout */}
          <label htmlFor={subjectId} style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>Subject</label>
          <input id={subjectId} aria-label="Broadcast subject" maxLength={160} value={subject} onChange={(event) => setSubject(event.target.value)} style={fieldStyle} />

          {/* eslint-disable-next-line jsx-a11y/label-has-for -- associated via htmlFor/id; nesting would break the editor layout */}
          <label htmlFor={bodyId} style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>Message</label>
          <textarea id={bodyId} aria-label="Broadcast message" maxLength={10000} rows={9} value={body} onChange={(event) => setBody(event.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />

          <Button variant="danger" size="sm" disabled={!valid || busy} onClick={queue}>Queue broadcast</Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
          <div aria-label="Broadcast Account preview" style={{ padding: SP.md, border: `1px solid ${BORDER}`, background: CARD_HDR }}>
            <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, textTransform: 'uppercase' }}>Account preview · {messageClass}</div>
            <div style={{ marginTop: SP.xs, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 700 }}>{subject || 'Subject'}</div>
            <div style={{ marginTop: SP.xs, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{body || 'Message'}</div>
          </div>
          <div aria-label="Broadcast email preview" style={{ padding: SP.md, border: `1px solid ${BORDER}`, background: swatch.white }}>
            <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, textTransform: 'uppercase' }}>Email preview</div>
            <div style={{ marginTop: SP.xs, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 700 }}>{subject || 'Subject'}</div>
            <div style={{ marginTop: SP.xs, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {body || 'Message'}
              {messageClass === 'announcement' ? '\n\nAn unsubscribe link is appended by the delivery worker.' : '\n\nService notice · email preferences do not suppress delivery.'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: SP.lg, paddingTop: SP.md, borderTop: `1px solid ${BORDER2}` }}>
        <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, marginBottom: SP.sm }}>Queued broadcasts</div>
        {broadcasts.length === 0 ? (
          <p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.sm }}>No queued broadcasts.</p>
        ) : broadcasts.map((row) => {
          const id = row.id || row.messageId || row.message_id;
          const remaining = cancelSeconds(row, nowMs);
          const canceled = Boolean(row.canceledAt || row.canceled_at || row.status === 'canceled');
          return (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: SP.md, padding: `${SP.sm}px 0`, borderTop: `1px solid ${BORDER2}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 700 }}>{row.subject || 'Broadcast'}</div>
                <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs }}>
                  {canceled ? 'Canceled' : remaining > 0 ? `Cancel window ${formatCountdown(remaining)}` : 'Delivery eligible'}
                </div>
              </div>
              {!canceled && remaining > 0 && <Button variant="secondary" size="sm" disabled={busy} onClick={() => cancel(id)}>Cancel</Button>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

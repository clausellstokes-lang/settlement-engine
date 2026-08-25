/**
 * FeedbackWidget.jsx — the floating in-app feedback affordance (Wave 4d owner
 * item). A labelled bottom-right button opens a small panel; a submission files
 * a support ticket through the SAME `support_messages` seam the Account support
 * form uses, tagged with the current generation-id spine id (generation_ref) so
 * an operator triaging in the Support queue sees WHICH generated settlement the
 * feedback was about.
 *
 * Contract:
 *   • category is 'other' — the 055 support_messages CHECK constraint allows
 *     general|billing|bug|account|gallery|feature|other (NOT a 'feedback' value),
 *     so general product feedback lands in 'other'. (Bug reports still route
 *     through the Account support form with a chosen category.)
 *   • generation_ref = the store's generationId (the deriveGenerationId spine id),
 *     best-effort — null when no settlement is active.
 *   • Signed-in users submit with their account email; anonymous visitors provide
 *     one. Fire-and-forget: a failure surfaces inline and never blocks the app.
 *
 * MOUNTING: this is a GLOBAL floating widget — App.jsx (the shell owner) mounts
 * it once, passing `visible={!isAuthRoute}` so it stays off the auth/checkout
 * chrome. It is intentionally self-contained (reads the store, owns its own
 * open/submit state) so that mount is a one-liner. Styling uses this tree's
 * theme vocabulary only — no new raw colors.
 */
import { useState } from 'react';
import { MessageSquare, X, Check } from 'lucide-react';
import { useStore } from '../store/index.js';
import { supabase, isConfigured } from '../lib/supabase.js';
import { deriveGenerationId } from '../lib/generationTelemetry.js';
import useIsMobile from '../hooks/useIsMobile.js';
import { INK, BODY, MUTED, BORDER, CARD, sans, SP, R, FS, swatch } from './theme.js';
import Button from './primitives/Button.jsx';

export default function FeedbackWidget({ visible = true }) {
  const auth = useStore(s => s.auth);
  const generationId = useStore(s => s.generationId);
  const lastSeed = useStore(s => s.lastSeed);
  const generatedAt = useStore(s => s.generatedAt);
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  if (!visible) return null;

  const signedIn = Boolean(auth?.user);
  const effectiveEmail = signedIn ? (auth.user.email || '') : email.trim();
  const canSubmit = message.trim().length > 0 && effectiveEmail.length > 0 && !sending;

  // Best-effort generation context: the store-held spine id, else derive it from
  // the active seed + generatedAt (matches recordGenerationMilestone), else null.
  const generationRef = generationId
    || (lastSeed != null || generatedAt != null ? deriveGenerationId(lastSeed, generatedAt) : null);

  const reset = () => { setMessage(''); setEmail(''); setError(null); setSent(false); };

  const handleClose = () => { setOpen(false); reset(); };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSending(true);
    setError(null);
    try {
      if (isConfigured && supabase) {
        const { error: insErr } = await supabase.from('support_messages').insert({
          user_id: auth?.user?.id || null,
          email: effectiveEmail,
          subject: 'In-app feedback',
          message: message.trim(),
          category: 'other',
          generation_ref: generationRef,
        });
        if (insErr) throw insErr;
      }
      setSent(true);
      setMessage('');
    } catch (e) {
      setError(e?.message || 'Could not send your feedback. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Sit above the mobile bottom nav; clear of the desktop edge otherwise.
  const anchor = {
    position: 'fixed',
    right: SP.lg,
    bottom: isMobile ? 76 : SP.lg,
    zIndex: 900,
  };

  if (!open) {
    return (
      <div style={anchor}>
        <Button
          variant="primary"
          size="md"
          icon={<MessageSquare size={14} />}
          onClick={() => setOpen(true)}
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.18)' }}
          aria-haspopup="dialog"
        >
          Feedback
        </Button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Send feedback"
      style={{
        ...anchor,
        width: isMobile ? 'calc(100vw - 32px)' : 340,
        maxWidth: 'calc(100vw - 32px)',
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: R.xl,
        boxShadow: '0 8px 28px rgba(0,0,0,0.22)',
        padding: SP.lg,
        display: 'flex', flexDirection: 'column', gap: SP.md,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.sm }}>
        <span style={{ fontFamily: sans, fontSize: FS.md, fontWeight: 700, color: INK }}>
          Send feedback
        </span>
        <Button variant="ghost" size="sm" icon={<X size={16} />} onClick={handleClose} aria-label="Close feedback" />
      </div>

      {sent ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.sm, padding: SP.md }}>
          <Check size={28} color={swatch.success} />
          <div style={{ fontSize: FS.sm, color: BODY, textAlign: 'center', lineHeight: 1.5 }}>
            Thank you. Your note reached the team.
          </div>
          <Button variant="secondary" size="sm" onClick={reset}>Send another</Button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: FS.sm, color: BODY, margin: 0, lineHeight: 1.5 }}>
            Tell us what is working or what is not. It goes straight to the team.
          </p>

          {error && (
            <div role="alert" style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, borderRadius: R.md, fontSize: FS.sm, color: swatch.danger }}>
              {error}
            </div>
          )}

          {!signedIn && (
            <input
              aria-label="Your email address"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: `${SP.sm + 2}px ${SP.md}px`,
                border: `1px solid ${BORDER}`, borderRadius: R.md,
                fontSize: FS.sm, fontFamily: sans, outline: 'none', boxSizing: 'border-box',
              }}
            />
          )}

          <textarea
            aria-label="Your feedback"
            placeholder="Your feedback…"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: `${SP.sm + 2}px ${SP.md}px`,
              border: `1px solid ${BORDER}`, borderRadius: R.md,
              fontSize: FS.sm, fontFamily: sans, outline: 'none',
              resize: 'vertical', boxSizing: 'border-box',
            }}
          />

          {generationRef && (
            <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>
              This note will include a reference to the settlement you are viewing, so we can find it.
            </div>
          )}

          <Button variant="primary" size="md" fullWidth busy={sending} disabled={!canSubmit} onClick={handleSubmit}>
            {sending ? 'Sending…' : 'Send feedback'}
          </Button>
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Flag, X } from 'lucide-react';

import {
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  ELEV,
  FS,
  GOLD,
  INK,
  MUTED,
  R,
  RED,
  RED_BG,
  SECOND,
  SP,
  sans,
  swatch,
} from '../theme.js';
import { REPORT_REASON_OPTIONS } from './galleryUtils.js';

export default function GalleryReportDialog({ dossier, auth, disabled, onReport }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('unsafe_content');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const requestOpen = async () => {
    if (!auth?.user) {
      await onReport?.(dossier, 'other', '');
      return;
    }
    setError(null);
    setOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const ok = await onReport?.(dossier, reason, body);
      if (ok) {
        setOpen(false);
        setBody('');
        setReason('unsafe_content');
      } else {
        setError('Report could not be sent.');
      }
    } catch (err) {
      setError(err?.message || 'Report could not be sent.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={requestOpen}
        disabled={disabled}
        title="Report settlement"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          minHeight: 28,
          padding: '4px 8px',
          border: `1px solid ${BORDER}`,
          borderRadius: R.sm,
          background: CARD,
          color: SECOND,
          fontFamily: sans,
          fontSize: FS.xs,
          fontWeight: 900,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.65 : 1,
        }}
      >
        <Flag size={13} /> Report
      </button>
      {open && (
        <div
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget && !busy) setOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: SP.lg,
            background: 'rgba(27,20,8,0.46)',
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-label="Report settlement"
            onSubmit={submit}
            style={{
              width: 'min(100%, 480px)',
              border: `1px solid ${BORDER}`,
              borderRadius: R.lg,
              background: CARD,
              boxShadow: ELEV[3],
              overflow: 'hidden',
            }}
          >
            <header style={{
              display: 'flex',
              alignItems: 'center',
              gap: SP.sm,
              padding: SP.lg,
              borderBottom: `1px solid ${BORDER}`,
              background: CARD_ALT,
            }}>
              <Flag size={16} color={GOLD} />
              <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, fontWeight: 950 }}>
                Report Settlement
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                disabled={busy}
                style={{ marginLeft: 'auto', border: 'none', background: 'transparent', color: MUTED, cursor: busy ? 'not-allowed' : 'pointer', padding: SP.xs }}
              >
                <X size={16} />
              </button>
            </header>
            <div style={{ display: 'grid', gap: SP.md, padding: SP.lg }}>
              <label style={{ display: 'grid', gap: 6, color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
                Reason
                <select
                  value={reason}
                  onChange={event => setReason(event.target.value)}
                  style={{
                    minHeight: 38,
                    border: `1px solid ${BORDER}`,
                    borderRadius: R.md,
                    background: CARD_ALT,
                    color: INK,
                    fontFamily: sans,
                    fontSize: FS.sm,
                    padding: '8px 10px',
                  }}
                >
                  {REPORT_REASON_OPTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </select>
              </label>
              <label style={{ display: 'grid', gap: 6, color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
                Notes
                <textarea
                  value={body}
                  onChange={event => setBody(event.target.value)}
                  maxLength={2000}
                  rows={5}
                  placeholder="Add context for the moderation queue"
                  style={{
                    resize: 'vertical',
                    border: `1px solid ${BORDER}`,
                    borderRadius: R.md,
                    background: CARD_ALT,
                    color: INK,
                    fontFamily: sans,
                    fontSize: FS.sm,
                    lineHeight: 1.5,
                    padding: SP.sm,
                  }}
                />
              </label>
              <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45 }}>
                Reports are reviewed by developer/admin accounts.
              </div>
              {error && (
                <div style={{ border: `1px solid ${RED}`, borderRadius: R.md, background: RED_BG, color: RED, padding: SP.sm, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: SP.sm, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                  style={{
                    minHeight: 34,
                    padding: '7px 12px',
                    border: `1px solid ${BORDER}`,
                    borderRadius: R.md,
                    background: CARD,
                    color: SECOND,
                    fontFamily: sans,
                    fontSize: FS.sm,
                    fontWeight: 850,
                    cursor: busy ? 'not-allowed' : 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  style={{
                    minHeight: 34,
                    padding: '7px 12px',
                    border: `1px solid ${GOLD}`,
                    borderRadius: R.md,
                    background: GOLD,
                    color: swatch.white,
                    fontFamily: sans,
                    fontSize: FS.sm,
                    fontWeight: 900,
                    cursor: busy ? 'wait' : 'pointer',
                    opacity: busy ? 0.7 : 1,
                  }}
                >
                  {busy ? 'Sending...' : 'Send report'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

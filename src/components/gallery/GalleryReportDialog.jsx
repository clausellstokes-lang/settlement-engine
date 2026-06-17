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
  R,
  RED,
  RED_BG,
  SP,
  sans,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
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
      <Button
        variant="secondary"
        size="sm"
        onClick={requestOpen}
        disabled={disabled}
        title="Report settlement"
        icon={<Flag size={13} />}
      >
        Report
      </Button>
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
              <IconButton
                Icon={X}
                label="Close"
                tone="ghost"
                size="lg"
                onClick={() => setOpen(false)}
                disabled={busy}
                style={{ marginLeft: 'auto' }}
              />
            </header>
            <div style={{ display: 'grid', gap: SP.md, padding: SP.lg }}>
              <label htmlFor="gallery-report-reason" style={{ display: 'grid', gap: 6, color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
                Reason
                <select
                  id="gallery-report-reason"
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
              <label htmlFor="gallery-report-notes" style={{ display: 'grid', gap: 6, color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
                Notes
                <textarea
                  id="gallery-report-notes"
                  aria-label="Notes"
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
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  busy={busy}
                >
                  {busy ? 'Sending...' : 'Send report'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

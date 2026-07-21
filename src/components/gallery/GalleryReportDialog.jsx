import { useCallback, useState } from 'react';
import { Flag, X } from 'lucide-react';

import {
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  FS,
  INK,
  RED,
  SP,
  sans,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import { t } from '../../copy/index.js';
import { REPORT_REASON_OPTIONS } from './galleryUtils.js';

export default function GalleryReportDialog({ dossier, auth, disabled, onReport }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('unsafe_content');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Inherit the primitives' modal focus trap (focus-in, Tab cycling, Escape,
  // focus restore) instead of hand-rolling it. Escape is ignored while a report
  // is mid-flight so the user can't dismiss an in-progress submit.
  const onCancel = useCallback(() => { if (!busy) setOpen(false); }, [busy]);
  const dialogRef = useDialogFocusTrap(open, onCancel);

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
        setError(t('errors.reportSendFail'));
      }
    } catch (err) {
      setError(err?.message || t('errors.reportSendFail'));
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
          className="oc-m-warmdim"
          onMouseDown={event => {
            if (event.target === event.currentTarget) onCancel();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: SP.lg,
          }}
        >
          <form
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Report settlement"
            onSubmit={submit}
            style={{
              width: 'min(100%, 480px)',
              // The clerk's form as a plate on the warm-dim ground — hairline
              // frame, no rounded corner, no elevation shadow (depth is the dim
              // room, not a z-axis lift).
              border: `1px solid ${BORDER}`,
              background: CARD,
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
              <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, fontWeight: 950 }}>
                Report settlement
              </h2>
              <IconButton
                Icon={X}
                glyph="×"
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
                    minHeight: 44,
                    border: `1px solid ${BORDER}`,
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
                // The tinted error box becomes a rubric-ruled note (errors as
                // rubric notes, not washes): oxblood left rule, oxblood text.
                // role=alert (SB5): the failure appears after the user acts, so
                // it must interrupt assistive tech (WCAG 4.1.3, the Alert
                // primitive's tone→liveness contract).
                <div role="alert" style={{ borderLeft: '2px solid var(--oc-rubric)', paddingLeft: SP.md, color: RED, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, lineHeight: 1.5 }}>
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

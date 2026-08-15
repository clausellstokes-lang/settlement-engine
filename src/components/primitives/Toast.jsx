import {
  BLUE, BLUE_BG, BORDER, FS, GREEN, GREEN_BG, RED, RED_BG, R, SP,
  sans,
} from '../theme.js';

const TONES = {
  success: { bg: GREEN_BG, fg: GREEN, border: GREEN },
  error: { bg: RED_BG, fg: RED, border: RED },
  info: { bg: BLUE_BG, fg: BLUE, border: BORDER },
};

export default function Toast({ toast, position = 'bottom' }) {
  const tone = TONES[toast?.kind] || TONES.info;
  const vertical = position === 'top' ? { top: 20 } : { bottom: 20 };
  // Error toasts must interrupt the screen reader (a failed save/load/placement
  // is consequential and a polite queue can be missed entirely). Mirror the
  // Alert primitive's tone→liveness mapping: error → assertive alert, else
  // polite status. (role="alert" implies aria-live="assertive"; both are set
  // explicitly so the intent survives a future role change.)
  const isError = toast?.kind === 'error';

  return (
    <>
      {/* Persistent polite announcer (SB5): role=alert announces reliably on
          insertion, but a role=status region inserted TOGETHER with its text is
          announced inconsistently across screen readers — they expect an empty
          region to pre-exist and then change. So the polite region stays mounted
          (sr-only, empty when idle) and a non-error toast lands as a TEXT CHANGE
          inside it; the visible non-error box below is aria-hidden so the same
          words are not read twice. */}
      <div className="sr-only" role="status" aria-live="polite">
        {toast && !isError ? toast.text : ''}
      </div>
      {toast ? (
        <div
          role={isError ? 'alert' : undefined}
          aria-live={isError ? 'assertive' : undefined}
          aria-hidden={isError ? undefined : true}
          // The note slips onto the desk edge (organic motion #6 slip-in). Centering
          // moves off transform (left/right:0 + margin auto) so the slip animation's
          // transform is free; the visual position is unchanged, reduced-motion-safe.
          className="oc-m-slipin"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            marginInline: 'auto',
            width: 'fit-content',
            ...vertical,
            zIndex: 260,
            maxWidth: 'min(92vw, 520px)',
            padding: `${SP.sm}px ${SP.lg}px`,
            border: `1px solid ${tone.border}`,
            borderRadius: R.lg,
            background: tone.bg,
            color: tone.fg,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 900,
            // A slip is flat paper — no z-axis (organic craft §6). Kept as a
            // value-swap so the tolerance-0 kill-list stays exact; a would-be
            // burn-down deletion on the shadow ratchet.
            boxShadow: 'none',
          }}
        >
          {toast.text}
        </div>
      ) : null}
    </>
  );
}

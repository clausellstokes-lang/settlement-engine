import {
  BLUE, BLUE_BG, BORDER, ELEV, FS, GREEN, GREEN_BG, RED, RED_BG, R, SP,
  sans,
} from '../theme.js';

const TONES = {
  success: { bg: GREEN_BG, fg: GREEN, border: GREEN },
  error: { bg: RED_BG, fg: RED, border: RED },
  info: { bg: BLUE_BG, fg: BLUE, border: BORDER },
};

export default function Toast({ toast, position = 'bottom' }) {
  if (!toast) return null;
  const tone = TONES[toast.kind] || TONES.info;
  const vertical = position === 'top' ? { top: 20 } : { bottom: 20 };
  // Error toasts must interrupt the screen reader (a failed save/load/placement
  // is consequential and a polite queue can be missed entirely). Mirror the
  // Alert primitive's tone→liveness mapping: error → assertive alert, else
  // polite status. (role="alert" implies aria-live="assertive"; both are set
  // explicitly so the intent survives a future role change.)
  const isError = toast.kind === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
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
        boxShadow: ELEV[2],
      }}
    >
      {toast.text}
    </div>
  );
}

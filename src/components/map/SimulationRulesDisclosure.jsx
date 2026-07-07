/**
 * SimulationRulesDisclosure — the Detail / Engine altitude disclosure header.
 * A real button with aria-expanded controlling a region, so the groups
 * collapse without trapping focus. The caret + the open/closed word carry the
 * state in two channels (P7), never on a rotation alone. `summary` is quiet
 * scent describing what is inside while closed.
 *
 * Extracted from SimulationRulesDialog to keep that surface under its
 * max-lines ceiling — the same move that extracted GateToggle.
 */
import { BODY, BORDER2, CARD, FS, GOLD, INK, MUTED, R, SP, sans } from '../theme.js';

export default function DisclosureHeader({ open, onToggle, regionId, title, summary }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={regionId}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SP.sm,
        width: '100%',
        padding: `${SP.sm}px ${SP.md}px`,
        border: `1px solid ${BORDER2}`,
        borderRadius: R.md,
        background: CARD,
        color: INK,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span aria-hidden style={{ color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
        {open ? '▾' : '▸'}
      </span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
          {title}
        </span>
        {summary && (
          <span style={{ display: 'block', marginTop: 2, color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750, lineHeight: 1.4 }}>
            {summary}
          </span>
        )}
      </span>
      <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {open ? 'Hide' : 'Show'}
      </span>
    </button>
  );
}

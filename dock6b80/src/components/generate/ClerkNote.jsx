/**
 * generate/ClerkNote.jsx — the rubric-headed margin clerk's note
 * (Deep Craft cluster 1; annex FORGE: "the green/violet callouts become
 * rubric-headed margin clerk's notes").
 *
 * The tinted callout box was the SaaS tell: a colored wash + border radius
 * announcing tone by background. The clerk's note is the manuscript's way: the
 * apparatus speaks in ONE reserved rubric voice (small caps, the oxblood
 * --oc-rubric token via CSS var — no raw color literals here), a single drawn
 * rubric rule at the left, body text in the reading serif, NO wash, NO radius,
 * NO shadow. Tone lives in the rubric's words, not in a background color.
 *
 * Behavior-neutral by construction: children (including Buttons and links)
 * render unchanged; `role` passes through so alert semantics survive.
 */
import { INK, SECOND, sans, serif_, SP, FS } from '../theme.js';

/**
 * @param {object} props
 * @param {string} props.rubric      the note's small-cap head (the apparatus voice)
 * @param {import('react').ReactNode} props.children  body content (unchanged semantics)
 * @param {string} [props.role]      ARIA role passthrough (e.g. 'alert')
 * @param {import('react').ReactNode} [props.actions] optional instrument row (Buttons)
 * @param {object} [props.style]     container style overrides (layout only)
 */
export function ClerkNote({ rubric, children, role, actions, style }) {
  return (
    <div
      role={role}
      style={{
        borderLeft: '2px solid var(--oc-rubric)',
        padding: `${SP.xs}px ${SP.md}px ${SP.xs}px ${SP.md}px`,
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SP.md,
        textAlign: 'left',
        ...style,
      }}
    >
      <div style={{ flex: '1 1 260px' }}>
        <div style={{
          fontFamily: sans, fontSize: FS.xs, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--oc-rubric)', marginBottom: 2,
        }}>
          {rubric}
        </div>
        <div style={{
          fontFamily: serif_, fontSize: FS.sm, color: SECOND, lineHeight: 1.55,
        }}>
          {children}
        </div>
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: SP.sm, flexShrink: 0, alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  );
}

/** Strong inline emphasis inside a note body (ink, not a wash). */
export function ClerkNoteStrong({ children }) {
  return <strong style={{ color: INK, fontWeight: 700 }}>{children}</strong>;
}

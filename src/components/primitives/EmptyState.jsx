/**
 * EmptyState — the shared "designed empty room" primitive.
 *
 * The house answer to a barren panel: an invitation, not an apology. One quiet
 * plate in the clerk's-note idiom — FLAT parchment, a hairline rule, square
 * corners, no elevation, no tinted wash (the kill-list flat-plate doctrine, so
 * the primitive stays off every SaaS-structure ceiling) — carrying a heading,
 * an optional body line in the calm-archivist register, and one optional call
 * to action. An optional leading glyph is supported for the few surfaces that
 * live inside the map's icon context.
 *
 * This is the INFORMATIONAL empty (empty gallery, no news yet, a tier with no
 * services). Its sibling CampaignEmptyState is the ACTIONABLE gold activation
 * callout for the no-campaign seam; the two stay distinct on purpose so the DM
 * reads "here is a room to fill" versus "one click brings this to life".
 *
 * a11y: the plate is a role="note" region named by its heading, so a screen
 * reader announces the empty state as one labelled unit. Copy never rides a
 * native `title=` (title census) and the prop is `heading`, never `title`, so
 * the primitive cannot re-introduce the tooltip-census offender either.
 */
import Button from './Button.jsx';
import { INK, BODY, BORDER, CARD, FS, SP, sans } from '../theme.js';

/**
 * @param {object}   props
 * @param {string}    props.heading  the short invitation headline (also the accessible name)
 * @param {React.ReactNode} [props.body]  one calm line of what will appear and how
 * @param {{ label: string, onClick: () => void, Icon?: React.ComponentType, variant?: string }} [props.action]  optional single CTA
 * @param {'center'|'start'} [props.align='start']  text/box alignment
 *
 * NO LEADING-GLYPH CHANNEL (lane LU-2). This primitive used to take an `Icon`
 * and render it UNGATED — the doc said "map-context surfaces only", but nothing
 * enforced that, and all four call sites in the app were gallery surfaces, i.e.
 * outside the map Provider, rendering lucide straight through the icons-off
 * redesign. `accent` existed solely to colour that glyph gold. Both are gone
 * with the call sites; an empty state's channels are its heading, its body and
 * its one CTA. Re-adding a glyph here would need a lucide import at the call
 * site, which tests/lint/lucideTotality.test.js reds as a new offender.
 */
export default function EmptyState({ heading, body, action, align = 'start' }) {
  const items = align === 'center' ? 'center' : 'flex-start';
  return (
    <div
      role="note"
      aria-label={heading}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: items, gap: SP.sm,
        padding: `${SP.lg}px ${SP.md}px`, textAlign: align,
        background: CARD, border: `1px solid ${BORDER}`,
      }}
    >
      {heading && (
        <div style={{ color: INK, fontFamily: sans, fontSize: FS.md, fontWeight: 800, lineHeight: 1.4 }}>
          {heading}
        </div>
      )}
      {body && (
        <div style={{ color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5, maxWidth: 460 }}>
          {body}
        </div>
      )}
      {action && typeof action.onClick === 'function' && (
        <Button
          variant={action.variant || 'primary'}
          size="sm"
          icon={action.Icon ? <action.Icon size={13} /> : undefined}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

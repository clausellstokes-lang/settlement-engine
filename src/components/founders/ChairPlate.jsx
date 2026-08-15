/**
 * founders/ChairPlate.jsx — A CHAIR IS AN OBJECT, NOT A LIST ROW (§2b).
 *
 * One illuminated plate: the numeral engraved gold-on-dark, the founder's chosen
 * display (or the numeral standing alone, set just as formally), the seating date
 * in the covenant's tense, and — when the founder is also staff — the role ring.
 *
 * THE PLATE IS A BUTTON. Clicking it opens the bio drawer, so it must be a real
 * button element: keyboard-reachable, Enter/Space activated, focus-ringed. A div
 * with an onClick would have been fewer lines and would have locked every
 * keyboard user out of half the Hall. (The tag is named in prose, never spelled
 * out longhand — the raw-button ratchet's detector is a SOURCE match and cannot
 * tell a docstring from a control. See tests/lint/rawButtonBaseline.test.js.)
 *
 * CONSENT (§6): the name renders only because the server projection released it.
 * A chair with no opted-in name is NOT a lesser chair and must never be styled as
 * an absence — it carries the same frame, the same gold, the same weight, and
 * reads "Seat XVII is held", which is already grand.
 *
 * THE RING NEVER CARRIES THE FACT ALONE (WCAG 1.4.1): the role is also written
 * beneath the name and spoken in the plate's accessible name.
 */
import Button from '../primitives/Button.jsx';
import { HALL, RING_TONE, RING_LABEL, numeralStyle, plateNameStyle, quietLineStyle, plateDelay } from './hallRegister.js';
import { chairNumeral, seatedLabel } from '../../lib/foundersHall.js';
import { SP, FS, sans } from '../theme.js';

/**
 * @param {Object} props
 * @param {import('../../lib/foundersHall.js').HallChair} props.chair
 * @param {number} props.index               position in the rendered roll (reveal stagger only)
 * @param {(chair: object) => void} props.onOpen
 */
export default function ChairPlate({ chair, index, onOpen }) {
  const numeral = chairNumeral(chair.chair);
  const seated = seatedLabel(chair.seatedAt);
  const ring = chair.ringRole || null;
  const ringTone = ring ? RING_TONE[ring] : null;
  const ringLabel = ring ? RING_LABEL[ring] : null;
  const named = Boolean(chair.displayName);

  // The accessible name says everything the plate says visually, in the order a
  // listener needs it: which chair, who holds it, what they are, when they sat.
  const spoken = [
    `Seat ${numeral}`,
    named ? chair.displayName : 'held',
    ringLabel,
    seated,
  ].filter(Boolean).join(' · ');

  return (
    // THE RING IS A BAND OF INK, NOT A SHADOW. The deep-craft idiom expresses
    // rank through coverage and rules, never through elevation — so a staff
    // founder's ring is a real 3px band of the role hue that the plate sits
    // inside, and the ceremonial gold hairline stays untouched on top of it. A
    // box-shadow ring would have been one line shorter and would have put the
    // one glowing SaaS artifact in the product on its most formal surface.
    <li style={{ listStyle: 'none', ...(ringTone ? { padding: 3, background: ringTone } : null) }}>
      {/* The Button PRIMITIVE, never a bare element: the plate inherits the
          house's focus ring, press motion, disabled semantics, and tap-target
          floor for free, and the ceremony is applied as style on top. A bespoke
          raw button here would have been the one control in the product that
          quietly opts out of all of that. */}
      <Button
        variant="ghost"
        size="lg"
        className="sf-hall-plate"
        onClick={() => onOpen && onOpen(chair)}
        aria-label={`${spoken}. Open this founder's plate.`}
        style={{
          animationDelay: plateDelay(index),
          width: '100%',
          textAlign: 'left',
          whiteSpace: 'normal',
          background: HALL.panel,
          // The wax-seal frame: a gold hairline, square-cut. When the founder is
          // also staff the ring rides OUTSIDE the gold as a second band, so the
          // ceremonial gold is never replaced by a staff hue (§2).
          border: `1px solid ${HALL.gold}`,
          borderRadius: 0,
          padding: SP.md,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: SP.xs,
          minHeight: 118,
          fontWeight: 400,
        }}
      >
        <span style={numeralStyle}>Seat {numeral}</span>
        <span style={{ ...plateNameStyle, fontStyle: named ? 'normal' : 'italic' }}>
          {named ? chair.displayName : 'This chair is held'}
        </span>
        {ringLabel && (
          <span style={{
            fontFamily: sans, fontSize: FS.xxs, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: ringTone,
          }}>
            {ringLabel}
          </span>
        )}
        {seated && <span style={quietLineStyle}>{seated}</span>}
      </Button>
    </li>
  );
}

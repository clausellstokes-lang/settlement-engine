/**
 * founders/hallRegister.js — THE HALL'S CEREMONIAL REGISTER (DESIGN_FOUNDERS_HALL §2b).
 *
 * "Grandeur through restraint. Candlelight, not neon." The Hall is the only
 * surface in the product that renders on a DARK field, so its tones are
 * collected here once rather than re-derived in four components.
 *
 * EVERY VALUE IS TOKEN-DERIVED. The dark ground, panel, and ink steps are the
 * house's own FIELD register (src/design/organic/ink.js) — the artwork register
 * at its most formal, already contrast-pinned in tests/design/contrast.test.js —
 * and the ceremonial gold is the gold scale. No raw hex is authored in this file
 * or in any Hall component; the no-raw-color law holds here exactly as it holds
 * on the pricing page.
 *
 * CONTRAST, measured against the field ground/panel:
 *   gold-500 on the ground  ≈ 7.1:1   (plate numerals, headings)
 *   FIELD_INK.ink on panel  ≈ 11.7:1  (names)
 *   FIELD_INK.body on panel ≈ 9.3:1   (covenant prose)
 *   ring blue / mauve       ≈ 4.6:1   (>3:1, WCAG 1.4.11 UI boundary)
 *
 * ZERO EAGER: every importer of this module is inside the lazy Hall chunk.
 */
import { FIELD_INK } from '../../design/organic/ink.js';
import { color, founderRingDeveloper, founderRingAdmin } from '../../design/tokens.js';
import { FS, SP, sans, serif_ } from '../theme.js';

/** The Hall's grounds and inks. */
export const HALL = Object.freeze({
  ground: FIELD_INK.ground,
  panel: FIELD_INK.panel,
  ink: FIELD_INK.ink,
  body: FIELD_INK.body,
  secondary: FIELD_INK.secondary,
  faint: FIELD_INK.faint,
  rule: FIELD_INK.hairline,
  gold: color['gold-500'],
  goldSoft: color['gold-400'],
});

/**
 * The role rings, by role. Named tokens only — this map is the ONLY place a Hall
 * component learns what a ring looks like, and the plate names the role in text
 * beside it so the hue never carries the fact alone.
 */
export const RING_TONE = Object.freeze({
  developer: founderRingDeveloper,
  admin: founderRingAdmin,
});

/** How a ring is spoken, for the plate's label and its accessible name. */
export const RING_LABEL = Object.freeze({
  developer: 'Developer',
  admin: 'Admin',
});

/** The engraved chair numeral: small caps, wide tracking, gold on dark. */
export const numeralStyle = Object.freeze({
  fontFamily: sans,
  fontSize: FS.xxs,
  fontWeight: 800,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: HALL.gold,
});

/** A name on a plate — the serif display register at full formality. */
export const plateNameStyle = Object.freeze({
  fontFamily: serif_,
  fontSize: FS.lg,
  fontWeight: 600,
  color: HALL.ink,
  lineHeight: 1.25,
  margin: 0,
});

/** The covenant's reading tone. */
export const covenantProseStyle = Object.freeze({
  fontFamily: serif_,
  fontSize: FS.md,
  color: HALL.body,
  lineHeight: 1.7,
  margin: 0,
});

/** A quiet supporting line (seating date, counters, notes). */
export const quietLineStyle = Object.freeze({
  fontFamily: sans,
  fontSize: FS.xs,
  color: HALL.secondary,
  margin: 0,
});

/**
 * THE ENTRY (§2b: "the Hall is ENTERED, not loaded"). One restrained reveal —
 * the plates rise into place as the page settles — and nothing else moves ever
 * again.
 *
 * REDUCED MOTION IS A DIFFERENT GRANDEUR, NEVER A LESSER ONE. Two guards, both
 * needed: the global a11y.css rule collapses animation-duration to 1ms under
 * `prefers-reduced-motion: reduce`, which would leave a plate frozen at its
 * pre-animation opacity if the keyframe were the only thing setting it — so the
 * media query below restores the FINAL composition outright. The static Hall is
 * the same Hall, already settled.
 */
export const HALL_CEREMONY_CSS = `
.sf-hall-plate { animation: sf-hall-rise 620ms cubic-bezier(.22,.61,.36,1) both; }
@keyframes sf-hall-rise {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sf-hall-plate { animation: none; opacity: 1; transform: none; }
}
.sf-hall-plate:focus-visible { outline: 2px solid ${HALL.goldSoft}; outline-offset: 3px; }
`;

/** The per-plate reveal delay, capped so the thirtieth chair never straggles. */
export function plateDelay(index) {
  return `${Math.min(index, 12) * 45}ms`;
}

/** Shared spacing echoes so the four Hall files rhyme without importing each other. */
export const HALL_SP = SP;

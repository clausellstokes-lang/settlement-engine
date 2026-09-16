/**
 * design/organic/ornament/palette.js — the FIXED ornament palette (law §5).
 *
 * Seeded ornament reads as CRAFT only as a constrained composition of authored
 * components over a FIXED palette (CK3 heraldry, Pentiment alternates) — freeform
 * colour is what makes generated ornament read as glitch. So ornament draws from a
 * tiny closed set of ink tones (the same ramp the text uses, plus the two rubric
 * accents), never an open colour space. The light set is the default; the field
 * set keeps ornament legible on the warm dark ground.
 *
 * Ornament is decorative: it never carries a contrast obligation as text, but it is
 * built from the AA-verified ink/rubric tones anyway so it always reads as the same
 * hand as the type. Token-def file (src/design/, lint-exempt); pure; lazy.
 */

import { INK, FIELD_INK } from '../ink.js';
import { RUBRIC, FIELD_RUBRIC } from '../rubrication.js';

/** The light (parchment) ornament palette. */
export const ORNAMENT_INK = Object.freeze({
  line:    INK.body,        // primary ornament stroke
  strong:  INK.deepest,     // heaviest accents
  faint:   INK.hairline,    // the receding hairline detail
  rubric:  RUBRIC.rubric,   // the one oxblood accent (rationed: a single mark)
  entry:   RUBRIC.entry,    // the gold entry mark
});

/** The field (dim) ornament palette. */
export const FIELD_ORNAMENT_INK = Object.freeze({
  line:    FIELD_INK.body,
  strong:  FIELD_INK.ink,
  faint:   FIELD_INK.hairline,
  rubric:  FIELD_RUBRIC.rubric,
  entry:   FIELD_RUBRIC.entry,
});

/** Resolve the palette for a mode ('light' | 'field'). */
export function ornamentPalette(mode = 'light') {
  return mode === 'field' ? FIELD_ORNAMENT_INK : ORNAMENT_INK;
}

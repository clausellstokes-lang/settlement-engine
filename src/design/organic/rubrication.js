/**
 * design/organic/rubrication.js — THE RUBRIC (Organic Craft law §3).
 *
 * In a manuscript, red was not decoration — it was the APPARATUS SPEAKING. The
 * rubricator's second pass, working from the scribe's margin notes, marked the
 * boundary between one section and the next, flagged instructions to be PERFORMED
 * (red) versus content to be READ (black), and lit the entry points of a volume.
 * Content never wore red; decoration never wore red. That read/perform contract
 * is the whole value, and it dies the instant the accent inflates.
 *
 * THE UI MAPPING — one reserved voice, two tones:
 *   • `rubric`  (oxblood) — "the interface is speaking": section transitions,
 *     do-this instructions, the current/selected entry, live-status labels.
 *   • `entry`   (gold)    — the illuminated entry point / litterae notabiliores:
 *     the one lead-in mark that says "begin here". Rationed to at most one per view.
 *
 * DELIBERATELY NOT the destructive `red-600` (#A23434): that hue already owns a
 * semantic (errors / destroy). Rubric is a distinct, deeper oxblood so the two
 * channels never collapse — the apparatus voice must not read as an error.
 *
 * Applied ONLY from these tokens (the rubricator worked from the scribe's spec,
 * never ad hoc). Both tones clear WCAG AA as text on every parchment ground; the
 * field-mode tones clear AA on the warm dark ground. Verified in
 * tests/design/contrast.test.js. Token-definition file (lint-exempt); lazy.
 */

// ── LIGHT ground ─────────────────────────────────────────────────────────────
export const RUBRIC = Object.freeze({
  rubric: '#8B2E2E',  // oxblood — the apparatus voice (AA text; 6.93:1 on parch-100)
  entry:  '#6A511F',  // gold entry-point mark (= gold-800; AA text; 6.24:1 on parch-100)
});

// ── FIELD ground (dim) ───────────────────────────────────────────────────────
export const FIELD_RUBRIC = Object.freeze({
  rubric: '#E8A860',  // warm amber apparatus voice on the dark ground (7.44:1 on panel)
  entry:  '#D9B566',  // warm gold entry mark on the dark ground (7.84:1 on panel)
});

/** The rubric roles, named — the semantic contract callers key off (never a raw tone). */
export const RUBRIC_ROLES = Object.freeze({
  sectionLabel: 'rubric',   // a section transition / running head
  instruction:  'rubric',   // a do-this / perform instruction
  current:      'rubric',   // the selected / live entry
  entryPoint:   'entry',    // the one illuminated lead-in per view
});

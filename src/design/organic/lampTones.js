/**
 * design/organic/lampTones.js — THE LANTERN TABLE ACCENTS (Deep Craft C14).
 *
 * TableView is the at-the-table session surface — "the desk by night" (reference
 * library plate 04, dim-lantern: umber/cream/oxblood, pool-of-light focus). The
 * four cheat-sheet KINDS (NPC / HOOK / TWIST / RED) are accented not with the
 * light-theme saturated hues (green/amber/violet/red — several of which fail AA
 * as a label even on white) but with LAMP TONES: warm, luminous successors that
 * glow legibly on the umber ground the way a lantern picks colour out of a dark
 * desk. This pays the recorded deferral (the accents were flagged for a field
 * re-tone when the lantern surface landed).
 *
 * HUE-PRESERVING SUCCESSION (each tone is the old accent's lamp-lit form):
 *   NPC   moss  ← green   (the people you'll voice)
 *   HOOK  gold  ← amber   (the lure you'll drop)
 *   TWIST slate ← violet  (the turn you're holding — the AI/twist hue, cooled)
 *   RED   ember ← red     (the one thing NOT to mention)
 *
 * CONTRAST LAW (§6): every tone is used BOTH as a label (owes WCAG AA 4.5:1 as
 * text) and as the card's left rule (owes 1.4.11's 3:1 UI-boundary floor). The
 * ground it sits on is the field lifted-panel tone (FIELD_INK.panel #2C2416 —
 * the umber). All four clear 4.5:1 on that ground with headroom reserved for a
 * grain overlay, pinned per-state in tests/design/contrast.test.js.
 *
 * Token-definition file — raw hexes live here legitimately (src/design/ visual-
 * budget exemption). Nothing eager imports this; TableView (its only consumer)
 * is lazy, so the whole tone set stays out of the first-paint closure.
 */
export const LAMP_ACCENTS = Object.freeze({
  NPC:   '#93B061', // moss  — 6.29:1 on the umber panel
  HOOK:  '#DCA746', // gold  — 7.05:1
  TWIST: '#9AA6C2', // slate — 6.28:1 (supersedes the violet TWIST accent)
  RED:   '#E0794E', // ember — 5.12:1
});

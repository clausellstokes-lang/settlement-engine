/**
 * design/organic/instruments.js — THE INSTRUMENT PALETTE (Organic Craft law §2/§6).
 *
 * The artifact/instrument split needs its OWN fills: instruments (buttons, controls,
 * pickers) are machined and quiet, but they still owe every state a legible contrast
 * (label/fill, boundary/ground). These are the reserved instrument fills — a small,
 * closed set so a button is never a one-off literal: the quiet fill, its ink, the
 * perceivable boundary, and the one primary (gold) fill with ink on it. Light + a
 * field variant (the dim ground needs its own fills). Every pairing here is a proven
 * ≥AA / ≥1.4.11 combination from the shipped palette; verified at every state in
 * tests/design/contrast.test.js. Token-def file; lazy.
 */

export const INSTRUMENT = Object.freeze({
  fill:       '#F4EAD0',  // quiet instrument surface (= parchment-100)
  ink:        '#2C2210',  // ink ON the quiet fill (= ink-800; 13:1)
  border:     '#A6863C',  // instrument boundary, perceivable on card + page (= BORDER_STRONG; ≥3:1)
  primary:    '#C9A24C',  // the ONE primary/CTA fill (= gold-500)
  primaryInk: '#1B1408',  // ink ON the primary fill (= ink-900; ink-on-gold ≈7.6:1)
});

export const FIELD_INSTRUMENT = Object.freeze({
  fill:       '#2C2416',  // the lifted field panel (= FIELD_INK.panel)
  ink:        '#ECE0C6',  // field ink on the panel (11.7:1)
  border:     '#907E56',  // a perceivable warm boundary on the dark ground (≥3:1 on ground + panel)
  primary:    '#D9B566',  // the warm gold primary on the dark ground (= FIELD_RUBRIC.entry)
  primaryInk: '#1B1408',  // ink on the warm gold
});

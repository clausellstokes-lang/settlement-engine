/**
 * design/organic/index.js — THE ORGANIC CRAFT token barrel + CSS-var emitter.
 *
 * One import surface for the organic layer, and one function that projects the JS
 * tokens onto CSS custom properties so src/styles/organic.css (container queries,
 * dropcaps, field mode, marginalia) reads them as var(--oc-*). JS is the single
 * source; CSS consumes the vars — the same split the app's emitCssTokens() uses.
 *
 * emitOrganicTokens is NEVER called eagerly: the sample generator inlines the vars
 * into a :root block, and any phase-3 wiring calls it from a lazy surface. Nothing
 * here joins the first-paint closure.
 */

import { INK, FIELD_INK } from './ink.js';
import { RUBRIC, FIELD_RUBRIC } from './rubrication.js';
import { INSTRUMENT, FIELD_INSTRUMENT } from './instruments.js';
import { TYPE, SPACE } from './fluidScale.js';
import { MOTION_DURATION, MOTION_EASE } from './motion.js';

export * from './ink.js';
export * from './rubrication.js';
export * from './instruments.js';
export * from './fluidScale.js';
export * from './posture.js';
export * from './rules.js';
export * from './material.js';
export * from './motion.js';

/**
 * The organic tokens as a flat { cssVarName: value } map — the single projection
 * both emitOrganicTokens (live) and the sample generator (inlined) consume, so the
 * live app and the committed fixtures render from byte-identical values.
 * @returns {Record<string,string>}
 */
export function organicCssVars() {
  /** @type {Record<string,string>} */
  const vars = {};
  for (const [k, v] of Object.entries(INK)) vars[`--oc-ink-${k}`] = v;
  for (const [k, v] of Object.entries(FIELD_INK)) vars[`--oc-field-${k}`] = v;
  vars['--oc-rubric'] = RUBRIC.rubric;
  vars['--oc-entry'] = RUBRIC.entry;
  vars['--oc-field-rubric'] = FIELD_RUBRIC.rubric;
  vars['--oc-field-entry'] = FIELD_RUBRIC.entry;
  for (const [k, v] of Object.entries(INSTRUMENT)) vars[`--oc-btn-${k.toLowerCase()}`] = v;
  for (const [k, v] of Object.entries(FIELD_INSTRUMENT)) vars[`--oc-field-btn-${k.toLowerCase()}`] = v;
  for (const [k, s] of Object.entries(TYPE)) vars[`--oc-type-${k}`] = s.clamp;
  for (const [k, s] of Object.entries(SPACE)) vars[`--oc-space-${k}`] = s.clamp;
  for (const [k, v] of Object.entries(MOTION_DURATION)) vars[`--oc-motion-${k}`] = v;
  for (const [k, v] of Object.entries(MOTION_EASE)) vars[`--oc-ease-${k}`] = v;
  return vars;
}

/**
 * Emit the organic CSS custom properties onto a target (default :root). No-op in
 * a non-DOM env. Idempotent. Lazy-only — never call at app boot.
 * @param {HTMLElement} [target]
 */
export function emitOrganicTokens(target = typeof document !== 'undefined' ? document.documentElement : null) {
  if (!target || typeof target.style?.setProperty !== 'function') return;
  for (const [name, value] of Object.entries(organicCssVars())) target.style.setProperty(name, String(value));
}

/** Serialize the organic vars as a `:root{…}` CSS block (for inlined fixtures). */
export function organicCssRootBlock() {
  const body = Object.entries(organicCssVars()).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `:root {\n${body}\n}`;
}

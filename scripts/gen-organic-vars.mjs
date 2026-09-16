#!/usr/bin/env node
/**
 * scripts/gen-organic-vars.mjs — regenerate src/styles/organicVars.css from the
 * one JS token source (src/design/organic/index.js#organicCssVars). JS is
 * canonical; the CSS file is a projection so the eager stylesheet carries the
 * vars with ZERO eager JS. Drift-guarded by tests/design/organicVars.test.js.
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { organicCssRootBlock } from '../src/design/organic/index.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const VARS_FILE = resolve(ROOT, 'src', 'styles', 'organicVars.css');

export const HEADER = `/* GENERATED — do not hand-edit. The organic token vars, projected from
   src/design/organic/index.js#organicCssVars (the ONE source; JS is canonical).
   Regenerate: node scripts/gen-organic-vars.mjs
   Drift-guarded by tests/design/organicVars.test.js — a token edit without a
   regen fails CI. Eager CSS (imported by main.jsx) so every .oc-* class resolves
   app-wide; zero eager JS. */
`;

export function varsFileContent() {
  return `${HEADER}${organicCssRootBlock()}\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync(VARS_FILE, varsFileContent());
  console.log(`[gen-organic-vars] wrote ${VARS_FILE}`);
}

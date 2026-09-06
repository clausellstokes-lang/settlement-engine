/**
 * tests/design/organicVars.test.js — THE MATERIALS BRIDGE freshness + identity
 * contracts (the pre-reconciliation amendment).
 *
 * 1. FRESHNESS: src/styles/organicVars.css (the eager :root projection every
 *    .oc-* class reads) must byte-match a fresh projection from the JS token
 *    source — a token edit without `node scripts/gen-organic-vars.mjs` fails here.
 * 2. THE 1:1 IDENTITY: the bridge is only mechanical because the organic ink maps
 *    1:1 onto the shipped ink tokens and the app's card border IS the feint-rule
 *    material — pinned so a token drift can't silently reopen a material seam.
 * 3. EAGER WIRING: main.jsx imports both organic stylesheets (CSS only — the
 *    organic JS layer must stay OUT of the eager import graph).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { varsFileContent, VARS_FILE } from '../../scripts/gen-organic-vars.mjs';
import { INK } from '../../src/design/organic/ink.js';
import { legacy, semantic, color } from '../../src/design/tokens.js';

describe('the materials bridge', () => {
  it('organicVars.css is a fresh projection of the JS tokens', () => {
    expect(readFileSync(VARS_FILE, 'utf-8')).toBe(varsFileContent());
  });

  it('the ink ramp maps 1:1 onto the shipped ink tokens (the bridge identity)', () => {
    expect(INK.deepest).toBe(color['ink-900']);
    expect(INK.strong).toBe(color['ink-800']);
    expect(INK.body).toBe(color['ink-600']);
  });

  it('the app-wide card border IS the feint-rule material (the rule-family swap)', () => {
    expect(legacy.BORDER).toBe(INK.hairline);
    expect(semantic.cardBorder).toBe(INK.hairline);
  });

  it('main.jsx imports the organic stylesheets eagerly — and NO organic JS', () => {
    const main = readFileSync(resolve(process.cwd(), 'src', 'main.jsx'), 'utf-8');
    expect(main).toContain("./styles/organic.css");
    expect(main).toContain("./styles/organicVars.css");
    // The organic JS layer stays lazy: no design/organic or components/organic
    // module may enter through main.jsx.
    expect(/from\s+['"]\.\/design\/organic|from\s+['"]\.\/components\/organic/.test(main)).toBe(false);
  });
});

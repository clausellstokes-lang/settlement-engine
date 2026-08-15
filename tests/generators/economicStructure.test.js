/**
 * tests/generators/economicStructure.test.js — F31 monolith-split structure pin.
 *
 * The economic generator was a ~2,650-line de-minified bundle. It is now an
 * entry barrel (src/generators/economicGenerator.js) over cohesive modules in
 * src/generators/economy/. These pins keep that shape from silently regressing:
 *
 *   1. The entry barrel stays a thin re-export (the monolith cannot re-accrete
 *      inside it).
 *   2. Every economy/ module stays under the cohesion ceiling (no single module
 *      grows back into a bundle).
 *   3. The public export surface of economicGenerator.js exactly equals the
 *      checked-in contract — so the re-export barrel can never silently drop or
 *      add a public symbol that importers (steps, domain, sibling generators,
 *      tests) depend on.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as economicGenerator from '../../src/generators/economicGenerator.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const ENTRY = path.join(ROOT, 'src/generators/economicGenerator.js');
const ECON_DIR = path.join(ROOT, 'src/generators/economy');

const ENTRY_LINE_CEILING = 60; // a pure re-export barrel; 15 lines today
// Cohesion ceiling per economy/ module, in RAW lines. Raised 800 → 900 on
// 2026-07-09 (review residue R2): unwinding economicState.js's de-minified
// comma-expression control flow into honest sequential statements grew its raw
// count to 859 purely through braces/comments — its EFFECTIVE size (eslint
// max-lines, skipBlankLines+skipComments — the real cohesion ratchet, still
// hard-erroring at 800 in eslint.config.js) is 764, and the generator golden
// master proves the rewrite byte-identical. 900 raw ≈ the 800-effective
// ratchet plus honest-formatting overhead; logic growth still trips eslint
// first.
const MODULE_LINE_CEILING = 900; // cohesion ceiling per economy/ module (raw lines)

const lineCount = (abs) => fs.readFileSync(abs, 'utf8').split('\n').length;

// The frozen public surface. Every importer in the repo (steps/generateEconomy,
// steps/generateNarratives, npcGenerator, powerGenerator, servicesGenerator,
// resourceGenerator, and tests) reaches these through './economicGenerator.js'.
const PUBLIC_EXPORTS = [
  'POWER_ROLES_BY_CATEGORY',
  'generateEconomicState',
  'generateEconomicViability',
  'getUpgradeOpportunities',
  'isSaltPreserved',
  'priorityToCategory',
  'sortBySeverity',
];

describe('economic generator monolith split — structure pin', () => {
  it('the entry module stays a thin re-export barrel', () => {
    expect(lineCount(ENTRY)).toBeLessThan(ENTRY_LINE_CEILING);
  });

  it('every economy/ module stays under the cohesion ceiling', () => {
    const modules = fs.readdirSync(ECON_DIR).filter((f) => f.endsWith('.js'));
    expect(modules.length).toBeGreaterThanOrEqual(7);
    const oversized = modules
      .map((f) => [f, lineCount(path.join(ECON_DIR, f))])
      .filter(([, n]) => n >= MODULE_LINE_CEILING);
    expect(oversized).toEqual([]);
  });

  it('the public export surface equals the checked-in contract', () => {
    expect(Object.keys(economicGenerator).sort()).toEqual([...PUBLIC_EXPORTS].sort());
  });

  it('every public export is a defined value (no broken re-export)', () => {
    for (const name of PUBLIC_EXPORTS) {
      expect(economicGenerator[name], `${name} is not re-exported`).toBeDefined();
    }
  });
});

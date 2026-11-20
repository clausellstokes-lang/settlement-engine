/**
 * tests/domain/crisis/crisisPageAudience.test.js — THE CRISIS PAGE'S EXPLICIT AUDIENCE ARGUMENT (FRAME-4 · U0; the chair,
 * 2026-11-20: P1b's and P4a's new lines are drawn FOR THE OWNER ONLY, behind an explicit audience argument, and a reader
 * who is not the owner gets today's crisis page byte for byte; the brief
 * docs/chair/2026-11-20/content/frame4/FRAME4-BRIEFS-U0-P1B-P4A.md, U0).
 *
 *   1. THE CLOSED SET: the page's readers are the session sheet's own (`TONIGHT_AUDIENCES`); only `'owner'` is the owner,
 *      and anything else, a missing argument or a missing `audience`, is a stranger: FAIL CLOSED.
 *   2. EVERY PRODUCTION CALL SAYS WHO READS: a source walker over `src/` finds every call of `composeCrisisPage` and
 *      requires its second argument to carry `audience` (at the base, three calls carried none).
 *   3. THE SEAM CHANGES NO PAGE: on a pool of every crisis kind (B7's forced birth, `b7-<kind>-<tier>-<i>`, one tier
 *      apart) and a natural pool with its calm towns (B7's `b7-natural-<tier>-<i>`), the page composed for every reader
 *      is deep-equal to the page composed with no options; a crisis town's page has its sections (liveness) and a calm
 *      town's has none.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { composeCrisisPage, crisisPageForOwner } from '../../../src/domain/crisis/crisisPage.js';
import { TONIGHT_AUDIENCES } from '../../../src/domain/summary/tonightSheet.js';
import { STRESS_TYPE_MAP } from '../../../src/data/stressTypes.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

/** Every reader a caller could hand the page, the owner's last. */
const STRANGERS = [
  ['no options', []], ['undefined', [undefined]], ['null', [null]], ['{}', [{}]], ['{ audience: undefined }', [{ audience: undefined }]],
  ["{ audience: 'player' }", [{ audience: TONIGHT_AUDIENCES.player }]], ["{ audience: 'gallery' }", [{ audience: TONIGHT_AUDIENCES.gallery }]],
  ["{ audience: 'Owner' }", [{ audience: 'Owner' }]], ["'owner' (not an options object)", ['owner']], ["{ audience: ['owner'] }", [{ audience: ['owner'] }]],
];
const OWNER = ["{ audience: 'owner' }", [{ audience: TONIGHT_AUDIENCES.owner }]];

describe('U0: the crisis page is composed for an explicit reader', () => {
  test('the readers are the session sheet\'s closed set; only the owner is the owner, everything else fails closed', () => {
    expect(crisisPageForOwner({ audience: TONIGHT_AUDIENCES.owner })).toBe(true);
    for (const [label, args] of STRANGERS) expect(crisisPageForOwner(...args), `${label} is not the owner`).toBe(false);
  });

  test('every production call of composeCrisisPage passes an explicit audience', () => {
    /** @type {Array<{ file: string, args: string }>} */
    const calls = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) { walk(p); continue; }
        if (!/\.(?:js|jsx|mjs)$/.test(name)) continue;
        const src = readFileSync(p, 'utf8');
        for (const m of src.matchAll(/\bcomposeCrisisPage\s*\(/g)) {
          if (/function\s+$/.test(src.slice(Math.max(0, m.index - 12), m.index))) continue; // the definition itself
          let depth = 1; let at = m.index + m[0].length;
          for (; at < src.length && depth > 0; at++) { if (src[at] === '(') depth++; else if (src[at] === ')') depth--; }
          calls.push({ file: p.replace(/\\/g, '/'), args: src.slice(m.index + m[0].length, at - 1).replace(/\s+/g, ' ').trim() });
        }
      }
    };
    walk('src');
    expect(calls.length, 'the walker finds the page\'s production callers').toBeGreaterThan(0);
    const bare = calls.filter((c) => !/,\s*\{[^}]*\baudience\b[^}]*\}\s*$/.test(c.args));
    expect(bare, 'calls of composeCrisisPage that do not say who reads the page').toEqual([]);
  });

  test('the seam changes no page: every reader gets today\'s page, on every crisis kind and on the calm pool', () => {
    const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    /** @type {Array<[string, () => any, boolean]>} */
    const towns = [];
    for (const [i, kind] of Object.keys(STRESS_TYPE_MAP).entries()) {
      const gate = STRESS_TYPE_MAP[kind].requiresTier;
      const tiers = TIERS.filter((t) => !gate || TIERS.indexOf(t) >= TIERS.indexOf(gate));
      for (const tier of [tiers[i % tiers.length], tiers[(i + 3) % tiers.length]]) {
        const seed = `b7-${kind}-${tier}-0`;
        towns.push([seed, () => generateSettlementPipeline({ settType: tier, stressType: kind }, null, { seed, customContent: {} }), true]);
      }
    }
    for (const tier of TIERS) for (const i of [0, 1]) {
      const seed = `b7-natural-${tier}-${i}`;
      towns.push([seed, () => generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} }), false]);
    }
    let calm = 0;
    const failures = collectSeedFailures(towns, ([seed, birth, forced]) => {
      const s = birth();
      const today = composeCrisisPage(s);
      const inCrisis = [s.stress].flat().some((e) => !!(e && (e.type || e.label)));
      if (forced) expect(inCrisis, `${seed}: born in its crisis`).toBe(true);
      if (inCrisis) expect(today.length, `${seed}: the page has its sections`).toBeGreaterThan(0);
      else { calm++; expect(today, `${seed}: a calm town has no page`).toEqual([]); }
      for (const [label, args] of [...STRANGERS, OWNER]) expect(composeCrisisPage(s, ...args), `${seed} ${label}: today's page`).toEqual(today);
    });
    expectNoSeedFailures(failures, 'every reader of every town gets today\'s crisis page');
    expect(calm, 'the natural pool holds calm towns').toBeGreaterThan(0);
  }, 300000);
});

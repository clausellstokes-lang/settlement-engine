/**
 * tests/generators/outputSortDeterminism.test.js
 *
 * Determinism-cohesion guard for the three OUTPUT-path sorts that feed the
 * hashed golden master. Each used String.prototype.localeCompare, which is
 * locale-/ICU-dependent: the SAME seed could emit a DIFFERENT order across
 * machines, breaking the determinism gate. They were standardized to the
 * engine's codepoint-stable comparator (a < b ? -1 : a > b ? 1 : 0):
 *
 *   1. servicesGenerator.js   — per-category service list sort (by .name)
 *   2. economicGenerator.js   — income-source tiebreak (by .source)
 *   3. computeActiveChains.js — chain ordering tiebreak (by .needLabel)
 *
 * Two independent layers prove the fix:
 *   A. Source-level reversion guard — the exact sort lines no longer call
 *      localeCompare and DO carry the codepoint comparator. This catches a
 *      revert directly, regardless of whether the built-in label set happens to
 *      contain a locale/codepoint divergence today.
 *   B. Behavioural — running each real generator twice on the same input yields
 *      byte-identical output, AND the emitted order is non-decreasing under raw
 *      codepoint comparison of the sort key (the order the comparator promises).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';
import { generateEconomicState } from '../../src/generators/economicGenerator.js';
import { computeActiveChains } from '../../src/generators/computeActiveChains.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../../src/generators');

const read = (f) => readFileSync(resolve(SRC, f), 'utf8');

// Codepoint comparator — the same one the engine standardized on (e.g.
// inferSupplyChains.byCodepoint, worldPulse/settlementStrategy.codepoint).
const byCodepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** Assert an array of keys is in non-decreasing codepoint order. */
function expectCodepointSorted(keys) {
  const resorted = [...keys].sort(byCodepoint);
  expect(keys).toEqual(resorted);
}

function withSeed(seed, fn) {
  setActiveRng(createPRNG(seed));
  try {
    return fn();
  } finally {
    clearActiveRng();
  }
}

// ── Layer A: source-level reversion guard ─────────────────────────────────────

describe('output-path sorts no longer use localeCompare (source guard)', () => {
  it.each([
    ['servicesGenerator.js', /S\.name\b[\s\S]{0,80}localeCompare/],
    ['economicGenerator.js', /incomeNormalized\.sort\([\s\S]{0,160}localeCompare/],
    ['computeActiveChains.js', /needLabel\b[\s\S]{0,80}localeCompare/],
  ])('%s does not localeCompare its golden-master sort key', (file, pattern) => {
    expect(pattern.test(read(file))).toBe(false);
  });

  it('servicesGenerator sorts service names by raw codepoint', () => {
    const src = read('servicesGenerator.js');
    // The per-category sort body compares the two .name values by codepoint.
    expect(/Sn\s*<\s*yn\s*\?\s*-1\s*:\s*Sn\s*>\s*yn\s*\?\s*1\s*:\s*0/.test(src)).toBe(true);
  });

  it('economicGenerator tiebreaks income sources by raw codepoint', () => {
    const src = read('economicGenerator.js');
    expect(
      /a\.source\s*<\s*b\.source\s*\?\s*-1\s*:\s*a\.source\s*>\s*b\.source\s*\?\s*1\s*:\s*0/.test(src),
    ).toBe(true);
  });

  it('computeActiveChains tiebreaks chains by raw codepoint', () => {
    const src = read('computeActiveChains.js');
    expect(
      /a\.needLabel\s*<\s*b\.needLabel\s*\?\s*-1\s*:\s*a\.needLabel\s*>\s*b\.needLabel\s*\?\s*1\s*:\s*0/.test(
        src,
      ),
    ).toBe(true);
  });
});

// ── Layer B: behavioural determinism on the real generators ───────────────────

const SERVICE_INSTS = [
  { name: 'Marketplace' }, { name: 'Inn' }, { name: 'Tavern' },
  { name: 'Blacksmith' }, { name: 'Temple' }, { name: 'Town hall' },
  { name: 'Bank' }, { name: 'Apothecary' }, { name: 'Stables' },
];

describe('servicesGenerator per-category lists are codepoint-stable', () => {
  const gen = () =>
    withSeed('svc-sort-seed', () =>
      generateAvailableServices('city', SERVICE_INSTS, {}, { _tradeRoute: 'road', magicExists: true, priorityMagic: 50 }),
    );

  it('same input twice → identical service map', () => {
    expect(JSON.stringify(gen())).toBe(JSON.stringify(gen()));
  });

  it('every category list is emitted in codepoint order (test is non-vacuous)', () => {
    const svc = gen();
    const multi = Object.keys(svc).filter((k) => Array.isArray(svc[k]) && svc[k].length > 1);
    expect(multi.length).toBeGreaterThan(0); // at least one multi-entry list exists
    for (const k of multi) expectCodepointSorted(svc[k].map((s) => s.name));
  });
});

describe('economicGenerator income sources are codepoint-stable on ties', () => {
  const gen = () =>
    withSeed('income-sort-seed', () =>
      generateEconomicState(
        'city',
        [{ name: 'Marketplace' }, { name: 'Docks/port facilities' }, { name: 'Bank' }, { name: 'Guildhall' }],
        'port',
        {},
        { tier: 'city', tradeRouteAccess: 'port', nearbyResources: [] },
      ),
    );

  it('same input twice → identical income sources', () => {
    const a = gen().incomeSources;
    const b = gen().incomeSources;
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    expect(a.length).toBeGreaterThan(1);
  });

  it('primary order is percentage desc, ties broken by codepoint source', () => {
    const sources = gen().incomeSources;
    for (let i = 1; i < sources.length; i += 1) {
      const prev = sources[i - 1];
      const cur = sources[i];
      // percentage must be non-increasing
      expect(prev.percentage).toBeGreaterThanOrEqual(cur.percentage);
      // on an exact percentage tie, the source key must be codepoint-ascending
      if (prev.percentage === cur.percentage) {
        expect(byCodepoint(prev.source, cur.source)).toBeLessThanOrEqual(0);
      }
    }
  });
});

describe('computeActiveChains ordering is codepoint-stable on ties', () => {
  const gen = () =>
    withSeed('chain-sort-seed', () =>
      computeActiveChains(
        [
          { name: 'Blacksmith' }, { name: 'Brewery' }, { name: 'Tannery' },
          { name: 'Weavers' }, { name: 'Grain mill' }, { name: 'Smelter' },
          { name: 'Pottery' }, { name: 'Sawmill' },
        ],
        ['grain_fields', 'iron_deposits', 'timber', 'livestock', 'hide_source', 'flax_fields', 'coal_seam', 'clay_pit'],
        'city',
        'road',
        [],
        [],
        50,
      ),
    );

  it('same input twice → identical chain order', () => {
    expect(JSON.stringify(gen())).toBe(JSON.stringify(gen()));
  });

  it('within a (status, activatedByResource) group, needLabel is codepoint-ascending', () => {
    const chains = gen();
    expect(chains.length).toBeGreaterThan(0); // non-vacuous
    for (let i = 1; i < chains.length; i += 1) {
      const a = chains[i - 1];
      const b = chains[i];
      if (a.status === b.status && a.activatedByResource === b.activatedByResource) {
        expect(byCodepoint(a.needLabel, b.needLabel)).toBeLessThanOrEqual(0);
      }
    }
  });
});

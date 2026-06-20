/**
 * customContentDeterminism.test.js
 *
 * Guards the B08 determinism + data-integrity fixes:
 *
 *  1. (findings #2, #3) Custom institutions / resources / services must be sorted
 *     with a CODEPOINT-stable comparator — NOT String.localeCompare — before the
 *     per-item rng.chance() draw that decides which ones appear. localeCompare is
 *     locale-/ICU-build dependent, so the SAME seed could otherwise select a
 *     DIFFERENT set of custom content on a different machine, violating the core
 *     "same seed => same settlement" guarantee. We prove this two ways:
 *       a. SOURCE GUARD: no `.localeCompare` survives in the custom-content gen
 *          loops (the three steps below).
 *       b. BEHAVIOURAL: the selected custom set is identical regardless of the
 *          INPUT array order, for a fixed seed — i.e. the loop normalises order
 *          before consuming rng, so the registry's insertion order can't leak.
 *
 *  2. (findings #1, #6) Every STRESS_TO_TENSION and NEIGHBOR_REL_TENSION value
 *     must resolve to a real HISTORICAL_EVENTS_DATA `type`, or the mapped
 *     stress/neighbor tension is silently dropped.
 */

import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { STRESS_TO_TENSION, NEIGHBOR_REL_TENSION } from '../../src/generators/historyGenerator.js';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '../../src');

const stripComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');

// ── 1a. Source guard: no localeCompare in the rng-consuming custom-content loops ─

const CUSTOM_CONTENT_GEN_FILES = [
  'generators/steps/assembleInstitutions.js',
  'generators/steps/resolveResources.js',
  'generators/steps/economyReconcilePass.js',
];

describe('custom-content gen loops use a codepoint-stable sort, not localeCompare', () => {
  test.each(CUSTOM_CONTENT_GEN_FILES)('%s contains no localeCompare', (rel) => {
    const code = stripComments(fs.readFileSync(path.join(SRC, rel), 'utf8'));
    expect(
      code.includes('.localeCompare'),
      `${rel} sorts custom content before an rng draw — localeCompare here is a `
        + `locale-dependent determinism hazard; use a codepoint comparator.`,
    ).toBe(false);
  });
});

// ── 1b. Behavioural: custom selection is input-order independent for a fixed seed ─

const SEED = 'b08-custom-determinism';

// Names chosen so a locale collator and a codepoint sort can disagree, and so
// they are non-essential (they roll rng.chance(0.3), which is exactly the path
// where iteration order leaks into the result).
const CUSTOM_INSTITUTION_NAMES = [
  'Zephyr Conclave',
  'apothecary cooperative',
  'Émigré Hall',
  'Ash-Wardens',
  'brine reliquary',
  'Ostler Guild',
  'naphtha works',
  'Émigré Annex',
];

const CUSTOM_RESOURCE_NAMES = [
  'zircon seam',
  'amber bog',
  'Étain lode',
  'cobalt vein',
  'Étendard quarry',
  'naphtha pool',
];

const mkInstitutions = (names) =>
  names.map((name, i) => ({
    name,
    localUid: `ci-${i}-${name}`,
    category: 'Other',
    // non-essential => subject to the rng.chance(0.3) gate
  }));

const mkResources = (names) =>
  names.map((name, i) => ({
    name,
    localUid: `cr-${i}-${name}`,
  }));

const shuffleStable = (arr) => {
  // Deterministic reversal-based reorder — we only need a DIFFERENT input order,
  // not randomness, so the test itself stays reproducible.
  return [...arr].reverse();
};

const TIER_CONFIG = {
  settType: 'town',
  culture: 'germanic',
  terrain: 'grassland',
  tradeRouteAccess: 'road',
};

// Generate and return BOTH the settlement and the final pipeline context (the
// context carries nearbyResourcesCustom, which assembleSettlement does not copy
// onto the settlement object).
const genWithCustom = (institutions, resources, seed = SEED) => {
  let ctx = null;
  const settlement = generateSettlementPipeline(TIER_CONFIG, null, {
    seed,
    customContent: { institutions, resources },
    onComplete: (finalCtx) => { ctx = finalCtx; },
  });
  return { settlement, ctx };
};

const customInstNames = (settlement) =>
  (settlement.institutions || [])
    .filter((i) => i.source === 'custom' || i.isCustom)
    .map((i) => i.name)
    .sort();

const selectedCustomResources = (ctx) =>
  [...(ctx?.nearbyResourcesCustom || [])].sort();

describe('same seed selects the same custom content regardless of input order', () => {
  test('custom institutions: selection is input-order independent', () => {
    const a = genWithCustom(mkInstitutions(CUSTOM_INSTITUTION_NAMES), []);
    const b = genWithCustom(mkInstitutions(shuffleStable(CUSTOM_INSTITUTION_NAMES)), []);

    const selA = customInstNames(a.settlement);
    const selB = customInstNames(b.settlement);

    // A no-op (zero custom institutions selected) would make this vacuously
    // true — assert the test actually exercised the rng-gated path.
    expect(selA.length, 'expected at least one custom institution to be selected').toBeGreaterThan(0);
    expect(selB).toEqual(selA);
  });

  test('custom resources: selection is input-order independent', () => {
    // RESOURCE_SEED is chosen so the resolveResources forked RNG selects >=1 of
    // the non-essential custom resources (the rng-gated path we need to exercise).
    const RESOURCE_SEED = 'b08-custom-resources';
    const a = genWithCustom([], mkResources(CUSTOM_RESOURCE_NAMES), RESOURCE_SEED);
    const b = genWithCustom([], mkResources(shuffleStable(CUSTOM_RESOURCE_NAMES)), RESOURCE_SEED);

    const selA = selectedCustomResources(a.ctx);
    const selB = selectedCustomResources(b.ctx);

    expect(selA.length, 'expected at least one custom resource to be selected').toBeGreaterThan(0);
    expect(selB).toEqual(selA);
  });

  test('whole-settlement determinism is preserved with custom content + same seed', () => {
    const a = genWithCustom(mkInstitutions(CUSTOM_INSTITUTION_NAMES), mkResources(CUSTOM_RESOURCE_NAMES));
    const b = genWithCustom(mkInstitutions(CUSTOM_INSTITUTION_NAMES), mkResources(CUSTOM_RESOURCE_NAMES));
    expect(b.settlement.institutions.map((i) => i.name)).toEqual(a.settlement.institutions.map((i) => i.name));
  });
});

// ── 2. STRESS_TO_TENSION / NEIGHBOR_REL_TENSION values resolve to real events ──

describe('every mapped tension type exists in HISTORICAL_EVENTS_DATA', () => {
  const KNOWN_TYPES = new Set(HISTORICAL_EVENTS_DATA.map((e) => e.type));

  test('every STRESS_TO_TENSION value is a real history-event type', () => {
    const dead = Object.entries(STRESS_TO_TENSION)
      .filter(([, type]) => !KNOWN_TYPES.has(type))
      .map(([stress, type]) => `${stress} -> ${type}`);
    expect(dead, `stress mappings pointing at non-existent event types: ${dead.join(', ')}`).toEqual([]);
  });

  test('every NEIGHBOR_REL_TENSION value is a real history-event type', () => {
    const dead = Object.entries(NEIGHBOR_REL_TENSION)
      .filter(([, type]) => !KNOWN_TYPES.has(type))
      .map(([rel, type]) => `${rel} -> ${type}`);
    expect(dead, `neighbor mappings pointing at non-existent event types: ${dead.join(', ')}`).toEqual([]);
  });
});

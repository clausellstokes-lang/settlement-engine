/**
 * tests/generators/neighbourRelDynamics.test.js — H13/H14 (Regional wave R3):
 * the neighbour relationship a user picks must actually move generation.
 *
 * The audit's verified finding: the institution-probability path read
 * dyn.defense/market/craft/criminal/espionage/government — keys REL_DYNAMICS
 * never defined — and config.neighborRelationship was read (military/economy
 * effective scores, history tensions) but never written. Probes showed
 * IDENTICAL institution chances, military scores, and faction-mirror odds for
 * hostile vs allied neighbours. R3 decision: WIRE the existing table, do not
 * redesign it.
 *
 * Pins:
 *   • vocabulary — the dyn.* keys consumers read are exactly the keys
 *     REL_DYNAMICS defines (the join cannot re-snap);
 *   • direction — hostile militarizes defense odds (×1+militaryBias) and
 *     suppresses markets (suppress ×0.4); trade partners boost markets
 *     (complement ×1.4); per the table's EXISTING magnitudes;
 *   • identity — a neutral same-tier average neighbour multiplies by exactly
 *     1.0, and no-neighbour generations never gain config.neighborRelationship
 *     (the default path is untouched);
 *   • seam — resolveNeighbour writes config.neighborRelationship into the
 *     resolved config snapshot (NOT the raw _config), so military/economy
 *     effective scores and history tensions finally see the relationship;
 *   • faction mirror — hostile vs allied roll different mirror/oppose odds
 *     (the table's govMirrorW/govAntithesisW magnitudes flow).
 */

import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getBaseChance } from '../../src/generators/institutionProbability.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';
import {
  ECONOMY_MODE_MARKET_MULT,
  REL_DYNAMICS,
  extractNeighbourProfile,
  getNeighbourFactionBias,
} from '../../src/generators/neighbourGenerator.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GENERATORS_DIR = path.resolve(HERE, '../../src/generators');

// ── Fixtures ─────────────────────────────────────────────────────────────────

const FLAT_CFG = {
  settType: 'town',
  priorityEconomy: 50,
  priorityMilitary: 50,
  priorityReligion: 50,
  priorityCriminal: 50,
  priorityMagic: 50,
};

/** Same-tier neighbour with average strengths so every non-relationship
 *  factor in the profile branch collapses to exactly 1.0 — any chance shift
 *  is the relationship dynamics and nothing else. */
function profileFor(rel) {
  return extractNeighbourProfile({
    name: 'Probeholm',
    tier: 'town',
    economicState: {},                    // prosperity unknown → economicStrength 0.5
    config: { priorityMilitary: 50 },     // militaryStrength 0.5
    powerStructure: {},
  }, rel);
}

// ── Vocabulary pin — the join cannot re-snap ─────────────────────────────────

const VOCABULARY = Object.freeze(['economyMode', 'govMirrorW', 'govAntithesisW', 'militaryBias']);

// The known REL_DYNAMICS consumers. A new consumer file reading dyn.* keys
// must be added here so its reads stay inside the vocabulary.
const CONSUMER_FILES = [
  'institutionProbability.js',
  'neighbourGenerator.js',
  path.join('steps', 'generateEconomy.js'),
  path.join('..', 'domain', 'region', 'tradeLinks.js'),
];

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function dynKeyReads(source) {
  const keys = new Set();
  const re = /\bdyn(?:amics)?\??\.(\w+)/g;
  for (const match of stripComments(source).matchAll(re)) keys.add(match[1]);
  return keys;
}

describe('REL_DYNAMICS vocabulary (H13)', () => {
  test('every relationship row defines exactly the canonical key set', () => {
    for (const [rel, row] of Object.entries(REL_DYNAMICS)) {
      expect(Object.keys(row).sort(), `REL_DYNAMICS.${rel}`).toEqual([...VOCABULARY].sort());
    }
  });

  test('consumers read ONLY keys REL_DYNAMICS defines — and DO read the wired ones', () => {
    const reads = new Set();
    for (const file of CONSUMER_FILES) {
      const source = fs.readFileSync(path.join(GENERATORS_DIR, file), 'utf8');
      for (const key of dynKeyReads(source)) reads.add(key);
    }
    const offVocabulary = [...reads].filter(key => !VOCABULARY.includes(key));
    // A non-empty list means a consumer reads a dyn.* key the table never
    // defines — the exact bug class H13 fixed (the read silently becomes a
    // 1.0/identity and the picker's promise goes dead again).
    expect(offVocabulary).toEqual([]);
    // …and the join is live, not vacuously empty:
    expect(reads.has('militaryBias')).toBe(true);
    expect(reads.has('economyMode')).toBe(true);
  });

  test('every economyMode the table uses has a market multiplier (no silent identity)', () => {
    for (const [rel, row] of Object.entries(REL_DYNAMICS)) {
      expect(
        Object.prototype.hasOwnProperty.call(ECONOMY_MODE_MARKET_MULT, row.economyMode),
        `economyMode '${row.economyMode}' (${rel}) missing from ECONOMY_MODE_MARKET_MULT`,
      ).toBe(true);
    }
  });
});

// ── Direction pins — the table's existing magnitudes flow ────────────────────

describe('relationship dynamics move institution odds (H13)', () => {
  test('hostile neighbour militarizes defense institutions; allied barely; neutral not at all', () => {
    const chance = rel => getBaseChance(0.4, 'Defense', 'Garrison', FLAT_CFG, rel ? profileFor(rel) : null);
    expect(chance('hostile')).toBeCloseTo(0.4 * (1 + REL_DYNAMICS.hostile.militaryBias), 10); // ×1.5
    expect(chance('allied')).toBeCloseTo(0.4 * (1 + REL_DYNAMICS.allied.militaryBias), 10);   // ×1.05
    expect(chance('neutral')).toBeCloseTo(0.4, 10);
    expect(chance('hostile')).toBeGreaterThan(chance('allied'));
    expect(chance('allied')).toBeGreaterThan(chance('neutral'));
    // identity: a neutral average neighbour is indistinguishable from none
    expect(chance('neutral')).toBe(chance(null));
  });

  test('trade partner boosts market institutions; hostile suppresses them', () => {
    const chance = rel => getBaseChance(0.3, 'Economy', 'Market square', FLAT_CFG, rel ? profileFor(rel) : null);
    expect(chance('trade_partner')).toBeCloseTo(0.3 * ECONOMY_MODE_MARKET_MULT.complement, 10); // ×1.4
    expect(chance('hostile')).toBeCloseTo(0.3 * ECONOMY_MODE_MARKET_MULT.suppress, 10);         // ×0.4
    expect(chance('neutral')).toBeCloseTo(0.3, 10);
    expect(chance('trade_partner')).toBeGreaterThan(chance(null));
    expect(chance('hostile')).toBeLessThan(chance(null));
    expect(chance('neutral')).toBe(chance(null));
  });

  test('axes the table carries no magnitudes for stay identity (craft/criminal)', () => {
    // The old dyn.craft/dyn.criminal/dyn.espionage/dyn.government reads were
    // identity no-ops on undefined keys; their removal must not change odds.
    for (const rel of ['hostile', 'allied', 'trade_partner', 'neutral']) {
      expect(getBaseChance(0.2, 'Craft', 'Workshop row', FLAT_CFG, profileFor(rel)))
        .toBe(getBaseChance(0.2, 'Craft', 'Workshop row', FLAT_CFG, null));
      expect(getBaseChance(0.2, 'Criminal', 'Smugglers den', FLAT_CFG, profileFor(rel)))
        .toBe(getBaseChance(0.2, 'Criminal', 'Smugglers den', FLAT_CFG, null));
    }
  });
});

describe('faction-mirror odds differ by relationship (H13)', () => {
  function biasFor(rel) {
    return getNeighbourFactionBias(extractNeighbourProfile({
      name: 'Probeholm',
      tier: 'town',
      economicState: {},
      config: {},
      powerStructure: { factions: [{ faction: 'City Guard', power: 60, category: 'military' }] },
    }, rel));
  }

  test('allied mirrors strongly and barely opposes; hostile is the reverse', () => {
    const allied = biasFor('allied');
    const hostile = biasFor('hostile');
    expect(allied.mirrorWeight).toBe(REL_DYNAMICS.allied.govMirrorW);    // 0.20
    expect(allied.opposeWeight).toBe(REL_DYNAMICS.allied.govAntithesisW); // 0.02
    expect(hostile.mirrorWeight).toBe(REL_DYNAMICS.hostile.govMirrorW);   // 0.02
    expect(hostile.opposeWeight).toBe(REL_DYNAMICS.hostile.govAntithesisW); // 0.40
    expect(allied.mirrorWeight).toBeGreaterThan(hostile.mirrorWeight);
    expect(hostile.opposeWeight).toBeGreaterThan(allied.opposeWeight);
  });
});

// ── The seam — config.neighborRelationship is written and consumed (H14) ─────

describe('config.neighborRelationship reaches the effective scores (H14)', () => {
  test('relationship type shifts militaryEffective and economyOutput deterministically', () => {
    const withRel = rel => ({ ...FLAT_CFG, ...(rel ? { neighborRelationship: { relationshipType: rel } } : {}) });
    const mil = rel => getInstFlags(withRel(rel), []).militaryEffective;
    const econ = rel => getInstFlags(withRel(rel), []).economyOutput;
    expect(mil('hostile')).toBeGreaterThan(mil(null));
    expect(mil(null)).toBeGreaterThan(mil('allied'));
    expect(econ('trade_partner')).toBeGreaterThan(econ(null));
    expect(econ(null)).toBeGreaterThan(econ('hostile'));
  });

  // Seeded pipeline pair — the audit's probe, pinned. Same seed, same
  // neighbour, only the relationship differs.
  const NEIGHBOUR_CFG = { settType: 'town', culture: 'germanic', tradeRouteAccess: 'road', priorityMilitary: 70, priorityEconomy: 60 };
  const SELF_CFG = { settType: 'town', culture: 'germanic', tradeRouteAccess: 'road' };
  const SEED = 'r3-probe-2026-06-11';
  const neighbour = generateSettlementPipeline(NEIGHBOUR_CFG, null, { seed: 'r3-neighbour-seed', customContent: {} });
  const genWithRel = rel => generateSettlementPipeline(
    { ...SELF_CFG, _neighbourRelType: rel }, neighbour, { seed: SEED, customContent: {} },
  );

  test('hostile vs allied neighbours produce measurably different military scores on the same seed', () => {
    const hostile = genWithRel('hostile');
    const allied = genWithRel('allied');

    // The seam half: the resolved config snapshot carries the relationship…
    expect(hostile.config.neighborRelationship).toEqual({ neighborName: neighbour.name, relationshipType: 'hostile' });
    expect(allied.config.neighborRelationship).toEqual({ neighborName: neighbour.name, relationshipType: 'allied' });
    // …while the RAW generation input stays clean (derived state must never
    // echo back into the next generation's config).
    expect(hostile._config.neighborRelationship).toBeUndefined();
    expect(allied._config.neighborRelationship).toBeUndefined();

    // The effect half: military scores diverge in the table's direction.
    const hostileMil = getInstFlags(hostile.config, hostile.institutions).militaryEffective;
    const alliedMil = getInstFlags(allied.config, allied.institutions).militaryEffective;
    expect(hostileMil).toBeGreaterThan(alliedMil);
  });

  test('no-neighbour generations never gain config.neighborRelationship (identity for the default path)', () => {
    const solo = generateSettlementPipeline(SELF_CFG, null, { seed: SEED, customContent: {} });
    expect(solo.config.neighborRelationship).toBeUndefined();
    expect(solo._config.neighborRelationship).toBeUndefined();
  });
});

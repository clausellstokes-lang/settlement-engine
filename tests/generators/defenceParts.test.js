/**
 * defenceParts.test.js — COHERENCE-UPKEEP-5: DEFENCE AS THE SUM OF ITS PARTS (V3 with the chair's
 * R13 and R14). The reference is the probe's `parts.mjs :: itemise(..., 'V4', ...)`; the 3,036-birth
 * agreement is measured in docs/chair/2026-11-13/UPKEEP-V3-BUILD.md. This suite holds the
 * product's own contract on a corpus no seat tuned on (`v3build-*`, six sizes, calm and four
 * forced crises), born as the probe's births.mjs bears them.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateDefenseProfile } from '../../src/generators/defenseGenerator.js';
import { neighbourMilitaryFactorOf } from '../../src/generators/priorityHelpers.js';
import { keepOfRecord } from '../../src/domain/facts/keep.js';
import { readinessBandOf } from '../../src/data/bandLadders.js';
import { DEFENCE_TUNING, DEFENCE_WEIGHT_REASONS, DEFENCE_WORDS } from '../../src/data/defenceWeights.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'under_siege', 'wartime', 'occupied'];
const GROUPS = new Set(['BUILT', 'STANDS', 'SUSTAINS', 'GROUND', 'AGAINST', 'LIMIT']);

/** The printed prosperity label at e1b2f9c1f, the tree without this lane's change (measured first). */
const PRINTED_AT_BASE = Object.freeze({
  'v3build-thorp-0': 'Struggling', 'v3build-thorp-1': 'Poor', 'v3build-hamlet-0': 'Poor', 'v3build-hamlet-1': 'Struggling',
  'v3build-village-0': 'Struggling', 'v3build-town-0': 'Moderate', 'v3build-town-2': 'Moderate', 'v3build-city-0': 'Struggling',
  'v3build-city-1': 'Prosperous', 'v3build-metropolis-0': 'Wealthy', 'v3build-metropolis-2': 'Comfortable',
  'v3build-famine-town-0': 'Struggling', 'v3build-under_siege-city-0': 'Struggling', 'v3build-wartime-town-0': 'Comfortable',
  'v3build-occupied-village-0': 'Poor', 'v3build-occupied-city-0': 'Poor',
});

const rows = [];
for (const tier of TIERS) for (let i = 0; i < 8; i++) rows.push({ key: `v3build-${tier}-${i}`, tier, stress: null });
for (const stress of CRISES) for (const tier of TIERS) for (let i = 0; i < 3; i++) rows.push({ key: `v3build-${stress}-${tier}-${i}`, tier, stress });

/** @type {Record<string, any>} */
const births = {};

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const row of rows) {
    const cfg = row.stress
      ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false })
      : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier });
    births[row.key] = generateSettlementPipeline(cfg, null, { seed: row.key, customContent: {} });
  }
}, 240000);

/** @param {number} v */
const tenthsOf = (v) => Math.round(v * 10);

describe('defence is the sum of its parts', () => {
  test(`the parts sum EXACTLY to readiness.score on every birth (${rows.length})`, () => {
    const bad = [];
    for (const [key, s] of Object.entries(births)) {
      const dp = s.defenseProfile;
      const sum = dp.parts.reduce((a, p) => a + tenthsOf(p.points), 0);
      if (sum !== tenthsOf(dp.readiness.score) || Math.abs(dp.readiness.score * 10 - sum) > 1e-9) bad.push([key, sum / 10, dp.readiness.score]);
    }
    expect(bad).toEqual([]);
  });

  test('every part names its group, its label and its source, with points in tenths', () => {
    const bad = [];
    for (const [key, s] of Object.entries(births)) {
      for (const p of s.defenseProfile.parts) {
        const ok = GROUPS.has(p.group) && typeof p.id === 'string' && p.id.length > 0
          && typeof p.label === 'string' && p.label.length > 0 && typeof p.source === 'string' && p.source.length > 0
          && Number.isFinite(p.points) && Math.abs(p.points * 10 - Math.round(p.points * 10)) < 1e-9;
        if (!ok) bad.push([key, p]);
      }
    }
    expect(bad).toEqual([]);
  });

  test('each line is its own measure to the tenth: a part counts no more than its full measure, and size and threat are the table\'s', () => {
    const bad = [];
    for (const [key, s] of Object.entries(births)) {
      for (const p of s.defenseProfile.parts) {
        if (typeof p.full === 'number' && Math.abs(p.points) > Math.abs(p.full) + 0.1 + 1e-9) bad.push([key, p.id, p.points, p.full]);
        if (p.id === 'size' && p.points !== DEFENCE_TUNING.size[s.tier]) bad.push([key, 'size', p.points]);
        if (p.id === 'danger' && p.points !== -DEFENCE_TUNING.threat.penalty[s.config.monsterThreat]) bad.push([key, 'danger', p.points]);
      }
    }
    expect(bad).toEqual([]);
  });

  test('readiness sits on its scale and its band is the ladder\'s for the score; the five scores sit on theirs', () => {
    for (const [key, s] of Object.entries(births)) {
      const { readiness, scores } = s.defenseProfile;
      expect(readiness.score, key).toBeGreaterThanOrEqual(0);
      expect(readiness.score, key).toBeLessThanOrEqual(100);
      expect(readiness.label, key).toBe(readinessBandOf(readiness.score).label);
      for (const k of ['military', 'monster', 'internal', 'economic', 'magical']) {
        expect(scores[k], `${key} ${k}`).toBeGreaterThanOrEqual(0);
        expect(scores[k], `${key} ${k}`).toBeLessThanOrEqual(100);
      }
    }
  });

  test('a crisis acts once, on the parts it touches: every forced siege, famine and occupation takes from a part', () => {
    for (const [key, s] of Object.entries(births)) {
      const forced = rows.find((r) => r.key === key).stress;
      if (!forced || forced === 'wartime') continue;
      const took = s.defenseProfile.parts.some((p) => p.crisis && Object.hasOwn(p.crisis, forced));
      expect(took, key).toBe(true);
    }
  });

  test('THE PROOF OF DERIVED: store, strip the profile, recompute from the record — equal field for field', () => {
    let equal = 0;
    for (const [key, s] of Object.entries(births)) {
      const stored = JSON.parse(JSON.stringify(s));
      const was = stored.defenseProfile; delete stored.defenseProfile;
      const again = JSON.parse(JSON.stringify(generateDefenseProfile(stored, keepOfRecord(stored.economicState))));
      expect(again, key).toEqual(was);
      equal += 1;
    }
    expect(equal).toBe(rows.length);
  });

  test('the printed prosperity label is the label the tree printed before this lane (pinned at e1b2f9c1f)', () => {
    const got = Object.fromEntries(Object.keys(PRINTED_AT_BASE).map((k) => [k, births[k].economicState.prosperity]));
    expect(got).toEqual(PRINTED_AT_BASE);
  });
});

describe('the martial will (R13, R14)', () => {
  test('R14: the neighbour factor is the one reading militaryEffective used, table for table', () => {
    /** e1b2f9c1f's ternary in priorityHelpers.js, verbatim. @param {string} type */
    const before = (type) => {
      const neighborType = (type || '').toLowerCase();
      return (neighborType.includes('hostile') || neighborType.includes('rival')) ? 1.20
        : neighborType.includes('cold_war') ? 1.18 : neighborType.includes('tense') ? 1.10
          : neighborType.includes('allied') ? 0.92 : neighborType.includes('trade_partner') ? 0.96 : 1.0;
    };
    for (const type of ['', 'hostile', 'rival', 'Hostile_rival', 'cold_war', 'tense', 'allied', 'trade_partner', 'neutral', 'vassal', 'allied_tense']) {
      expect(neighbourMilitaryFactorOf({ neighborRelationship: { relationshipType: type } }), type).toBe(before(type));
    }
    expect(neighbourMilitaryFactorOf({})).toBe(1);
  });

  test('R14: a hostile neighbour sharpens the will ×1.2 on a stored record (1 on every lone birth)', () => {
    let moved = 0;
    for (const [key, s] of Object.entries(births)) {
      const stored = JSON.parse(JSON.stringify(s));
      expect(stored.config.neighborRelationship?.relationshipType ?? null, `${key} is a lone birth`).toBe(null);
      const will = stored.defenseProfile.parts.find((p) => p.id === 'will');
      if (!will) continue;
      stored.config.neighborRelationship = { relationshipType: 'hostile' };
      const again = generateDefenseProfile(stored, keepOfRecord(stored.economicState)).parts.find((p) => p.id === 'will');
      expect(again.full, key).toBeGreaterThanOrEqual(will.full);
      if (again.full > will.full) moved += 1;
    }
    expect(moved, 'the factor reaches the will').toBeGreaterThan(0);
  });

  test('R13: where something is built or standing, the will counts no more than the armed bodies that carry it', () => {
    const ARMED = new Set(['garrison', 'militia', 'watch', 'company', 'charter', 'households', 'wardens']);
    let held = 0;
    for (const [key, s] of Object.entries(births)) {
      const parts = s.defenseProfile.parts;
      const will = parts.find((p) => p.id === 'will');
      if (!will || will.held === undefined) continue;
      held += 1;
      const armed = parts.filter((p) => ARMED.has(p.id)).reduce((a, p) => a + p.points, 0);
      expect(will.points, key).toBeLessThanOrEqual(armed + 0.1 * parts.length);
      expect(will.label).toBe('Martial will');
    }
    expect(held, 'the hold binds somewhere in the corpus').toBeGreaterThan(0);
  });
});

describe('the weights', () => {
  test('every row of the table carries a one-line reason, and every reason a row', () => {
    expect(Object.keys(DEFENCE_WEIGHT_REASONS).sort()).toEqual(Object.keys(DEFENCE_TUNING).sort());
    for (const [k, why] of Object.entries(DEFENCE_WEIGHT_REASONS)) {
      expect(typeof why === 'string' && why.length > 8 && !why.includes('\n'), k).toBe(true);
    }
    expect(Object.isFrozen(DEFENCE_TUNING)).toBe(true);
    expect(Object.isFrozen(DEFENCE_WORDS)).toBe(true);
  });
});

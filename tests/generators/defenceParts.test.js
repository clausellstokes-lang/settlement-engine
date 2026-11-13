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
import { generateDefenseProfile, defencePartsOf } from '../../src/generators/defenseGenerator.js';
import { buildWorldExport } from '../../src/lib/worldExport.js';
import { neighbourMilitaryFactorOf } from '../../src/generators/priorityHelpers.js';
import { keepOfRecord } from '../../src/domain/facts/keep.js';
import { readinessBandOf } from '../../src/data/bandLadders.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { defenseWallOf } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
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
  test(`the parts (computed from the record) sum EXACTLY to readiness.score on every birth (${rows.length})`, () => {
    const bad = [];
    for (const [key, s] of Object.entries(births)) {
      const parts = defencePartsOf(s);
      const sum = parts.reduce((a, p) => a + tenthsOf(p.points), 0);
      if (sum !== tenthsOf(s.defenseProfile.readiness.score) || Math.abs(s.defenseProfile.readiness.score * 10 - sum) > 1e-9) bad.push([key, sum / 10, s.defenseProfile.readiness.score]);
    }
    expect(bad).toEqual([]);
  });

  // COHERENCE-UPKEEP-6, the chair's ruling 2 on REVIEW-UPKEEP-2 (the review's §3): the parts are NOT stored.
  // Defence holds no fact of its own, so the parts are computed from the record by one exported function
  // (`defencePartsOf`), for the tests, the probes and the owner's eight towns; the stored profile keeps the
  // shape it had before this lane, and the world export (player and DM) carries no part.
  test('the parts are NOT stored, and the world export carries none', () => {
    const PART_WORDS = ['Martial will', 'held in reserve', 'Walls with no one to man them', 'can carry no more than'];
    for (const [key, s] of Object.entries(births)) {
      expect(s.defenseProfile.parts, `${key}: no stored parts`).toBeUndefined();
      const parts = defencePartsOf(s);
      expect(parts.length, `${key}: the function computes them`).toBeGreaterThan(0);
      for (const full of [true, false]) {
        const text = JSON.stringify(buildWorldExport([s], { full }));
        for (const w of PART_WORDS) expect(text.includes(w), `${key}: export (full=${full}) carries "${w}"`).toBe(false);
        expect(/"parts"\s*:\s*\[\s*\{[^]*?"group"/.test(text), `${key}: export (full=${full}) carries a defence parts array`).toBe(false);
      }
    }
  });

  test('every part names its group, its label and its source, with points in tenths', () => {
    const bad = [];
    for (const [key, s] of Object.entries(births)) {
      for (const p of defencePartsOf(s)) {
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
      for (const p of defencePartsOf(s)) {
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

  // COHERENCE-UPKEEP-6 (the chair's ruling on the fifth seat's call 1): the band is read from the score AS
  // THE PAGE SHOWS IT. The page prints readiness in whole points (the causal contributor's sentence), so the
  // score is whole points and the band is the ladder's for that figure: a number and its band never disagree.
  test('the score is the figure the page prints, in whole points, and its band is the ladder\'s for that figure', () => {
    const bad = [];
    for (const [key, s] of Object.entries(births)) {
      const { readiness } = s.defenseProfile;
      const said = deriveCausalState(s).variables.defense_readiness.contributors
        .find((c) => c.source === 'defenseProfile.readiness.score')?.reason;
      const printed = Number(/Defense readiness score: (\d+)\./.exec(String(said))?.[1]);
      if (!Number.isInteger(readiness.score) || printed !== readiness.score || readinessBandOf(printed).label !== readiness.label) {
        bad.push([key, readiness.score, printed, readiness.label]);
      }
    }
    expect(bad).toEqual([]);
  });

  test('a crisis acts once, on the parts it touches: every forced siege, famine and occupation takes from a part', () => {
    for (const [key, s] of Object.entries(births)) {
      const forced = rows.find((r) => r.key === key).stress;
      if (!forced || forced === 'wartime') continue;
      const took = defencePartsOf(s).some((p) => p.crisis && Object.hasOwn(p.crisis, forced));
      expect(took, key).toBe(true);
    }
  });

  // COHERENCE-UPKEEP-6, C (the chair's decision on the owner's deferral, record 323's R16): WAR DRAINS. Wartime
  // is one more row of the crisis table: it takes supply from what sustains a town and leaves who stands and
  // what is built alone.
  test('RED-FIRST: wartime drains what sustains a town and leaves who stands and what is built alone', () => {
    let forced = 0;
    for (const [key, s] of Object.entries(births)) {
      if (rows.find((r) => r.key === key).stress !== 'wartime') continue;
      forced += 1;
      const took = defencePartsOf(s).filter((p) => p.crisis && Object.hasOwn(p.crisis, 'wartime'));
      expect(took.length, `${key}: wartime takes from a part`).toBeGreaterThan(0);
      for (const p of took) expect(p.group, `${key}: ${p.id}`).toBe('SUSTAINS');
    }
    expect(forced, 'anchored: the corpus forces wartime').toBe(TIERS.length * 3);
  });

  // COHERENCE-UPKEEP-6, the chair's ruling 3 on REVIEW-UPKEEP-2 (C6): EVERY EFFECT OF A CRISIS ON A DEFENCE
  // SCORE IS A ROW OF THE ONE CRISIS TABLE. The Crime part reads crime before the stress multiplier; what a
  // crisis did to crime through that multiplier is its table row's `crime`, at the size it had (so no
  // famine or siege rating moves); wartime has no such row (its one row is the supply drain).
  test('RED-FIRST: the Crime part answers to the crisis table alone, and wartime adds nothing to crime', () => {
    let attributed = 0;
    for (const [key, s] of Object.entries(births)) {
      const forced = rows.find((r) => r.key === key).stress;
      if (!forced) continue;
      const keep = keepOfRecord(s.economicState);
      const crimeOf = (x) => defencePartsOf(x, keep).find((p) => p.id === 'crime');
      const withoutConfigStress = { ...s, config: { ...s.config, stressTypes: [], stressType: undefined } };
      expect(crimeOf(withoutConfigStress)?.points ?? 0, `${key}: crime reads no stress multiplier`).toBe(crimeOf(s)?.points ?? 0);
      const crime = crimeOf(s);
      if (forced === 'wartime') expect(Boolean(crime?.crisis && Object.hasOwn(crime.crisis, 'wartime')), `${key}: no wartime crime`).toBe(false);
      if ((forced === 'famine' || forced === 'under_siege') && crime?.crisis && Object.hasOwn(crime.crisis, forced)) attributed += 1;
    }
    expect(DEFENCE_TUNING.crises.famine.crime, 'famine\'s crime row').toBeGreaterThan(1);
    expect(DEFENCE_TUNING.crises.under_siege.crime, 'the siege\'s crime row').toBeGreaterThan(1);
    expect(Object.hasOwn(DEFENCE_TUNING.crises.wartime, 'crime'), 'wartime has no crime row').toBe(false);
    expect(attributed, 'anchored: the record shows the crisis\'s share of crime').toBeGreaterThan(0);
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

// COHERENCE-UPKEEP-6, B (the chair's decision on the owner's deferral, record 323's R17): the walls part is
// scaled by the wall's kind, read from the roster's defence home (`defenseWallOf`). Stone keeps its full value.
describe('the kind of wall counts', () => {
  test('RED-FIRST: the walls part is the walls\' points scaled by the kind the defence home answers', () => {
    const bad = [];
    let kinds = new Set();
    for (const [key, s] of Object.entries(births)) {
      const walls = defencePartsOf(s).find((p) => p.id === 'walls');
      const wall = defenseWallOf(s.institutions);
      expect(Boolean(walls), `${key}: a walls part where the home answers a wall`).toBe(wall.present);
      if (!walls) continue;
      kinds.add(wall.kind);
      const n = s.config.magicExists === false ? 4 : 5;
      const full = (DEFENCE_TUNING.walls.mil + DEFENCE_TUNING.walls.mon) * DEFENCE_TUNING.wallKind[wall.kind] / n;
      if (Math.abs(walls.full - Math.round(full * 10) / 10) > 1e-9) bad.push([key, wall.kind, walls.full, full]);
    }
    expect([...kinds].sort(), 'anchored: the corpus holds stone and palisade walls').toEqual(['palisade', 'stone']);
    expect(bad).toEqual([]);
  });

  // Re-keyed by identity at the chair's ruling of 2026-11-13 13:1x: the earthwork's 0.4 was reached by no birth (the
  // roster's "Palisade or earthworks" reads as a palisade), so its row leaves the table until the roster names one.
  test('stone keeps today\'s full value; a palisade counts for less; the table holds no row no birth can reach', () => {
    const K = DEFENCE_TUNING.wallKind;
    expect(K.stone).toBe(1);
    expect(K.palisade).toBeLessThan(K.stone);
    expect(Object.keys(K).sort()).toEqual(['palisade', 'stone']);
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
      const will = defencePartsOf(stored).find((p) => p.id === 'will');
      if (!will) continue;
      stored.config.neighborRelationship = { relationshipType: 'hostile' };
      const again = defencePartsOf(stored, keepOfRecord(stored.economicState)).find((p) => p.id === 'will');
      expect(again.full, key).toBeGreaterThanOrEqual(will.full);
      if (again.full > will.full) moved += 1;
    }
    expect(moved, 'the factor reaches the will').toBeGreaterThan(0);
  });

  // COHERENCE-UPKEEP-6, the chair's ruling 5 on REVIEW-UPKEEP-2 (C7, confirmed by execution first: with no hold
  // and no crisis, pay alone cut the will at Moderate, Poor and Struggling): THE MARTIAL WILL IS NOT A PAID PART.
  // It is base configuration, held to the armed bodies that carry it; pay reaches it only through that limit.
  test('RED-FIRST: the martial will is not paid — where its hold does not bind and no crisis touches it, pay leaves it whole', () => {
    let compared = 0;
    for (const [key, s] of Object.entries(births)) {
      const keep = keepOfRecord(s.economicState);
      if (keep.funded >= 1) continue;
      const atPay = defencePartsOf(s, keep).find((p) => p.id === 'will');
      const atFull = defencePartsOf(s, { bought: 1, funded: 1 }).find((p) => p.id === 'will');
      if (!atPay || atPay.held !== undefined || atFull.held !== undefined || atPay.crisis || atFull.crisis) continue;
      compared += 1;
      expect(atPay.points, `${key}: the will at its standing pay`).toBe(atFull.points);
    }
    expect(compared, 'anchored: the corpus holds paid-short places with a will').toBeGreaterThan(0);
  });

  test('R13: where something is built or standing, the will counts no more than the armed bodies that carry it', () => {
    const ARMED = new Set(['garrison', 'militia', 'watch', 'company', 'charter', 'households', 'wardens']);
    let held = 0;
    for (const [key, s] of Object.entries(births)) {
      const parts = defencePartsOf(s);
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

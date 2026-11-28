/**
 * THE MONOTONE LAW OF THE DEFENCE RATING (UPKEEP-13, the guard; the measure is
 * docs/chair/2026-11-14/UPKEEP-MONOTONE-MEASURE.md on lane/upkeep-measure-2-2026-11-14, its instrument
 * `probes/UPKEEP-MEASURE-2/mono2.mjs`, the reader's set marked there `r:1`).
 *
 * The owner's design: readiness is a list of parts and their sum, and "a single alchemist should not have the
 * same influence as an alchemist district". So ADDING A HOUSE OR RAISING A RUNG NEVER LOWERS A SCORE OR
 * READINESS. Over the reader's 972 births (REVIEW-UPKEEP-CAPACITY's `all.seeds`, born as the reader's
 * render5.mjs's `cfgFor` births them), for every house of the reader's set added (a catalogue house that opens a
 * scaled part, written at the place's tier or one tier around, with its catalogue row's shelf, tags and chance)
 * and every rung raised (a roster house renamed to the greater name of a ladder pair whose two names share a
 * scaled job), none of the five scores and not readiness falls. The record is otherwise untouched: defence is
 * re-read by `generateDefenseProfile` at the record's own standing keep.
 *
 * NOT REACHED BY THIS LAW, by the chair's ruling (6) of 2026-11-14: a house of crime lowers order BY DESIGN (it is
 * not in the reader's set: it opens no scaled part), and the six renames across a function or a government are not
 * "a larger house of its own kind" (they share no scaled job, so no pair of the reader's set holds them).
 *
 * Every change is tried and every fall collected; the assertion is on the whole collection, once (no seed loop
 * asserts). Red at the base 26474cda9 for the measured count: 1,751 changes with a fall, in 292 births.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateDefenseProfile } from '../../src/generators/defenseGenerator.js';
import { keepOfRecord } from '../../src/domain/facts/keep.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';
import { defenseTraditionNamesOf } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { isFabricInstitution, institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { UPGRADE_CHAINS } from '../../src/data/institutionLadders.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const R2S = ['under_siege', 'famine', 'occupied', 'politically_fractured', 'indebted', 'recently_betrayed', 'infiltrated', 'plague_onset', 'succession_void', 'monster_pressure', 'insurgency', 'religious_conversion', 'slave_revolt', 'wartime', 'mass_migration'];
const RV5 = ['calm', 'under_siege', 'famine', 'occupied', 'wartime', 'monster_pressure', 'under_siege+famine'];

/** The reader's 972 births, each with its birth config (render5.mjs's `cfgFor`). */
const BIRTHS = [];
for (const tier of TIERS) for (let i = 0; i < 60; i++) BIRTHS.push({ seed: `r2r-${tier}-${i}`, tier, stresses: null });
for (const stress of R2S) for (const tier of TIERS) for (let i = 0; i < 4; i++) BIRTHS.push({ seed: `r2s-${stress}-${tier}-${i}`, tier, stresses: [stress] });
for (const combo of RV5) for (const tier of TIERS) for (let i = 0; i < 6; i++) BIRTHS.push({ seed: `rv5-${combo}-${tier}-${i}`, tier, stresses: combo === 'calm' ? [] : combo.split('+') });

/** @param {{ tier: string, stresses: string[] | null }} b */
const cfgOf = (b) => birthConfig(b.stresses
  ? { ...DEFAULT_CONFIG, ...DIALS, settType: b.tier, selectedStresses: b.stresses, selectedStressesRandom: false }
  : { ...DEFAULT_CONFIG, ...DIALS, settType: b.tier });

/** The scaled parts one house opens, alone (the generator's own openers, asked as the measure's instrument asks). */
const SCALED_PARTS = {
  garrison: (i) => i.hasGarrison, militia: (i) => i.hasMilitia, watch: (i) => i.hasWatch, court: (i) => i.hasCourtSystem,
  prison: (i) => i.hasPrison, wardens: (_, n) => n.wardens, company: (i) => i.hasMercenary, charter: (i) => i.hasCharterHall,
  clergy: (_, n) => n.divine, druids: (_, n) => n.druid, market: (i) => i.hasMarket, hospital: (i) => i.hasHospital,
  alchemists: (_, n) => n.alchemy,
};
/** @param {{ name: string }} house */
const jobsOf = (house) => {
  const one = [house];
  const { inst } = getInstFlags({}, one);
  const names = defenseTraditionNamesOf(one.filter((i) => !isFabricInstitution(/** @type {any} */ (i))));
  return Object.keys(SCALED_PARTS).filter((id) => SCALED_PARTS[id](inst, names));
};

/** Every catalogue house, its row at each tier the catalogue writes it at. */
const rowOf = {};
for (const t of TIERS) for (const [shelf, rows] of Object.entries(institutionalCatalog[t] || {})) for (const [n, row] of Object.entries(rows || {})) (rowOf[n] ||= {})[t] = { ...row, category: shelf };
/** The reader's houses: those that open a scaled part. */
const READER_HOUSES = Object.keys(rowOf).filter((n) => jobsOf({ name: n }).length);
/** The reader's rungs: the greater names of each ladder pair whose two names share a scaled job. */
const GREATER = {};
for (const [lesser, greater] of UPGRADE_CHAINS) {
  const jl = jobsOf({ name: lesser }), jg = jobsOf({ name: greater });
  if (jl.some((j) => jg.includes(j))) (GREATER[lesser.toLowerCase()] ||= []).push(greater);
}

const SCORES = ['military', 'monster', 'internal', 'economic', 'magical'];
/** @param {any} s */
const readOf = (s) => {
  const p = generateDefenseProfile(s, keepOfRecord(s.economicState));
  return { ...Object.fromEntries(SCORES.map((k) => [k, p.scores[k]])), readiness: p.readiness.score };
};

/** Every fall: `{ seed, change, score, before, after }`. */
const FALLS = [];
let tried = 0;

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const b of BIRTHS) {
    const s = generateSettlementPipeline(cfgOf(b), null, { seed: b.seed, customContent: {} });
    const s0 = readOf(s);
    const tryOne = (/** @type {string} */ change, /** @type {any} */ s1) => {
      tried += 1;
      const r = readOf(s1);
      for (const k of Object.keys(s0)) if (r[k] < s0[k]) FALLS.push({ seed: b.seed, change, score: k, before: s0[k], after: r[k] });
    };
    const roster = s.institutions || [];
    roster.forEach((h, i) => {
      for (const g of GREATER[String(h.name).toLowerCase()] || []) {
        tryOne(`${h.name} -> ${g}`, { ...s, institutions: roster.map((x, j) => (j === i ? { ...x, name: g } : x)) });
      }
    });
    const ti = TIERS.indexOf(s.tier);
    const near = new Set(TIERS.slice(Math.max(0, ti - 1), ti + 2));
    const have = new Set(roster.map((h) => String(h.name).toLowerCase()));
    for (const n of READER_HOUSES) {
      if (have.has(n.toLowerCase())) continue;
      const at = Object.keys(rowOf[n]).find((t) => near.has(t));
      if (!at) continue;
      const row = rowOf[n][at];
      tryOne(`+ ${n}`, { ...s, institutions: [...roster, { name: n, category: row.category, tags: row.tags || [], baseChance: row.baseChance }] });
    }
  }
}, 900000);

describe('the defence rating is monotone in its houses (UPKEEP-13)', () => {
  test('the reader\'s 972 births are born, and the reader\'s set is tried on each', () => {
    expect(BIRTHS.length).toBe(972);
    expect(new Set(BIRTHS.map((b) => b.seed)).size).toBe(972);
    expect(READER_HOUSES.length).toBeGreaterThan(0);
    expect(tried).toBeGreaterThan(BIRTHS.length);
  });

  test('adding a house or raising a rung never lowers a score or readiness', () => {
    const changes = new Set(FALLS.map((f) => `${f.seed}|${f.change}`));
    const births = new Set(FALLS.map((f) => f.seed));
    const shown = FALLS.slice(0, 40).map((f) => `${f.seed}: ${f.change}: ${f.score} ${f.before} -> ${f.after}`);
    expect(FALLS.map((f) => `${f.seed}: ${f.change}: ${f.score}`),
      `${changes.size} changes with a fall (${FALLS.length} score-falls) in ${births.size} of ${BIRTHS.length} births, of ${tried} tried:\n${shown.join('\n')}`).toEqual([]);
  });
});

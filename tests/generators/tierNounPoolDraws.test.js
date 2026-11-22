/**
 * tests/generators/tierNounPoolDraws.test.js — A CITY'S INSTITUTIONS AND ITS TOLLS ARE NOT
 * WRITTEN AS A TOWN'S (lane TIER-NOUN-POOLS, 2026-11-04; SOAK_1000_2026-11-03 §2 row 4, §4b R3).
 *
 * THE DEFECT, MEASURED BEFORE THE CURE. Over the 1,000-settlement soak at 39038801
 * (`coh:tier-noun`), 287 places that are not towns printed "town" about themselves. The
 * history, arrival and self-vouch pools the brief named print 0 of them at this tip: SIZE
 * ruling 2 already speaks that text. What remains comes from text written at generation that
 * nothing speaks: three institution description variants (`institutionDescVariants.js`:
 * the cobbler's guild "shoe the town" in 91 places, the chandler "The town depends on it for
 * lighting" in 76, the tanners "where a town can manage it" in 38, all cities and
 * metropolises) and the Gate Tolls income line "collected at the town gates" (economicState,
 * 28 cities).
 *
 * THE CURE'S SHAPE: the drawn string passes through the dossier kernel's `speakTierNoun` with
 * the settlement's tier noun where it is drawn — the SIZE ruling 2 precedent
 * (`historyGenerator.js :: speakRecord`). No pool byte moves, no sentence is added, a town is
 * identity, and nothing draws.
 *
 * NO EXCLUSION: the customs-house variant "collected by officials of crown or town" (crown or
 * town = royal or municipal) is a kept phrase in the kernel's TIER_NOUN_KEPT since the chair's
 * ruling 1, so every finding in these lines is an offender.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { tierNounFindings } from '../../src/domain/coherence/tierNounFindings.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_DESC_VARIANTS } from '../../src/data/institutionDescVariants.js';
import { INLAND_DESCRIPTIONS } from '../../src/data/inlandDescriptions.js';

const PER_TIER = 8;
/** The routed sentences, in either noun: the arms read them before and after the cure. */
const ROUTED = [
  /Organised cobblers who shoe the \p{L}+ in boots/u,
  /The \p{L}+ depends on it for lighting/u,
  /downstream of the rest where a \p{L}+ can manage it/u,
];
const TOLLS = /Entry and exit tolls collected at the \p{L}+ gates/u;
const TOWN_TOLLS = 'Entry and exit tolls collected at the town gates from merchants and travellers.';

/** @type {Record<string, any[]>} */
const BY_TIER = { city: [], metropolis: [], thorp: [], town: [] };

/** Every drawn institution desc a reader sees. */
const drawn = (s) => s.institutions.filter((i) => typeof i.desc === 'string').map((i) => ({ where: i.name, text: i.desc }));
/** Every income line a reader sees (the Economics tab, the PDF). */
const income = (s) => (s.economicState?.incomeSources || []).map((x) => ({ where: x.source, text: x.desc || '' }));

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const tier of Object.keys(BY_TIER)) {
    for (let i = 0; i < PER_TIER; i += 1) {
      BY_TIER[tier].push(generateSettlementPipeline(
        birthConfig({ ...DEFAULT_CONFIG, settType: tier, tradeRouteAccess: 'road' }), null,
        { seed: `tier-noun-pools-${tier}-${i}`, customContent: {} },
      ));
    }
  }
}, 120_000);

describe('the place\'s own noun in drawn institution text', () => {
  test('the arms read the population they claim, and the routed sentences are actually drawn', () => {
    for (const [tier, list] of Object.entries(BY_TIER)) {
      expect(list).toHaveLength(PER_TIER);
      expect(list.every((s) => s.tier === tier)).toBe(true);
    }
    const large = [...BY_TIER.city, ...BY_TIER.metropolis];
    const routed = large.flatMap(drawn).filter(({ text }) => ROUTED.some((rx) => rx.test(text)));
    // Non-vacuity, true before and after the cure: the probe at 39038801 read 10 such lines here.
    expect(routed.length).toBeGreaterThanOrEqual(5);
    // The probe read 8 Gate Tolls lines over these 8 road cities.
    expect(BY_TIER.city.flatMap(income).filter(({ text }) => TOLLS.test(text)).length).toBeGreaterThanOrEqual(4);
  });

  test('no city, metropolis or thorp calls itself a town in a drawn institution desc (every finding an offender)', () => {
    const offenders = [];
    for (const tier of ['city', 'metropolis', 'thorp']) {
      for (const s of BY_TIER[tier]) {
        for (const { where, text } of drawn(s)) {
          for (const f of tierNounFindings(s, text)) offenders.push(`${tier} ${s.name} / ${where}: …${f.context}…`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  test('no city, metropolis or thorp calls itself a town in an income line', () => {
    const offenders = [];
    for (const tier of ['city', 'metropolis', 'thorp']) {
      for (const s of BY_TIER[tier]) {
        for (const { where, text } of income(s)) {
          for (const f of tierNounFindings(s, text)) offenders.push(`${tier} ${s.name} / ${where}: …${f.context}…`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  test('a town\'s Gate Tolls line is the pool\'s own, byte for byte', () => {
    const lines = BY_TIER.town.flatMap(income).filter(({ where }) => where === 'Gate Tolls');
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.filter(({ text }) => text !== TOWN_TOLLS)).toEqual([]);
  });

  test('a town is identity: every drawn institution desc is a pool member verbatim', () => {
    let read = 0;
    const moved = [];
    for (const s of BY_TIER.town) {
      for (const inst of s.institutions) {
        if (typeof inst.desc !== 'string' || inst.isCustom) continue;
        const canonical = institutionalCatalog.town?.[inst.category]?.[inst.name]?.desc;
        if (typeof canonical !== 'string') continue;
        read += 1;
        // 2026-11-04 (soak 1000 row 7, A-11, under the owner's delegation): an inland place whose
        // whole pool speaks of water takes the row's authored inland text (src/data/inlandDescriptions.js).
        // Composed with lane TERRAIN-POOLS on the window branch (chair's ruling P3, as for dossierContent).
        const inland = INLAND_DESCRIPTIONS[`town|${inst.category}|${inst.name}`];
        const pool = [canonical, ...(INSTITUTION_DESC_VARIANTS[`town|${inst.category}|${inst.name}`] || []), ...(inland ? [inland] : [])];
        if (!pool.includes(inst.desc)) moved.push(`${s.name} / ${inst.name}: ${inst.desc}`);
      }
    }
    expect(read).toBeGreaterThan(100);
    expect(moved).toEqual([]);
  });
});

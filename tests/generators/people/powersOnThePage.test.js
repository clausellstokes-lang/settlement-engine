/**
 * powersOnThePage.test.js — COHERENCE-POWERS phase 2B's guard, written first (the chair's charter of 2026-11-11,
 * items 1-3, on the owner's dual-hat law: "they come from an institution, and are elevated yet still tied to an
 * institution").
 *
 *   1. THE FOLD (A-plus): a power of the ruler's own kind that no house stands behind is not a power; its figure
 *      folds into the ruler.
 *   2. THE COUNCIL OF A KIND: a council of a kind is drawn only where the town has a house of that kind, else the
 *      next priority, else the size's civic government. No house is raised.
 *   3. THE POWER WITH NO ONE ON THE PAGE (inside R-P4/R-P5): every power on the roster has a person on the page;
 *      a kinded power no house stands behind is not built, never given a fabricated citizen.
 *
 * Births go through the app's own create boundary (birthConfig: the density law the browser births under) with
 * the browser's dials. RED FIRST at 6f1bf56f7 (2A merged with PRESUME): every seed below carries a power with no
 * member, or an Arcane Council with no arcane house (the causes in
 * docs/chair/2026-11-11/COHERENCE-POWERS-PHASE2B.md). Read-only over the record: no new key is read.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { backingArchetypeOf, RULER_KINDS } from '../../../src/domain/dossier/powerSupport.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';
import { houseKindOf } from '../../../src/generators/people/representatives.js';
import { isHideableHouse } from '../../../src/domain/people/cardVeil.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});

/** The powers the power step's own roster raises from the houses and the priorities (power/rulingStructure.js ::
 *  generatePowerStructure: the merchant, craft, criminal and arcane blocs, the church, the military bloc under either
 *  label, the landed bloc by size), written out here as the guard's own oracle. */
const ROSTER_OWN = Object.freeze(['Merchant Guilds', 'Craft Guilds', "Thieves' Guild", 'Arcane Orders', 'Religious Authorities',
  'Military/Guard', 'Military Party', 'Manor Household', 'Landed Gentry', 'Noble Houses', 'Noble Families']);

/** One or more seeds per cause, measured at 6f1bf56f7 (the phase-2B note's table). */
const FACELESS = Object.freeze([
  'critique-village-6', // the ruler's kin with no house: Religious Authorities under Priestly Guidance (fold)
  'critique-town-38', // the same, Military/Guard under a Military Council (fold)
  'critique-town-9', // the same, Arcane Orders under an Arcane Council (fold)
  'critique-village-27', // the military bloc in a village with no military house (not built)
  'critique-city-17', // the landed bloc and a density rival over one noble house (not built)
  'critique-city-38', // the density law's doubled-niche rival with no house left to deal (not built)
  'critique-city-0', // the same, religious
]);
/** Arcane Councils drawn with no arcane house at 6f1bf56f7. */
const COUNCILS = Object.freeze(['critique-town-0', 'critique-town-40', 'critique-town-47', 'critique-town-108', 'critique-town-159']);

/** @type {Map<string, any>} */
const births = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...FACELESS, ...COUNCILS]) {
    const tier = seed.split('-')[1];
    births.set(seed, generateSettlementPipeline(birthConfig({ ...DIALS, settType: tier }), null, { seed, customContent: {} }));
  }
}, 300_000);

/** @param {any} s @param {string} power @returns {boolean} */
const hasMember = (s, power) => (s.npcs || []).some((card) => (card.memberships || []).some((m) => m.power === power));

describe('COHERENCE-POWERS 2B guard — every power has someone on the page', () => {
  // The rule reaches the roster's own powers and the density law's rivals; a power a stress brings stands whatever
  // the houses say (the residue the phase-2B note names for a ruling: critique-village-9's People's Council,
  // critique-town-46's Reform Congregation, critique-city-17's The Peerage).
  it('every power of the roster\'s own, and every density rival, has a member card', () => {
    const misses = [];
    for (const seed of FACELESS) {
      const s = births.get(seed);
      for (const f of s.powerStructure.factions) {
        if (!f.isGoverning && !ROSTER_OWN.includes(nameOf(f)) && !f.contestsNiche) continue;
        if (!hasMember(s, nameOf(f))) misses.push(`${seed}: ${nameOf(f)} (${backingArchetypeOf(f)})`);
      }
    }
    expect(misses).toEqual([]);
  });

  it('no power of the ruler\'s own kind stands beside it without a house of its own', () => {
    const misses = [];
    for (const seed of FACELESS) {
      const s = births.get(seed);
      const ruler = governingFactionOf(s);
      const kind = ruler ? backingArchetypeOf(ruler) : null;
      if (!kind || !RULER_KINDS.includes(kind)) continue;
      for (const f of s.powerStructure.factions) {
        if (f === ruler || backingArchetypeOf(f) !== kind) continue;
        const housed = (s.npcs || []).some((card) => card.institution?.kind === 'house' && (card.memberships || []).some((m) => m.power === nameOf(f) && m.share > 0));
        if (!housed) misses.push(`${seed}: ${nameOf(f)} beside ${nameOf(ruler)}`);
      }
    }
    expect(misses).toEqual([]);
  });

  it('the roster\'s power is conserved at 100 after the fold', () => {
    const misses = [];
    for (const seed of FACELESS) {
      const sum = births.get(seed).powerStructure.factions.reduce((n, f) => n + (Number(f.power) || 0), 0);
      if (sum !== 100) misses.push(`${seed}: ${sum}`);
    }
    expect(misses).toEqual([]);
  });

  it('no relationship names a power the roster does not carry', () => {
    const misses = [];
    for (const seed of FACELESS) {
      const s = births.get(seed);
      const names = new Set(s.powerStructure.factions.map((f) => nameOf(f)));
      for (const row of s.powerStructure.factionRelationships || []) {
        for (const name of row.pair || []) if (!names.has(name)) misses.push(`${seed}: ${name}`);
      }
    }
    expect(misses).toEqual([]);
  });
});

describe('COHERENCE-POWERS 2B guard — a council of a kind stands on a house of its kind', () => {
  it('a governing power of a kind has an open house of that kind in the town', () => {
    const misses = [];
    for (const seed of COUNCILS) {
      const s = births.get(seed);
      const ruler = governingFactionOf(s);
      const kind = ruler ? backingArchetypeOf(ruler) : null;
      if (!kind || !RULER_KINDS.includes(kind)) continue;
      if (!(s.institutions || []).some((h) => !isHideableHouse(h) && houseKindOf(h) === kind)) misses.push(`${seed}: ${nameOf(ruler)} (${kind})`);
    }
    expect(misses).toEqual([]);
  });

  it('no house is raised: the government named is never an Arcane Council where the roster has no arcane house', () => {
    const misses = [];
    for (const seed of COUNCILS) {
      const s = births.get(seed);
      if (/Arcane/.test(String(nameOf(governingFactionOf(s)))) && !(s.institutions || []).some((h) => houseKindOf(h) === 'arcane')) misses.push(seed);
    }
    expect(misses).toEqual([]);
  });
});

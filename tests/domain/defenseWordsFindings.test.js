/**
 * Lane DEFENSE (2026-11-03): one set of defence facts, and the page checked against it.
 *
 * The corpus is 64 small places (thorp, hamlet, village in turn) born the way the app births
 * them: `birthConfig({ ...DEFAULT_CONFIG, settType })` after `loadGenerationLawPayloads()`,
 * seeds `defense-<tier>-<i>`. The text read is what the Defense tab renders from the writers
 * this lane owns: the five threat rows and their upkeep notes, the supporting-capability
 * rows the tab keeps, and every desk sentence the tab draws at its mounts.
 *
 * ⛔ The owner's word (2026-11-03, verbatim): "Do add storehouse months the economy tab." The
 * chair's ruling: the Defense tab prints NO stored food; its granary/stores row leaves the tab
 * entirely and the Economy tab prints the months once. `defenseFactsOf` keeps
 * `storedFoodMonths` for the certification check only.
 * ⭐ Since X-52 (lane DEFENSE-3) the tab carries ONE "Food endurance" line that reads the food
 * record for a siege and links to the Economy tab's stores row; the silence pin lifts it out.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { defenseWordsFindings } from '../../src/domain/coherence/defenseWordsFindings.js';
import { buildThreatAssessment } from '../../src/domain/display/threatAssessment.js';
import { deriveDefenseReadiness, deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import {
  defenseCriminalProse, defenseForcesProse, defenseMilitaryStatusProse, defensePostureProse,
  defenseStateProse, defenseSupportingProse, defenseThreatProse, defenseWallRationaleProse,
} from '../../src/domain/display/stateProse/defenseStateProse.js';
import { drawnAtMount } from '../../src/domain/display/stateProse/dossierMounts.js';
import { tierNounFor } from '../../src/domain/display/stateProse/weaveBlock.js';
import { deriveCriminalStructure } from '../../src/domain/display/defenseDisplay.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SMALL = ['thorp', 'hamlet', 'village'];

/** Any sentence about stored food or a granary: the Economy tab's fact, never the Defense tab's. */
const STORED_FOOD_RE = /\bgranar(?:y|ies)\b|\bfood (?:reserves|buffer|stored)\b|\b(?:household|common) stores\b|\bstored food\b|\bmonths? (?:of food|in store)\b|\bweeks of food\b|\bput by\b|\bLogistics & Supply\b|\bNo reserves\b/i;

/** @param {string} tier @param {number} i */
function born(tier, i) {
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier }), null, { seed: `defense-${tier}-${i}` });
}

/**
 * The Defense tab's text from the writers this lane owns, drawn the way DefenseTab.jsx draws
 * it (same mounts, same lenses, the same Economic Backing fold).
 * @param {any} r
 * @returns {string[]}
 */
function ownedDefenseText(r) {
  const opts = { seed: String(r?._seed ?? ''), audience: 'dm', tierNoun: tierNounFor(r.tier) };
  /** @type {string[]} */
  const out = [];
  /** @param {string} mount @param {any} rung */
  const say = (mount, rung) => { const s = drawnAtMount(mount, rung)?.sentence; if (s) out.push(s); };
  const desk = defenseStateProse(r, opts);
  if (drawnAtMount('defense.publicOrder', desk.publicOrder?.rung)?.sentence) out.push(desk.publicOrder.beside);
  const posture = defensePostureProse(r, opts);
  if (drawnAtMount('defense.postureHeader', posture.posture?.rung)?.sentence) out.push(posture.posture.beside);
  const status = defenseMilitaryStatusProse(r, opts);
  for (const k of ['override', 'viability']) say('defense.militaryStatus', status[k]);
  const threat = defenseThreatProse(r, opts);
  for (const k of ['beasts', 'invasion', 'internal', 'economic', 'disaster']) say('defense.threatAssessment', threat[k]);
  const forces = defenseForcesProse(r, opts);
  for (const k of ['fortification', 'force', 'contracted', 'charter', 'arcane']) say('defense.armedForces', forces[k]);
  say('defense.wallRationale', defenseWallRationaleProse(r, opts).rationale);
  const supporting = defenseSupportingProse(r, opts);
  for (const k of ['logistics', 'naval']) say('defense.supportingCapabilities', supporting[k]);
  say('defense.criminalStructure', defenseCriminalProse(r, deriveCriminalStructure(r)?.key || null, opts).structure);
  for (const row of buildThreatAssessment(r)) out.push(row.assess);
  for (const row of deriveDefenseReadiness(r)) if (row.fundingNote) out.push(row.fundingNote);
  for (const cap of deriveSupportingCapabilities(r)) if (cap.label !== 'Economic Backing') out.push(`${cap.status}. ${cap.note}`);
  return out.filter(Boolean);
}

/** @type {Array<{ seed: string, settlement: any }>} */
const CORPUS = [];

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (let i = 0; i < 64; i += 1) {
    const tier = SMALL[i % 3];
    CORPUS.push({ seed: `defense-${tier}-${i}`, settlement: born(tier, i) });
  }
}, 120_000);

/** @param {string} seed */
const world = (seed) => {
  const hit = CORPUS.find((row) => row.seed === seed);
  if (!hit) throw new Error(`no corpus world ${seed}`);
  return hit.settlement;
};

describe('defenseFactsOf reads the roster and the engine\'s months', () => {
  it('a hamlet whose only defence is an adventurers\' hall has no garrison, no walls, and its months of food', () => {
    const s = world('defense-hamlet-1');
    const f = defenseFactsOf(s);
    expect(f.hasGarrison).toBe(false);
    expect(f.hasWalls).toBe(false);
    expect(f.hasCharter).toBe(true);
    expect(f.forceName).toBe("Adventurers' charter hall");
    expect(f.storedFoodMonths).toBe(s.economicState.foodSecurity.storageMonths);
    expect(f.storedFoodMonths).toBeGreaterThan(0);
  });

  it('a palisade is an enclosure of timber, not stone walls', () => {
    const f = defenseFactsOf(world('defense-thorp-3'));
    expect(f.hasWalls).toBe(true);
    expect(f.wallKind).toBe('palisade');
    expect(f.hasPalisade).toBe(true);
    expect(f.hasGarrison).toBe(false);
    expect(f.defenceNames).toEqual(['Palisade']);
  });

  // ⭐ RE-KEYED BY IDENTITY (LANDING-7 lane D, 2026-11-06): the healer's village was
  // defense-village-17; the X-46-3 institution budget (compose 90dc22f18) cut it to 8 houses at
  // 124 souls and the healer went with them, so the tab rightly reads "Clergy care". The first
  // village of this corpus that seats the same 'Healer (divine, 1st level)' and no hospital is 47.
  it('a 1st-level healer is a healer and not a hospital', () => {
    const f = defenseFactsOf(world('defense-village-47'));
    expect(f.hasHospital).toBe(false);
    expect(f.hasHealer).toBe(true);
    expect(f.healerName).toBe('Healer (divine, 1st level)');
  });

  it('a citizen militia is the force when nothing outranks it; a real hospital is a hospital', () => {
    const f = defenseFactsOf({ institutions: [{ name: 'Citizen militia' }, { name: 'Small hospital' }] });
    expect(f.hasMilitia).toBe(true);
    expect(f.forceName).toBe('Citizen militia');
    expect(f.hasHospital).toBe(true);
    expect(f.storedFoodMonths).toBeNull();
  });
});

describe('defenseWordsFindings', () => {
  it('a garrison sentence planted on a place with no garrison is found', () => {
    const s = world('defense-hamlet-1');
    const found = defenseWordsFindings(s, 'The garrison drills at dawn. The hall posts bounties.');
    expect(found.length).toBeGreaterThanOrEqual(1);
    expect(found[0].term).toBe('garrison');
  });

  it('a sentence that states the absence is not a finding', () => {
    const s = world('defense-hamlet-1');
    expect(defenseWordsFindings(s, 'No walls or garrison. Better than nothing, well short of a hospital.')).toEqual([]);
    expect(defenseWordsFindings(s, 'It could keep soldiers and does not.')).toEqual([]);
  });

  it('"no food reserves" is found while the engine holds months of food', () => {
    const s = world('defense-hamlet-1');
    expect(defenseWordsFindings(s, 'No food reserves. A crop failure causes immediate hardship.')
      .map((f) => f.term)).toEqual(['no food stored']);
  });
});

describe('the Defense tab says only what the place has', () => {
  it('the charter-hall hamlet no longer prints "garrison pay" beside "No walls or garrison"', () => {
    const s = world('defense-hamlet-1');
    const row = deriveDefenseReadiness(s).find((r) => r.label === 'Invasion & War');
    // anchored: the next line pins the same note's whole text
    expect(row.fundingNote).not.toMatch(/garrison pay/);
    expect(row.fundingNote).toMatch(/^Upkeep underfunded: defence upkeep for the adventurers' charter hall at \d+%$/);
  });

  it('a palisade never pays "garrison pay": the note names the palisade', () => {
    const row = deriveDefenseReadiness(world('defense-thorp-3')).find((r) => r.label === 'Invasion & War');
    expect(row.fundingNote).toMatch(/^Upkeep underfunded: defence upkeep for the palisade at \d+%$/);
  });

  it('"Hospital present" only with a real hospital; a healer is named as a healer', () => {
    const s = world('defense-village-47'); // re-keyed from 17 with the arm above (X-46-3 budget)
    const med = deriveSupportingCapabilities(s).find((c) => c.label === 'Medical Readiness');
    expect(med.status).toBe('Healer');
    expect(med.note).toContain('Healer (divine, 1st level)');
    const disaster = buildThreatAssessment(s).find((r) => r.label === 'Disasters & Famine').assess;
    // anchored: the row was found by its label (a missing row throws on .assess) and the healer is named above
    expect(disaster).not.toMatch(/Hospital/);
  });

  it('the Defense tab\'s rendered text carries no stored-food or granary sentence except the one Food endurance line (the owner\'s words: stored food is the Economy tab\'s; its siege reading is Food endurance)', () => {
    // The tab's own markup (React SSR; collapsed rows are not in it) PLUS every row the tab
    // renders on expansion, drawn the way the tab draws it.
    // ⭐ X-52 (lane DEFENSE-3; the owner, 2026-11-03: "i think stored food should have a version
    // or reference in defense because that is a major compoenent of a siege warfare", then "call
    // it food endurance rather than siege endurance"): ONE line reads the food record for a
    // siege and is a door to the Economy tab's stores row (tests/domain/foodEnduranceLine.test.js
    // pins it). It is lifted out, once, and everything else stays silent about stored food.
    expectNoSeedFailures(collectSeedFailures(CORPUS, ({ seed, settlement }) => {
      const html = renderToStaticMarkup(React.createElement(DefenseTab, { settlement }));
      const enduranceLines = html.match(/<p data-testid="defense-food-endurance"[\s\S]*?<\/p>/g) || [];
      expect(enduranceLines, seed).toHaveLength(1);
      const markup = html.replace(enduranceLines[0], ' ')
        .replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
      const text = [markup, ...ownedDefenseText(settlement)].join('\n');
      expect(text, seed).toMatch(/\bDisasters & Famine\b/);
      // anchored: the same text matched Disasters & Famine on the line above
      expect(text, seed).not.toMatch(STORED_FOOD_RE);
    }), 'no stored-food sentence beside the one Food endurance line');
  });

  it('over 64 small places, no owned Defense sentence claims a defence, a hospital or an empty store the record lacks', () => {
    const offenders = CORPUS
      .map(({ seed, settlement }) => ({ seed, found: defenseWordsFindings(settlement, ownedDefenseText(settlement)) }))
      .filter((row) => row.found.length > 0)
      .map((row) => `${row.seed}: ${row.found.map((f) => `[${f.term}] ${f.sentence}`).join(' | ')}`);
    expect(offenders).toEqual([]);
  });
});

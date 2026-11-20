/**
 * npcStructureBody.test.js — POWERS-9 (ROUND-3-CUT-INCREMENT, npcStructure.js, 14 medium lines still printing at
 * 96a6ced46: pf#65 #77 #105 #246 #491 #530 #595 #596 #636 #662 #663 #797 #799 #831): A STRUCTURAL ROW THAT SPEAKS OF THE
 * CARD'S OWN BODY IS THE CARD'S ONLY WHERE ITS FIRST-RANK POWER IS THAT BODY. "Heads an old family" on a smith heading the
 * Grain Holders and on a charter master heading the Military/Guard; "Belongs to a lesser old family, behind the leading
 * one" on a master smith heading the Craft Guilds; "Holds an office whose purse shrinks with everyone else's" on the
 * occupier's governor (the Occupation Authority, a military power); "Works spells under the senior casters" on the town's
 * only caster, in the Corrupt Council; "Holds a place under the crew's boss" on a lone outlaw in no power; and "Leads a
 * squad ..." on the garrison commander who HEADS a military power. The rows are generators/npcStructure.js :: T (reg);
 * the gate is BODY_KINDS / inItsBody, and the armed rows join UNDER_KINDS (the head of the strongest armed power reads
 * "Commands those under arms ...", the head of a lesser one no row).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { POSITION_VARIANTS } from '../../src/data/npcStructureVariants.js';
import { readFileSync } from 'node:fs';

// PEOPLE-1 B1c (the chair's ruling of 20:30 UTC): a pool's index 0 is the writer's own `T` row, its one home; read from the
// writer's table, SLICED FROM ITS FILE and evaluated (`npcPositionPools.test.js`'s method; never retyped)
const WRITER = readFileSync(new URL('../../src/generators/npcStructure.js', import.meta.url), 'utf8');
const cutT = (/** @type {string} */ from, /** @type {string} */ to) => { const a = WRITER.indexOf(from); const b = WRITER.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`slice ${from}`); return WRITER.slice(a, b); };
/** @type {Record<string, { position: string, constraint: string }>} */
const { T } = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from([cutT('const GOVERNANCE_FRACTURED', 'function getPrimaryCondition'), cutT('const T = {};', '// ── Score NPCs'), 'export { T };'].join('\n')).toString('base64')}`);

/** PEOPLE-1 B1: a pooled row's member, by identity (a `{slot}` reads as any fill); the pool as the writer composes it (B1c:
 * [the T row's own line, ...the data pool]). @param {string} key @param {unknown} text */
const memberOf = (key, text) => [{ text: T[key].position }, ...POSITION_VARIANTS[key]].some((r) => new RegExp(`^${r.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{(?:house|export|import)\\\}/g, '.+')}$`).test(String(text)));

/** @param {string} seed the readers' shape (rpf-/rw3-: DEFAULT_CONFIG, Random off for crises) */
function born(seed) {
  const m = seed.match(/^(?:rpf|rw3)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-\d+$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}
const BODY = { other: ['noble'], religious: ['religious'], criminal: ['criminal'], magic: ['magic'] };
const OLD_FAMILY = /old famil|lesser family|greater family|old names/;
const UNDER = /under its leaders|under the senior casters|under the crew's boss|in a crew|Works spells|Serves the faith|Holds a place/;

/** The card's first-rank power record. @param {any} card @param {any} s */
function firstPower(card, s) {
  const m = [...(card.memberships || [])].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))[0];
  return m ? (s.powerStructure?.factions || []).find((f) => f.faction === m.power) || null : null;
}

describe('POWERS-9 · a structural row of the card\'s own body', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('every reader\'s town prints none of its cured rows', () => {
    expectNoSeedFailures(collectSeedFailures([
    ['rpf-hamlet-famine-13', 'Heads an old family while the seat fails'],
    ['rpf-village-succession_void+famine-13', 'Heads an old family while the seat fails'],
    ['rpf-city-occupied-13', "Holds an office whose purse shrinks with everyone else's."],
    ['rpf-village-occupied-13', "Holds an office whose purse shrinks with everyone else's."],
    ['rpf-metropolis-occupied-13', "Holds an office whose purse shrinks with everyone else's."],
    ['rpf-town-succession_void-13', 'Works spells under the senior casters, among officials who take bribes.'],
    ['rpf-town-politically_fractured-13', 'Belongs to a lesser family behind the leading one while the seat fails.'],
    ['rpf-metropolis-politically_fractured-13', 'Leads a squad whose members are being pulled toward one side'],
    ['rpf-thorp-succession_void-13', "Holds a place under the crew's boss while the seat fails."],
    ['rpf-town-calm-13', 'Leads a squad in quiet times, where the work is routine and the risks are low.'],
    ['rpf-town-calm-13', 'Belongs to a lesser old family, behind the leading one.'],
    ['rpf-metropolis-wartime-13', 'Leads a squad whose members are being pulled toward one side'],
  ], ([seed, line]) => {
    const s = born(seed);
    expect(s.npcs.filter((c) => String(c.structuralPosition || '').startsWith(line)).map((c) => `${c.name}, ${c.title}`)).toEqual([]);
    expect(s.npcs.length, 'premise: the roster is live').toBeGreaterThan(0);
    for (const c of s.npcs) {
      const kinds = BODY[c.category];
      const fp = firstPower(c, s);
      if (kinds && c.structuralPosition && !(fp && kinds.includes(fp.category))) {
        expect(`${c.title}: ${c.structuralPosition}`).not.toMatch(c.category === 'other' ? OLD_FAMILY : UNDER); // anchored: the subject is built here from a card whose row is set (the if's guard); the roster is asserted live above
      }
      if (c.category === 'military' && c.structuralRank === 'head') expect(String(c.structuralPosition || '')).not.toMatch(/^Leads a squad/); // anchored: a sweep of the head's own row; the roster is asserted live above
    }
  }), 'every reader\'s town prints none of its cured rows');
  }, 720_000);

  it('THE GUARD: the true rows still print (the head of the town\'s one armed power; a noble body\'s lesser member)', () => {
    const calm = born('rpf-town-calm-13');
    // RE-KEYED BY IDENTITY (PEOPLE-1 B1, 2026-11-20, the chair's ruling of 16:41 UTC): the armed head's calm row is pooled
    // (`data/npcStructureVariants.js :: POSITION_VARIANTS`); the head of the town's one armed power prints a member of it
    expect(memberOf('military__stable__dominant', calm.npcs.find((c) => c.name === 'Osterhild Gärtner')?.structuralPosition), 'the armed head\'s row').toBe(true);
    // the census's 720 shape (SECOND-WAVE-CENSUS births: every random dial on)
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
      selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'town' }), null, { seed: 'r2r-town-48', customContent: {} });
    const miller = town.npcs.find((c) => c.title === 'the miller' && firstPower(c, town)?.category === 'noble');
    expect(miller?.structuralPosition).toBe('Belongs to a lesser old family, behind the leading one.');
  }, 60_000);
});

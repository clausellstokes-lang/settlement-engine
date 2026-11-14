/**
 * ROUND THREE (the chair's ruling on the increment's #176, #303 and #856; ROUND-3-CUT-INCREMENT at fe6d5b741): ONE HOME FOR
 * WHAT A PERSON WANTS — the person's own goal, as the card prints it. The Tonight sheet printed the crisis role's line
 * (CAST_WANTS) over the card's own goal:
 *   rpf-metropolis-wartime-13   Narantuya Tanghud (defends): "Wants to hold the line through the war with fewer hands than
 *                               the line needs." — her card: "Find one person willing to speak against Dogshin Kipchak …";
 *   rpf-city-succession_void+politically_fractured-13  Drusilla Pacuvius (instigator): "Wants to keep the pressure on until
 *                               the seat gives way …" where the seat has given way;
 *   rpf-village-politically_fractured-13  Eudoxia Bryennios (instigator): "Wants to use this crisis to take the seat for
 *                               themselves." — her card: "Pay someone back for a wrong done to them."
 * Measured on the census's 720 and the readers' 80 (app shape) at 0570b3441: 406 of 427 cast people carry a goal of their
 * own, every one overprinted. The role's line now prints only for a cast person whose card carries none (the 21 there,
 * every one a minted temporary lever-holder: the GUARD towns below), and only where the town leaves it true.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CAST_WANTS, castWantOf, composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';
import { crisisCastSenseFindings } from '../../src/domain/coherence/crisisFactFindings.js';

/** The readers' shape (rpf-: the increment's render.rw3.jsx) and the census's (r2s-: births.mjs). */
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
function cfgFor(seed) {
  let m = seed.match(/^rpf-(\w+)-([a-z_+]+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  throw new Error(seed);
}
const READERS = ['rpf-metropolis-wartime-13', 'rpf-city-succession_void+politically_fractured-13', 'rpf-village-politically_fractured-13'];
// GUARD towns: a cast person with no goal of their own still voices the role's line (the minted temporary lever-holders).
const GUARDS = ['r2s-plague_onset-thorp-0', 'r2s-monster_pressure-village-1'];
/** @type {Record<string, any>} */
const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...READERS, ...GUARDS]) born[seed] = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
}, 300_000);

/** Does the card carry a goal of its own (what it prints after "Wants")? @param {any} npc */
const hasOwnGoal = (npc) => !!String((npc?.goal && typeof npc.goal === 'object' ? (npc.goal.short || npc.goal.long) : npc?.goal) || '').trim();
/** @param {unknown} v */
const bare = (v) => String(v || '').replace(/^to\s+/i, '').replace(/[.!?]$/, '').toLowerCase();
/** @param {any} s @param {string} name */
const npcNamed = (s, name) => (s.npcs || []).find((n) => n.name === name);

describe('ROUND THREE · the Tonight sheet voices a cast person with the card\'s own goal', () => {
  it('the readers\' three towns: each cast person with a goal of their own wants that goal, never a role\'s line', () => {
    for (const seed of READERS) {
      const s = born[seed];
      const cast = composeTonightSheet(s).people.filter((p) => p.why === 'cast');
      expect(cast.length, seed).toBeGreaterThan(0);
      for (const p of cast) {
        const npc = npcNamed(s, p.name);
        expect(hasOwnGoal(npc), `${seed} ${p.name}`).toBe(true);
        if (p.says === 'want') expect(bare(p.line), `${seed} ${p.name}`).toBe(bare(npc.goal.short || npc.goal.long));
      }
    }
  });

  it('the three lines the reader read are gone, and the cards\' own goals print in their place', () => {
    const by = (seed, name) => composeTonightSheet(born[seed]).people.find((p) => p.name === name);
    expect(by('rpf-metropolis-wartime-13', 'Narantuya Tanghud')?.line).toMatch(/^find one person willing to speak against /);
    expect(by('rpf-city-succession_void+politically_fractured-13', 'Drusilla Pacuvius')?.line).toMatch(/^ask Plancus Publicola for a favour /);
    expect(by('rpf-village-politically_fractured-13', 'Eudoxia Bryennios')?.line).toBe('pay someone back for a wrong done to them.');
  });

  it('GUARD: a cast person whose card carries no goal still voices the role\'s line, true of the role', () => {
    for (const seed of GUARDS) {
      const s = born[seed];
      const p = composeTonightSheet(s).people.find((x) => x.why === 'cast' && !hasOwnGoal(npcNamed(s, x.name)));
      expect(p, seed).toBeDefined();
      expect(p.says, seed).toBe('want');
      expect(p.line, seed).toMatch(/^(decide who gets the|share out the) (medicine|guards)/);
    }
  });

  it('the Tonight cast reads back clean: no want over a goal, no role line the writer would not fill', () => {
    for (const seed of [...READERS, ...GUARDS]) {
      expect(crisisCastSenseFindings(born[seed]).filter((f) => /^want_not_/.test(f.detail)), seed).toEqual([]);
    }
  });
});

describe('ROUND THREE · a role\'s line is said only where the town leaves it true (castWantOf)', () => {
  it('a seat that stands empty never "gives way" or "fails": the pool resolves draw-free to the line that holds', () => {
    for (const id of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      const held = castWantOf('instigator', id, 'succession_void', '', 'Noble Families');
      const empty = castWantOf('instigator', id, 'succession_void', '', 'Noble Families', { seatEmpty: true });
      expect(CAST_WANTS.instigator).toContain(held);
      expect(empty).toBe(CAST_WANTS.instigator[1]);
    }
  });
  it('a line naming the person\'s house is never said of a person with none ("their house")', () => {
    for (const id of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      const lever = castWantOf('lever', id, 'famine', '', '');
      const defender = castWantOf('defender', id, 'under_siege', '', '');
      expect(defender).toBe('hold the line through the siege with fewer hands than the line needs.');
      expect(lever).toMatch(/^(decide who gets the food|share out the food)/);
      // anchored: both lines are asserted to their exact admitted text on the two lines just above
      expect([lever, defender].join(' ')).not.toMatch(/their house|\{house\}/);
    }
  });
  it('the raids never "takes": a singular verb is not said of a plural crisis', () => {
    for (const id of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      const want = castWantOf('brunt', id, 'monster_pressure', '', 'Elder Council');
      expect(want).toMatch(/the people of the Elder Council/);
      // anchored: the same want is asserted to name its house on the line just above
      expect(want).not.toMatch(/the raids takes/);
    }
  });
});

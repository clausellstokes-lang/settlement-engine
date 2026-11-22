/**
 * F10 WALLS-WORD (rung 1C, 2026-11-04): the dossier's state prose names walls only where the
 * place keeps walls.
 *
 * The rung-1C stop's three seeds (`soak1k-24`, `soak1k-92`, `soak1k-336`) are thorps and a
 * village under siege with no enclosure on their roster, and DS-POW-2's `siege matched` pool
 * printed "the walls have settled the argument" and "decided outside the walls rather than
 * inside them" over them. The cure is ONE gate: the kernel's `walls` state dimension (law 5,
 * fail-closed), answered at every desk entry by `defenseFactsOf(settlement).hasWalls` through
 * `wallsAnswered`. A variant that prints the place's walls carries the `walls` mark; its
 * wall-free twin carries `no walls`.
 *
 * The fixtures are hand-trimmed from the three births at `64aeda874` (the name, tier, seed,
 * stability label and governing name the desk reads; the roster that holds no enclosure).
 */
import { describe, it, expect } from 'vitest';
import { powerStateProse } from '../../src/domain/display/stateProse/powerStateProse.js';
import { defenseFactsOf, wallsAnswered, wallsDimensionOf } from '../../src/domain/defense/defenseFacts.js';
import { defenseWordsFindings } from '../../src/domain/coherence/defenseWordsFindings.js';
import { eligibleVariants, speakTierNoun, STATE_MARK_DIMENSIONS } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { variantByVid } from '../helpers/drawnProse.js';
import { UNMOUNTED_BLOCKS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

/** CENSUS-5: the no-walls read hands facts too (a pool may declare fact atoms): calm, every presence fact held but the perimeter. */
// W4 PEOPLE second seat 2026-11-07: + the migration's birth direction, so a walls pool that also declares its
// direction (DS-STR-1 MASS MIGRATION, WAVE-RULINGS item 8) is read as a real record reads it, not muted by
// an atom the calm double does not carry.
const NO_WALLS_FACTS = Object.freeze({ ...CALM_FACTS_ADMIT_ALL, migration: Object.freeze({ active: true, direction: 'influx' }), defence: Object.freeze({ ...CALM_FACTS_ADMIT_ALL.defence, walls: false, wallKind: null, palisade: false, gate: false }) });

const SIEGE = 'Critical (under siege)'; // W3 POW: the producer's words of 2026-11-07

/** The three births, trimmed to what the stability header reads. */
const BIRTHS = Object.freeze([
  { seed: 'soak1k-24', name: 'Grüngrund', tier: 'thorp', governingName: 'Priestly Guidance' },
  { seed: 'soak1k-92', name: 'Caerbury', tier: 'village', governingName: 'Elder Council' },
  { seed: 'soak1k-336', name: 'Unterkoppel', tier: 'thorp', governingName: 'Elder Council' },
]);

/**
 * The DS-POW-2 `siege matched` member each birth draws, by vid (computed, never a literal
 * sentence: `tests/lint/proseDrawnAnchors.walker.test.js`). At the base the wall lines v1
 * (`[street]`) and v4 (`[unfolding]`); after the cure their `no walls` twins v5 and v6.
 */
const DRAWN = Object.freeze({
  'soak1k-24': { base: 4, cure: 5 },
  'soak1k-92': { base: 1, cure: 5 },
  'soak1k-336': { base: 4, cure: 6 },
});

/** @param {typeof BIRTHS[number]} b @param {number} vid */
function member(b, vid) {
  const text = variantByVid({
    leaf: 'power', blockId: 'DS-POW-2', poolKey: 'siege matched', vid,
    slots: { settlement: b.name, faction: b.governingName },
  });
  return speakTierNoun(text, b.tier);
}

/** @param {typeof BIRTHS[number]} b @param {ReadonlyArray<object>} institutions */
function fixture(b, institutions) {
  return {
    name: b.name,
    tier: b.tier,
    _seed: b.seed,
    institutions,
    powerStructure: { stability: SIEGE, governingName: b.governingName },
  };
}

/** @param {object} s @param {string} seed @param {string} tier */
function headerOf(s, seed, tier) {
  const prose = powerStateProse(/** @type {any} */ (s), {}, { seed, audience: 'player', tierNoun: tier });
  return prose.stabilityHeader?.sentence ?? null;
}

const WALL_TERM = /\b(?:walls|walled)\b/i;

describe('F10 · the siege header speaks of walls only where walls stand', () => {
  it('the three rung-1C births print a wall-free siege line', () => {
    for (const b of BIRTHS) {
      const s = fixture(b, []);
      expect(defenseFactsOf(s).hasWalls).toBe(false);
      const line = headerOf(s, b.seed, b.tier);
      expect(line, b.seed).toEqual(expect.any(String));
      expect(line, b.seed).not.toMatch(WALL_TERM); // anchored: two lines down pins the line to the drawn cure member, so it is live text
      expect(defenseWordsFindings(s, line), b.seed).toEqual([]);
      expect(line, b.seed).toBe(member(b, DRAWN[b.seed].cure));
    }
  });

  it('a walled place keeps the line it printed before, to the byte', () => {
    // The control: the same three, given a palisade. The eligible set is unchanged for them
    // (the `walls` variants and every unmarked one), so the index-stable draw is unchanged.
    for (const b of BIRTHS) {
      const s = fixture(b, [{ name: 'Palisade', category: 'Defense' }]);
      expect(defenseFactsOf(s).hasWalls).toBe(true);
      expect(headerOf(s, b.seed, b.tier), b.seed).toBe(member(b, DRAWN[b.seed].base));
      expect(member(b, DRAWN[b.seed].base)).toMatch(WALL_TERM);
    }
  });
});

/** Every state leaf, by name. */
const LEAVES = Object.freeze({
  power: DOSSIER_STATE_PROSE_POWER,
  general: DOSSIER_STATE_PROSE_GENERAL,
  economy: DOSSIER_STATE_PROSE_ECONOMY,
  stressors: DOSSIER_STATE_PROSE_STRESSORS,
  warFaith: DOSSIER_STATE_PROSE_WAR_FAITH,
  defense: DOSSIER_STATE_PROSE_DEFENSE,
});

/**
 * The DS-DEF pools whose own desk key already requires an enclosure (`defenseStateProse.js ::
 * beastsRowPoolKey` / `invasionRowPoolKey` read `perimeter` / `walls`; DS-DEF-5's `walls
 * PRESENT` and DS-DEF-11's `WALLED-QUIET` are keyed on the walls bucket). Their wall words are
 * gated by the pool key, not by a mark.
 */
const GATED_BY_KEY = Object.freeze([
  'DS-DEF-2 :: Beasts & Monsters: plagued, perimeter AND organized force',
  'DS-DEF-2 :: Beasts & Monsters: plagued, perimeter but NO force to hold it',
  'DS-DEF-2 :: Beasts & Monsters: settled, defenses beyond the need',
  'DS-DEF-2 :: Invasion & War: walls AND professional garrison',
  'DS-DEF-2 :: Invasion & War: walls with citizen militia',
  'DS-DEF-2 :: Invasion & War: walls with NO force',
  'DS-DEF-5 :: walls PRESENT',
  'DS-DEF-11 :: WALLED-QUIET',
]);

describe('F10 · every mounted variant that names walls is gated', () => {
  it('the kernel carries the walls dimension', () => {
    expect(STATE_MARK_DIMENSIONS.walls).toEqual(['walls', 'no walls']);
    // The reader spells the kernel's two words (it does not import the kernel).
    expect(wallsDimensionOf({ institutions: [] })).toBe('no walls');
    expect(wallsDimensionOf({ institutions: [{ name: 'Massive Walls', category: 'Defense' }] })).toBe('walls');
    expect(wallsAnswered({ institutions: [] }, { seed: 's', dimensions: { deficit: 'deficit' } }))
      .toEqual({ seed: 's', dimensions: { deficit: 'deficit', walls: 'no walls' } });
  });

  it('names walls only behind the walls mark or a walls pool key, and the no-walls read stays wall-free and speaks', () => {
    const ungated = [];
    const leaky = [];
    const mute = [];
    let marked = 0;
    for (const [leaf, corpus] of Object.entries(LEAVES)) {
      for (const [id, block] of Object.entries(corpus)) {
        if (UNMOUNTED_BLOCKS.includes(id)) continue;
        for (const [key, pool] of Object.entries(block.pools)) {
          if (GATED_BY_KEY.includes(`${id} :: ${key}`)) continue;
          for (const v of pool) {
            if (!WALL_TERM.test(v.text)) continue;
            if ((v.marks || []).includes('walls')) marked += 1;
            else ungated.push(`${leaf} :: ${id} :: ${key} :: v${v.vid}`);
          }
          if (!pool.some((v) => (v.marks || []).includes('walls'))) continue;
          const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
          const read = eligibleVariants(pool, { slots, audience: 'dm', dimensions: { walls: 'no walls' }, facts: NO_WALLS_FACTS });
          if (read.length === 0) mute.push(`${id} :: ${key}`);
          for (const v of read) if (WALL_TERM.test(v.text)) leaky.push(`${id} :: ${key} :: v${v.vid}`);
        }
      }
    }
    expect({ ungated, leaky, mute }).toEqual({ ungated: [], leaky: [], mute: [] });
    // Non-vacuity, measured at the cure: the marked variants the audit table lists.
    expect(marked).toBeGreaterThanOrEqual(35);
  });
});

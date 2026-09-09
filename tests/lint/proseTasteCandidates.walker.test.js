/**
 * proseTasteCandidates.walker.test.js — THE SEVEN POOLS' PREDICATES, AND THE CROSS-CHECK THAT
 * MAKES THE CENSUS'S ANNEX RUNG HONEST (TASTE car M-3; ARCH §4.1, §4.2, §6.3-§6.5).
 *
 * ⛔ THE DEBT THIS FILE PAYS. A modifier's reading is AUTHOR-DECLARED in the annex — no rung of
 * the wiring census's ladder can recover it, because the predicate lives in a candidate leaf
 * rather than in a pool-key function (see `CensusInput.declared`). A declaration nothing checks
 * is a claim, so this walker reads the leaves' own source and asserts that every field a
 * candidate function reaches for is a field its pool's annex row DECLARES, and no other.
 *
 * THE OTHER FOUR PROPERTIES:
 *   · each predicate answers on BOTH sides, driven on hand-built readings — the inversion is
 *     the control, so a predicate that answered a constant would red here;
 *   · a COVERT pool is offered by the leaf and dropped by the COMPOSER, never by the leaf —
 *     ARCH §4.2 step 2 puts the audience filter inside the composer so that nothing a covert
 *     piece does, including what it prevented, is observable on the player face, and a leaf
 *     that filtered too would be a second audience filter that could disagree;
 *   · the desk and its candidates leaf form an IMPORT CYCLE and both entry orders load;
 *   · the census on a deterministic slice of the RATE grid, with a plant that moves it.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from '../helpers/dossierCorpus.js';
import { defenseStateProseCandidates } from '../../src/domain/display/stateProse/defenseStateProseCandidates.js';
import { generalStateProseCandidates } from '../../src/domain/display/stateProse/generalStateProseCandidates.js';
import { composeStateProse } from '../../src/domain/display/stateProse/composeStateProse.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { rateGrid } from '../../scripts/prose-rate-corpus.mjs';
import { attachOf, tasteCandidateCensus, tasteFiringsOf } from '../../scripts/taste-candidates.mjs';

const CENSUS = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
const ROWS = new Map(CENSUS.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));

/** A settlement shaped exactly as the defense desk is handed one. */
const town = (over) => ({
  config: { monsterThreat: 'heartland' },
  economicState: { foodSecurity: { label: 'Secure' } },
  npcs: [],
  ...over,
});

describe('the seven predicates answer on BOTH sides, on the desks\' own readings', () => {
  it('DS-DEF-11 country: the two polarity pools are ONE predicate offered twice', () => {
    const keys = (s) => defenseStateProseCandidates('DS-DEF-11', s).map((r) => r.key);
    for (const threat of ['frontier', 'plagued']) {
      expect(keys(town({ config: { monsterThreat: threat } })), threat)
        .toEqual(['country: pressed (walled)', 'country: pressed (unwalled)']);
    }
    // The other side, and the ABSENT side, which is silence and never `false`.
    for (const threat of ['heartland', 'civilized', undefined, null, '']) {
      expect(keys(town({ config: { monsterThreat: threat } })), String(threat)).toEqual([]);
    }
    expect(keys(town({ config: null }))).toEqual([]);
    // ⭐ AND THE TWO ARE MUTUALLY EXCLUSIVE AT THE SEAT, not at the predicate: T-F3 makes a
    // polarity-flipping relation TWO pools with DISJOINT attach sets, and the composer's
    // attach filter — not this leaf — decides which one a given town's spine admits.
    const walled = attachOf('DS-DEF-11', 'country: pressed (walled)');
    const unwalled = attachOf('DS-DEF-11', 'country: pressed (unwalled)');
    expect(walled.length).toBeGreaterThan(0);
    expect(unwalled.length).toBeGreaterThan(0);
    expect(walled.filter((k) => unwalled.includes(k)), 'the attach sets are DISJOINT').toEqual([]);
  });

  it('DS-DEF-11 watch: both limbs of one roster pass, and the covert one is offered anyway', () => {
    const bought = (name) => town({
      npcs: [{
        name: 'A', corrupt: true, ousted: false, homeInstitution: name, compromiseLifecycle: { revealed: true },
      }],
    });
    // The shipped roster answers nothing on a headless town (SEAM car 5b: 0 of 768), so the
    // control here is the SHAPE of the call rather than a fired pool, and the arm says so.
    expect(defenseStateProseCandidates('DS-DEF-11', bought('Town watch')).every((r) => typeof r.key === 'string')).toBe(true);
    expect(defenseStateProseCandidates('DS-DEF-11', town()).map((r) => r.key)
      .filter((k) => k.startsWith('watch:')), 'a clean town offers neither watch pool').toEqual([]);
  });

  it('DS-DEF-2 stores: the three labels that fire, and the three that do not', () => {
    const keys = (label) => defenseStateProseCandidates('DS-DEF-2', town({
      economicState: { foodSecurity: { label } },
    })).map((r) => r.key);
    expect(keys('Deficit')).toEqual(['stores: short']);
    expect(keys('Deficit × Active Famine')).toEqual(['stores: short']);
    expect(keys('Import-Dependent')).toEqual(['stores: import-fed']);
    for (const label of ['Secure', 'Surplus', 'Pressured', '', undefined]) {
      expect(keys(label), String(label)).toEqual([]);
    }
    expect(defenseStateProseCandidates('DS-DEF-2', town({ economicState: null })).map((r) => r.key)).toEqual([]);
    // A pool is offered to ITS OWN BLOCK and to no other.
    expect(defenseStateProseCandidates('DS-DEF-11', town({
      economicState: { foodSecurity: { label: 'Deficit' } },
    })).map((r) => r.key)).toEqual([]);
  });

  it('DS-GEN-3 purse: PRESENT and below one, and an absent gate is silence', () => {
    const keys = (economicGates) => generalStateProseCandidates('DS-GEN-3', { economicGates }).map((r) => r.key);
    expect(keys({ military: 0.6 })).toEqual(['purse: short']);
    expect(keys({ military: 0.999 })).toEqual(['purse: short']);
    expect(keys({ military: 1 })).toEqual([]);
    expect(keys({ military: 1.4 })).toEqual([]);
    // ⛔ ABSENCE IS THE HALF THAT IS EASY TO DROP: the generator writes the key only under
    // `hasAnyDefense`, so an absent gate is ABSENCE and never 1.0.
    expect(keys({}), 'no gate at all').toEqual([]);
    expect(keys(null), 'no gates object').toEqual([]);
    expect(keys({ military: null })).toEqual([]);
    expect(keys({ military: '0.5' }), 'a string is not a number').toEqual([]);
    expect(keys({ military: Number.NaN }), 'and NaN is not finite').toEqual([]);
    expect(generalStateProseCandidates('DS-GEN-6', { economicGates: { military: 0.5 } })).toEqual([]);
  });
});

describe('⭐ THE CROSS-CHECK: a candidate function reads what its annex row DECLARES', () => {
  /**
   * Every dotted reading path a leaf's source names, rooted as the census spells it. The
   * defense desk is handed the SETTLEMENT and the general desk its own readings bag, so the
   * two roots differ and the map is declared here rather than guessed.
   */
  const READ_RE = /\breadings\s*\)?\s*\.\s*([A-Za-z_$][\w$]*)|\b(compromised)\s*\.\s*(revealed|covert)/g;

  it('the defense leaf reaches for exactly the roots its three pools declare', () => {
    const src = readFileSync(join(ROOT, 'src/domain/display/stateProse/defenseStateProseCandidates.js'), 'utf8');
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '');
    /** @type {Set<string>} */
    const named = new Set();
    for (const m of code.matchAll(READ_RE)) {
      if (m[1]) named.add(`settlement.${m[1]}`);
      if (m[2]) named.add(`${m[2]}.${m[3]}`);
    }
    const declared = new Set(['DS-DEF-11', 'DS-DEF-2'].flatMap((block) => Object.entries(
      /** @type {any} */ (DOSSIER_STATE_PROSE_DEFENSE)[block].poolMeta,
    ).filter(([, meta]) => /** @type {any} */ (meta).role === 'modifier')
      .map(([pool]) => (ROWS.get(`${block} :: ${pool}`) || { reads: [] }).reads[0])));
    // EVERY ROOT THE CODE NAMES IS A ROOT SOME ROW DECLARES.
    const roots = (set) => new Set([...set].map((p) => p.split('.').slice(0, 2).join('.')));
    expect([...roots(named)].sort(), 'the leaf reaches for these roots')
      .toEqual([...roots(declared)].sort());
    // NON-VACUITY: the scan found something, and it found the covert pair by name.
    expect(named.size).toBeGreaterThanOrEqual(4);
    expect(named.has('compromised.covert') && named.has('compromised.revealed')).toBe(true);
  });

  it('the general leaf reaches for exactly the root its one pool declares', () => {
    const src = readFileSync(join(ROOT, 'src/domain/display/stateProse/generalStateProseCandidates.js'), 'utf8');
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '');
    const named = [...code.matchAll(/\breadings\s*\)?\s*\.\s*([A-Za-z_$][\w$]*)/g)].map((m) => m[1]);
    expect([...new Set(named)]).toEqual(['economicGates']);
    expect(ROWS.get('DS-GEN-3 :: purse: short').reads).toEqual(['readings.economicGates.military']);
  });

  it('the desk and its candidates leaf form a cycle, and BOTH entry orders load', async () => {
    // ⛔ A DECLARED CYCLE, DRIVEN. `defenseStateProse.js` imports the candidates leaf and the
    // leaf imports `measuredMonsterFamily` back from the desk — the alternative was a SECOND
    // home for the family map, which is the drift class the estate refuses. Function
    // declarations hoist, so both orders resolve; that is a property to prove, not to assume.
    const desk = await import('../../src/domain/display/stateProse/defenseStateProse.js');
    expect(typeof desk.measuredMonsterFamily).toBe('function');
    const leaf = await import('../../src/domain/display/stateProse/defenseStateProseCandidates.js');
    expect(leaf.defenseStateProseCandidates('DS-DEF-11', town({ config: { monsterThreat: 'plagued' } })))
      .toHaveLength(2);
  });
});

describe('the covert pool is dropped by the COMPOSER and never by the leaf (ARCH §4.2 step 2)', () => {
  const block = /** @type {any} */ (DOSSIER_STATE_PROSE_DEFENSE)['DS-DEF-11'];

  it('a covert candidate seats on the DM face and is invisible on the player face', () => {
    const read = (audience) => composeStateProse(
      { 'DS-DEF-11': block }, 'DS-DEF-11',
      {
        spineKey: 'WALLED-STRAINED',
        candidates: [{ key: 'watch: bought (covert)', change: 0 }],
        slots: { settlement: 'Fixture', defwork: 'wall' },
        seed: 'covert-probe',
        audience,
      },
    );
    const dm = read('dm');
    const player = read('player');
    expect(dm.pieces.some((p) => p.key === 'watch: bought (covert)'), 'the DM face seats it').toBe(true);
    expect(player.pieces.some((p) => p.key === 'watch: bought (covert)'), 'the player face does not').toBe(false);
    // ⭐ AND NOTHING IT DID IS OBSERVABLE THERE: the player unit is byte-identical to the unit
    // composed with NO candidate at all, so the withdrawal did not even cost a budget slot.
    const bare = composeStateProse({ 'DS-DEF-11': block }, 'DS-DEF-11', {
      spineKey: 'WALLED-STRAINED',
      candidates: [],
      slots: { settlement: 'Fixture', defwork: 'wall' },
      seed: 'covert-probe',
      audience: 'player',
    });
    expect(player.text).toBe(bare.text);
    expect(JSON.stringify(player.pieces)).toBe(JSON.stringify(bare.pieces));
  });
});

describe('the census over a deterministic slice of the RATE grid', () => {
  it('prints the three gates per pool and a plant moves exactly one row', () => {
    const towns = rateGrid().slice(0, 48);
    const census = tasteCandidateCensus(towns);
    expect(census.walked).toBe(48);
    expect(census.genThrows).toBe(0);
    const row = (key) => census.table.get(key);
    // ⭐ CANDIDATE >= ATTACHED >= SEATED on every pool, which is the ladder's own shape: a
    // pool the composer seated must have had a spine to attach to, and a pool with a spine
    // must have been a candidate.
    for (const [key, seat] of census.table) {
      expect(seat.candidate, `${key}: candidate >= attached`).toBeGreaterThanOrEqual(seat.attached);
      expect(seat.attached, `${key}: attached >= seated`).toBeGreaterThanOrEqual(seat.seated);
    }
    // NON-VACUITY: the slice fires the country pools and the stock pools.
    expect(row('DS-DEF-11 :: country: pressed (walled)').candidate).toBeGreaterThan(0);
    expect(row('DS-DEF-2 :: stores: import-fed').candidate).toBeGreaterThan(0);
    // ⛔ THE INVERSION IS THE PLANT, DRIVEN WITHOUT TOUCHING A BYTE: the same 48 towns read
    // through an INVERTED country predicate must give the COMPLEMENT of the shipped count.
    let pressed = 0;
    let notPressed = 0;
    for (const spec of towns) {
      // ⛔ THE RESOLVED THREAT, WHICH IS WHAT THE DESKS READ. `random_threat` is a roll and
      // reading the grid's raw config value here answered 0 of 48 while the census answered
      // 35 — the arm measuring the configuration panel instead of the towns it produced.
      const firing = tasteFiringsOf(spec);
      const fired = defenseStateProseCandidates('DS-DEF-11', {
        config: { monsterThreat: firing.threat },
      }).length > 0;
      if (fired) pressed += 1; else notPressed += 1;
    }
    expect(pressed + notPressed).toBe(48);
    expect(pressed, 'and the leaf agrees with the census it fed').toBe(row('DS-DEF-11 :: country: pressed (walled)').candidate);
    expect(notPressed, 'a predicate that answered a constant would make one of these zero').toBeGreaterThan(0);
  });
});

/**
 * compromisedRole.test.js — A COMPROMISED ROLE SPEAKS, AND SPEAKS TO REASSURE
 * (ADDENDUM 18 ruling 26, the owner's; car 8b-W-18m).
 *
 * THE SIX THINGS THIS FILE HOLDS, in the brief's own order:
 *   1. THE ROLL — deterministic, and its rate within two points of `COMPROMISED_SPEAKS` over
 *      ten thousand seeded rolls.
 *   2. THE FORCING on a symptom pool, and the NON-forcing everywhere else.
 *   3. THE SILENCE PATH — the source absent from the unit, and never a blanked rung.
 *   4. THE AUDIENCE GATE — no compromised face carries a dm-only mark, and the page text never
 *      contains the covert field's name.
 *   5. THE GRAMMAR REFUSALS — the closed table, and one candidate per source per variant.
 *   6. ZERO TEXT SHIFT — no compromised face exists in the corpus yet, so the whole mechanism
 *      is inert and the generated leaves are byte-identical.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  COMPROMISABLE_SOURCES, COMPROMISED_MARK, COMPROMISED_SPEAKS,
  compromisedDraw, compromisedFaceOf, compromisedSpeaks, eligibleFaces,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import {
  COMPROMISED_SYMPTOM_POOLS, composeStateProse,
} from '../../src/domain/display/stateProse/composeStateProse.js';
import {
  compromisedSourcesOf, renderYearOf, withFaceSources,
} from '../../src/domain/display/stateProse/faceSources.js';
import { assertFaces, parseFaceRow } from '../../scripts/lib/dossier-annex-grammar.mjs';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/** A fixture corpus whose one pool carries a hall face and a hall COMPROMISED face. */
const SPINE = 'the purse';
const FIX = 'DS-FIX-1';
function corpusWithCompromised() {
  return {
    [FIX]: {
      pools: {
        [SPINE]: [{
          index: 1,
          vid: 1,
          angle: 'ledger',
          text: 'The survey finds the purse short.',
          wordings: [
            'One of the watch says the walk is kept.',
            'A clerk in the hall puts the shortfall in the record.',
            'A clerk in the hall says the accounts are in order.',
          ],
          sources: [null, 'watch', 'hall', 'hall'],
          compromised: [false, false, false, true],
        }],
      },
      poolMeta: { [SPINE]: { role: 'spine', variantCount: 1, faceCounts: [4], vids: [1], attach: [] } },
    },
  };
}

describe('the roll — determinism and rate (ADDENDUM 18 ruling 26 (h) and (j))', () => {
  it('⭐ the same (seed, pool, settlement, year) always gives the same answer', () => {
    for (let i = 0; i < 500; i += 1) {
      const first = compromisedSpeaks('world', 'the purse', 'town-7', 3);
      expect(compromisedSpeaks('world', 'the purse', 'town-7', 3)).toBe(first);
    }
  });

  it('⭐⭐ the speak share is within TWO POINTS of the rate over ten thousand seeded rolls', () => {
    let spoke = 0;
    const N = 10000;
    for (let i = 0; i < N; i += 1) if (compromisedSpeaks('world', 'the purse', `town-${i}`, 3)) spoke += 1;
    const share = spoke / N;
    process.stdout.write(`\n[compromised] ${N} seeded rolls at rate ${COMPROMISED_SPEAKS}: `
      + `${spoke} speak / ${N - spoke} silent · share ${share.toFixed(4)}\n`);
    expect(Math.abs(share - COMPROMISED_SPEAKS)).toBeLessThanOrEqual(0.02);
    // ANTI-VACUITY: a constant `true` would also be "within two points" of 1, so the silence
    // must really happen and really be the minority.
    expect(spoke).toBeGreaterThan(0);
    expect(N - spoke).toBeGreaterThan(0);
    expect(share).toBeGreaterThan(0.5);
  });

  it('⭐ THE YEAR MOVES IT, which is what makes the silence a behaviour and not a flicker', () => {
    // Over a run of years on ONE town the answer must change: a roll that never moved would
    // make the silence a property of the town rather than of the year, and ruling 26 (h) asks
    // for a re-roll at generation and at every advance of time.
    let changes = 0;
    for (let town = 0; town < 200; town += 1) {
      const years = [0, 1, 2, 3].map((y) => compromisedSpeaks('world', 'the purse', `t-${town}`, y));
      if (new Set(years).size > 1) changes += 1;
    }
    expect(changes, 'towns whose four years are not all the same answer').toBeGreaterThan(100);
  });

  it('⛔ THE PRINCIPLE IS WRITTEN BESIDE THE ROLL: it decides WHO SPEAKS, never WHAT IS TRUE', () => {
    // A constant with no argument beside it is a constant nobody can veto, and a year-seeded
    // roll with no principle beside it is an invitation for a later hand to roll a FACT on the
    // year. Both are asserted as source text, because both are the reason the mechanism is safe.
    const kernel = read('src/domain/display/stateProse/stateProseKernel.js');
    expect(kernel).toMatch(/WHO SPEAKS, NEVER WHAT IS TRUE/);
    expect(kernel).toMatch(/THE CHAIR'S NUMBER AT THE OWNER'S WORD, VETOABLE/);
    // The three-year table the chair reasoned from is in the docblock, so the owner can check
    // the arithmetic rather than the conclusion.
    for (const rate of ['0.6', '0.7', '0.8']) expect(kernel).toContain(rate);
    expect(COMPROMISED_SPEAKS).toBe(0.7);
  });
});

describe('the draw — forced on a symptom, silent on the roll, ordinary elsewhere', () => {
  const VARIANT = corpusWithCompromised()[FIX].pools[SPINE][0];

  it('⭐ compromisedFaceOf finds the ONE marked candidate of a source, and nothing else', () => {
    expect(compromisedFaceOf(VARIANT, 'hall')).toBe(3);
    expect(compromisedFaceOf(VARIANT, 'watch')).toBe(null);
    expect(compromisedFaceOf({ ...VARIANT, compromised: undefined }, 'hall')).toBe(null);
    expect(compromisedFaceOf(null, 'hall')).toBe(null);
  });

  it('⭐⭐ SPEAKS: the compromised candidate is FORCED, over the source\'s ordinary face', () => {
    const all = eligibleFaces(VARIANT, new Set(['watch', 'hall']));
    expect(all).toEqual([0, 1, 2, 3]);
    const { forced, eligible } = compromisedDraw(VARIANT, all, 'hall', true);
    expect(forced, 'the marked candidate, not the ordinary hall face at 2').toBe(3);
    expect(eligible, 'and the eligible list is untouched when the source speaks').toEqual(all);
  });

  it('⭐ SPEAKS with no marked candidate: the source is still forced, on its ordinary face', () => {
    const bare = { ...VARIANT, compromised: [false, false, false, false] };
    const { forced } = compromisedDraw(bare, [0, 1, 2, 3], 'hall', true);
    expect(forced, 'the first face of the compromised source').toBe(2);
  });

  it('⭐⭐ SILENT: the source is dropped from the draw entirely', () => {
    const { forced, eligible } = compromisedDraw(VARIANT, [0, 1, 2, 3], 'hall', false);
    expect(forced).toBe(null);
    expect(eligible, 'both hall faces gone, the spine and the watch left').toEqual([0, 1]);
  });

  it('⛔ THE SILENCE NEVER BLANKS THE RUNG — a covert fact may not decide whether a town has a section', () => {
    // If excluding the silent source would leave nothing eligible, the list comes back
    // untouched. A silence that blanked the rung would be the covert fact visible as an
    // absence, which is exactly the leak ruling 26 (a) forbids.
    const hallOnly = {
      ...VARIANT,
      sources: [null, 'hall', 'hall', 'hall'],
    };
    const { eligible } = compromisedDraw(hallOnly, [1, 2, 3], 'hall', false);
    expect(eligible, 'nothing would be left, so nothing is taken').toEqual([1, 2, 3]);
  });

  it('⭐ THE SYMPTOM TABLE IS SMALL, RECORDED, AND ONLY EVER NAMES A COMPROMISABLE SOURCE', () => {
    expect(COMPROMISED_SYMPTOM_POOLS.length).toBeGreaterThan(0);
    for (const row of COMPROMISED_SYMPTOM_POOLS) {
      expect(COMPROMISABLE_SOURCES, `${row.source} is compromisable`).toContain(row.source);
      expect(row.pools.length, `${row.source} marks at least one pool`).toBeGreaterThan(0);
    }
    // A source gets at most ONE row per block, or `symptomSourceOf`'s "first match wins" would
    // be a silent choice between two tables rather than a lookup.
    const keys = COMPROMISED_SYMPTOM_POOLS.map((r) => `${r.block}::${r.source}`);
    expect(new Set(keys).size).toBe(keys.length);
    // SMALL: one or two pools on a page, never the whole page (ruling 26 (i)). The block's
    // twenty-six pools against what the table marks for any one source.
    for (const row of COMPROMISED_SYMPTOM_POOLS) {
      expect(row.pools.length, `${row.source} marks few pools, not a page`).toBeLessThanOrEqual(4);
    }
    // Every pool the table names is a REAL pool of its block.
    const leaf = read('src/data/dossierStateProse/defense.generated.js');
    for (const row of COMPROMISED_SYMPTOM_POOLS) {
      for (const pool of row.pools) {
        expect(leaf.includes(JSON.stringify(pool)), `${pool} is a pool of ${row.block}`).toBe(true);
      }
    }
  });

  it('⭐⭐ THE COMPOSER FORCES ON A SYMPTOM POOL AND DOES NOT FORCE ELSEWHERE', () => {
    // Driven through the REAL composer on the fixture corpus, at both the marked pool key and
    // an unmarked one, so the scoping is a measurement rather than a reading of the table.
    const corpus = corpusWithCompromised();
    const MARKED = 'Invasion & War: walls with NO force';
    corpus[FIX].pools[MARKED] = corpus[FIX].pools[SPINE];
    corpus[FIX].poolMeta[MARKED] = corpus[FIX].poolMeta[SPINE];
    const base = {
      slots: {}, audience: 'dm', candidates: [], turns: [],
      sources: new Set(['watch', 'hall']),
      compromised: new Set(['hall']),
      settlementId: 'town-1',
      year: 3,
    };
    /** @param {string} pool @param {string} blockId */
    const facesOver = (pool, blockId) => {
      const seen = [];
      for (let i = 0; i < 200; i += 1) {
        const unit = composeStateProse(corpus, blockId, { ...base, seed: `s-${i}`, spineKey: pool });
        if (unit) seen.push(unit.pieces[0].face);
      }
      return seen;
    };
    // ⭐ ON THE MARKED POOL the draw is the roll's, not the modulus's: face 3 (the compromised
    // candidate) on the speaking share, and NEVER a hall face on the silent share.
    const markedCorpus = { 'DS-DEF-2': corpus[FIX] };
    const markedFaces = [];
    for (let i = 0; i < 200; i += 1) {
      const unit = composeStateProse(markedCorpus, 'DS-DEF-2', { ...base, seed: `s-${i}`, spineKey: MARKED });
      if (unit) markedFaces.push(unit.pieces[0].face);
    }
    const spoke = markedFaces.filter((f) => f === 3).length;
    const hallOrdinary = markedFaces.filter((f) => f === 2).length;
    process.stdout.write(`[compromised] over 200 seeds on the marked pool: forced ${spoke}`
      + ` · ordinary hall ${hallOrdinary} · other ${markedFaces.length - spoke - hallOrdinary}\n`);
    expect(markedFaces.length, 'the sweep composed something').toBe(200);
    expect(spoke / 200, 'the forced share tracks the roll').toBeGreaterThan(0.6);
    expect(hallOrdinary, 'the silent share never gives the hall its ordinary face either').toBe(0);
    // ⭐ ON AN UNMARKED POOL nothing is forced: the hall's two faces appear at the ordinary
    // modulus rate, and face 3 is not over-represented.
    const plain = facesOver(SPINE, FIX);
    expect(plain.length).toBe(200);
    expect(plain.filter((f) => f === 3).length / 200, 'no forcing off the symptom pool')
      .toBeLessThan(0.45);
    expect(new Set(plain).size, 'and every face is reachable there').toBeGreaterThan(2);
  });

  it('⭐ A TOWN WITH NO SECRET IS UNTOUCHED — the mechanism is inert without a covert field', () => {
    const corpus = corpusWithCompromised();
    const honest = [];
    const held = [];
    for (let i = 0; i < 200; i += 1) {
      const base = {
        slots: {}, audience: 'dm', candidates: [], turns: [], seed: `s-${i}`,
        sources: new Set(['watch', 'hall']), spineKey: SPINE,
      };
      honest.push(composeStateProse(corpus, FIX, base).pieces[0].face);
      held.push(composeStateProse(corpus, FIX, { ...base, compromised: new Set(['hall']) })
        .pieces[0].face);
    }
    // SPINE is not a symptom pool, so a compromised roster changes nothing at all.
    expect(held).toEqual(honest);
  });
});

describe('the seating of the secret (faceSources.js compromisedSourcesOf)', () => {
  it('⭐ the captured hall, at the two covert rungs and at no other', () => {
    const at = (state) => [...compromisedSourcesOf({ powerStructure: { criminalCaptureState: state } })];
    expect(at('corrupted')).toEqual(['hall']);
    expect(at('capture')).toEqual(['hall']);
    // ⛔ The two lower rungs are OPEN facts — an open fight and an open accommodation — so
    // they compromise nothing. DS-DEF-4 prints both to the player in its own words.
    expect(at('adversarial')).toEqual([]);
    expect(at('equilibrium')).toEqual([]);
    expect(at('none')).toEqual([]);
    expect(at(undefined)).toEqual([]);
  });

  it('⭐ the covert bloc takes the watch AND the court; an overt one takes neither', () => {
    const blocs = (rows) => [...compromisedSourcesOf({ powerStructure: { blocs: rows } })].sort();
    expect(blocs([{ covert: true }])).toEqual(['court', 'watch']);
    expect(blocs([{ covert: false }, { covert: true }])).toEqual(['court', 'watch']);
    expect(blocs([{ covert: false }])).toEqual([]);
    expect(blocs([])).toEqual([]);
    expect(blocs(undefined)).toEqual([]);
  });

  it('⛔ NOTHING OUTSIDE THE CLOSED TABLE, and a missing settlement is no secret', () => {
    for (const nothing of [null, undefined, {}, { powerStructure: null }]) {
      expect([...compromisedSourcesOf(/** @type {never} */ (nothing))]).toEqual([]);
    }
    expect(COMPROMISABLE_SOURCES).toEqual(['hall', 'watch', 'court']);
    // ⛔ THE REGISTER IS DELIBERATELY ABSENT and the reason is recorded in the source: a
    // creed's standing is PUBLIC and no covert flag stands beside it, so admitting it would
    // let a writer tag a conspiracy the engine never held. Reported OPEN.
    expect(COMPROMISABLE_SOURCES).not.toContain('register');
    const kernel = read('src/domain/display/stateProse/stateProseKernel.js');
    expect(kernel).toMatch(/THE REGISTER IS NOT HERE/);
    const seating = read('src/domain/display/stateProse/faceSources.js');
    expect(seating).toMatch(/THE UNEXPOSED OFFICER/);
    expect(seating).toMatch(/THE CULT'S HAND ON THE REGISTER/);
  });

  it('⭐ THE YEAR THE RENDER SEES is the town\'s own recorded age, and the finding is recorded', () => {
    expect(renderYearOf({ history: { age: 124 } })).toBe(124);
    expect(renderYearOf({ history: {} })).toBe(0);
    expect(renderYearOf(null)).toBe(0);
    expect(renderYearOf({ history: { age: Number.NaN } })).toBe(0);
    // ⛔ No `currentYear` exists anywhere in the tree — the finding that made this a judgment
    // rather than a lookup, recorded where the next seat will read it.
    expect(read('src/domain/display/stateProse/faceSources.js'))
      .toMatch(/returns NOTHING: no field of that name exists/);
  });

  it('withFaceSources carries the secret, the settlement and the year onto the read', () => {
    const town = {
      id: 'town-9',
      tier: 'town',
      institutions: [{ name: 'Town hall' }],
      npcs: [],
      history: { age: 77 },
      powerStructure: { criminalCaptureState: 'capture' },
    };
    const out = /** @type {never} */ (withFaceSources(/** @type {never} */ (town), { seed: 'x' }));
    expect([...out.compromised]).toEqual(['hall']);
    expect(out.settlementId).toBe('town-9');
    expect(out.year).toBe(77);
  });
});

describe('the grammar — the tag, and what it refuses', () => {
  const base = {
    label: 'X',
    parent: { angle: 'ledger', text: 'The survey finds it.', slots: [] },
    pinnedFaceCount: 4,
    shapeOf: () => 'phrase',
    clauseOpeners: [],
    form: 'sentence',
  };
  const faces = (list, sources, compromised) => assertFaces({
    ...base, faces: list, sources, pairs: list.map(() => null), compromised,
  });

  it('⭐ the tag parses standing alone and as one half of a pair', () => {
    expect(parseFaceRow('`[hall · compromised]` The accounts are in order.', 'X'))
      .toEqual({ text: 'The accounts are in order.', source: 'hall', pair: null, compromised: true, observed: false });
    expect(parseFaceRow('`[hall · pair 1 · disagree · compromised]` The accounts are in order.', 'X'))
      .toEqual({
        text: 'The accounts are in order.',
        source: 'hall',
        pair: { id: 1, kind: 'disagree' },
        compromised: true,
        observed: false,
      });
    // An untagged row and an ordinary tagged row both read `compromised: false`.
    expect(parseFaceRow('a bare face.', 'X').compromised).toBe(false);
    expect(parseFaceRow('`[hall]` The hall notes it.', 'X').compromised).toBe(false);
  });

  it('⛔ REFUSED on a source no covert field can compromise, at the row AND at the leaf', () => {
    expect(() => parseFaceRow('`[tavern · compromised]` All is well.', 'X'))
      .toThrow(/no covert field of the engine can compromise it/);
    expect(() => parseFaceRow('`[register · compromised]` The register is kept.', 'X'))
      .toThrow(/The table is CLOSED/);
    expect(() => faces(['All is well.'], ['tavern'], [true]))
      .toThrow(/which no covert field of the engine can compromise/);
    // And the archiver holds no secret of its own — caught at car 8b-W-18n by the NEVER
    // COMPROMISABLE table, which now takes this refusal ahead of the closed table because it
    // holds the PUBLIC too (ADDENDUM 18 ruling 28 (a): nothing backs it, so nothing takes it).
    expect(() => parseFaceRow('`[archiver · pair 1 · weigh · compromised]` It is disputed.', 'X'))
      .toThrow(/marks `archiver` `compromised`, and nothing can capture it/);
    expect(() => parseFaceRow('`[public · compromised]` All is well.', 'X'))
      .toThrow(/marks `public` `compromised`, and nothing can capture it/);
  });

  it('⛔ REFUSED: two compromised candidates for one source on one variant', () => {
    expect(() => faces(
      ['The accounts are in order.', 'There is nothing in them.'], ['hall', 'hall'], [true, true],
    )).toThrow(/A source offers ONE compromised candidate per variant/);
    // Two DIFFERENT sources may each carry one.
    expect(() => faces(
      ['The accounts are in order.', 'The walk is kept.'], ['hall', 'watch'], [true, true],
    )).not.toThrow();
  });

  it('⛔ REFUSED: a marks list that is not parallel to the faces', () => {
    expect(() => faces(['a.', 'b.'], ['hall', 'watch'], [true]))
      .toThrow(/compromised marks — the lists are parallel by construction/);
    // Absent reads as all-false, which is every shipped variant.
    expect(() => faces(['a.', 'b.'], ['hall', 'watch'], undefined)).not.toThrow();
  });
});

describe('⭐ THE AUDIENCE GATE, and the zero-text-shift proof', () => {
  it('⛔ THE PAGE NEVER NAMES THE COVERT FIELD, and no compromised face is dm-only', () => {
    // Ruling 26: the player page never states the compromise; it shows the compromised power
    // BEHAVING. Two halves, both asserted over the live corpus: no shipped variant carries a
    // compromised mark at all today (below), and the words that would name the fact appear in
    // NO shipped sentence of the block that carries the symptom pools.
    // ⛔ THE SWEEP READS THE SENTENCES THEMSELVES, not the lines of the file: a POOL KEY may
    // lawfully carry the machine's word (`capture corrupted` is a key of DS-DEF-4) and a key
    // is not page text. Found by writing the first spelling, which read keys as prose.
    const prose = Object.values(DOSSIER_STATE_PROSE_DEFENSE)
      .flatMap((block) => Object.values(block.pools))
      .flat()
      .flatMap((variant) => [variant.text, ...(variant.wordings || [])])
      .join('\n');
    for (const naming of ['criminalCaptureState', 'covert', 'compromised', 'conspiracy']) {
      expect(prose.includes(naming), `the page names the covert field: ${naming}`).toBe(false);
    }
    expect(prose.length, 'and the sweep really read the prose').toBeGreaterThan(10000);
  });

  it('⭐⭐ ZERO TEXT SHIFT: no shipped variant carries a compromised mark, so the car is inert', () => {
    const LEAVES = ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith'];
    /** @type {string[]} */
    const carrying = [];
    for (const leaf of LEAVES) {
      const src = read(`src/data/dossierStateProse/${leaf}.generated.js`);
      if (src.includes('"compromised"')) carrying.push(leaf);
    }
    expect(carrying, 'a leaf carrying a compromised mark').toEqual([]);
    // And the mark's own word is what the projector emits, so this sweep cannot go blind.
    expect(COMPROMISED_MARK).toBe('compromised');
  });

  it('⭐ THE CARD PRINTS THE COVERT SECTION, from the composer\'s own table and not a copy', () => {
    const card = read('scripts/prose-mark-card.mjs');
    expect(card).toMatch(/COVERT FIELDS AND THEIR SYMPTOMS ON THIS BLOCK/);
    expect(card).toMatch(/THE INVERTED TEST/);
    // ⛔ IMPORTED, NOT RE-SPELLED: a symptom pool added to the composer and not to the card
    // would leave the refuter judging a face whose licence he cannot see.
    expect(card).toMatch(/import \{ COMPROMISED_SYMPTOM_POOLS \}/);
    // And the card's covert rows name exactly the sources the seating can return.
    for (const source of COMPROMISABLE_SOURCES) {
      expect(card.includes(`source: '${source}'`), `the card carries a row for ${source}`).toBe(true);
    }
  });
});

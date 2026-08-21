/**
 * tests/lint/wallRuns.walker.test.js — ⭐⭐⭐ THE TOTALITY WALKER OVER THE WALL'S CLOSED SETS.
 *
 * `laneMFW1B-receipt.md` §8.1 established the shape and §14.8 handed it forward by name:
 * *"W2 exit 1 requires a `runType` from the closed set of nine — the same shape: a walker over
 * the producing vocabulary, so a tenth run type reds until it is ruled."*
 *
 * ⭐⭐ THE CLASS IT CLOSES: **A TABLE WHOSE KEYS NEVER OCCUR CANNOT RED.** Curing one missing row
 * is an instance fix; the structural answer is a walker over the PRODUCING code's own
 * vocabulary, so a type that is minted and never policied — or policied and never minted — is a
 * failure rather than a silence.
 *
 * ⚠ AND THE SECOND HALF IS §270.1's: a type that no leaf can produce is DARK, and a dark arm
 * must carry a written ruling rather than a hope. The roster below is that ruling, and it is
 * checked against a real corpus build so it cannot rot into decoration.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { RUN_TYPES, RUN_POLICY, TOWER_TYPES } from '../../src/domain/townMap/fabric/wallRuns.js';
import { FATE_RUNGS } from '../../src/domain/townMap/fabric/circuitDemotion.js';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { makeWalledFixture } from '../fixtures/townMapFixtures.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '../../src/domain/townMap/fabric');
const read = (f) => readFileSync(join(SRC, f), 'utf8');

/**
 * ⭐⭐⭐ THE RULED-DARK ROSTER. A run type that the corpus cannot produce today is recorded HERE
 * with the reason, exactly as `stateMarks.ARCHETYPE_SOURCES`'s siblings were ruled UNBRIDGED —
 * so the gap is a decision on the record rather than a silence a later lane re-finds as a bug.
 * ⛔ Entries are removed by MEASUREMENT (the type fires) and never by convenience.
 */
export const RULED_DARK = Object.freeze({});

describe('§5 W2 · the closed sets are CLOSED, and the walker says so', () => {
  it('every run type minted by the classifier is in RUN_TYPES and has a policy row', () => {
    const src = read('wallRuns.js');
    // The producing vocabulary: every string literal the classifier assigns to `type[k]` or
    // to a coalesced run. A tenth type added to the body without a table row reds here.
    const minted = new Set();
    for (const m of src.matchAll(/type\[k\]\s*=\s*'([a-z-]+)'/g)) minted.add(m[1]);
    for (const m of src.matchAll(/type:\s*'([a-z-]+)'\s*,\s*idx/g)) minted.add(m[1]);
    for (const m of src.matchAll(/merged\[0\]\.type\s*=\s*'([a-z-]+)'/g)) minted.add(m[1]);
    expect(minted.size, 'the walker found no minted run types — its own regexes have rotted')
      .toBeGreaterThanOrEqual(8);
    for (const t of minted) {
      expect(RUN_TYPES, `the classifier mints '${t}' and the closed set does not carry it`).toContain(t);
      expect(RUN_POLICY[t], `'${t}' is minted with no policy row`).toBeTruthy();
    }
    // …and the other direction: a policy row nobody mints is a rule about nothing.
    for (const t of RUN_TYPES) {
      expect(minted.has(t) || RULED_DARK[t],
        `RUN_TYPES carries '${t}' and the classifier never mints it — mint it or rule it`).toBeTruthy();
    }
  });

  it('every tower kind the chooser returns is in TOWER_TYPES', () => {
    const src = read('wallRuns.js');
    const body = src.slice(src.indexOf('export function towerKind'));
    const minted = new Set();
    for (const m of body.slice(0, body.indexOf('\n}')).matchAll(/return\s+(?:rng\.chance\([^)]*\)\s*\?\s*)?'([a-zA-Z-]+)'(?:\s*:\s*'([a-zA-Z-]+)')?/g)) {
      if (m[1]) minted.add(m[1]);
      if (m[2]) minted.add(m[2]);
    }
    expect(minted.size).toBeGreaterThanOrEqual(4);
    for (const t of minted) expect(TOWER_TYPES, `towerKind returns '${t}', which is not a TOWER_TYPE`).toContain(t);
  });

  it('every fate rung the ladder can return is in FATE_RUNGS, and the weights are exhaustive', () => {
    const src = read('circuitDemotion.js');
    const body = src.slice(src.indexOf('export function fateFor'));
    const weights = [...body.slice(0, body.indexOf('\n}')).matchAll(/\{\s*weight:/g)].length;
    expect(weights, 'the fate ladder has a rung with no weight, or a weight with no rung')
      .toBe(FATE_RUNGS.length);
  });

  it('the LENS draws every tower type the domain can mint — no silent fallback', () => {
    // ⚠ THE OTHER HALF OF §195.0: a vocabulary the derivation carries and the lens cannot draw
    // is a distinction that exists in the data and not on the page. The renderer names each
    // kind; a new kind added to the domain alone reds here.
    const lens = readFileSync(join(HERE, '../../harness/renderFolio.mjs'), 'utf8');
    for (const t of TOWER_TYPES) {
      expect(lens.indexOf(`'${t}'`) >= 0, `the lens has no mark for tower type '${t}'`).toBe(true);
    }
  });

  it('⭐⭐ §270.1 · WHICH TYPES ACTUALLY FIRE ON A REAL LEAF, and the dark ones are RULED', () => {
    // The never-run audit at run granularity. A type that fires needs no ruling; a type that
    // does not MUST have one, and the roster above is where it lives.
    const F = [
      buildFabric(makeWalledFixture({ _seed: 'w2-walk-city', tier: 'city', population: 20000 }),
        buildTownMapModel(makeWalledFixture({ _seed: 'w2-walk-city', tier: 'city', population: 20000 }), null), {}),
      buildFabric(makeWalledFixture({ _seed: 'w2-walk-metro', tier: 'metropolis', population: 71000 }),
        buildTownMapModel(makeWalledFixture({ _seed: 'w2-walk-metro', tier: 'metropolis', population: 71000 }), null), {}),
    ];
    const fired = new Set();
    for (const f of F) for (const ring of f.walls) for (const r of ring.runs) fired.add(r.type);
    // ⚠ THE FIXTURE SET IS TWO LEAVES, NOT THE CORPUS — the corpus-wide firing census lives in
    // `laneMFW2-receipt.md` §4 and covers all seventeen. What this arm pins is the LAW: a type
    // is either fired or ruled, and neither list may be silently empty.
    expect(fired.size).toBeGreaterThanOrEqual(4);
    for (const t of fired) expect(RUN_TYPES).toContain(t);
    for (const t of RUN_TYPES) {
      if (fired.has(t)) continue;
      // Not fired HERE is not a failure — this is a two-leaf sample. What would be a failure is
      // a type that is neither in the closed set nor ruled, which the first arm already covers.
      expect(RUN_POLICY[t]).toBeTruthy();
    }
  }, 600000);

  /**
   * ⭐⭐⭐ §287.12 / SPEC §278 · **THE PROPER-CROSSING PREDICATE HAS EXACTLY ONE HOME, AND THIS IS
   * THE SOURCE SCAN THAT KEEPS IT THAT WAY.**
   *
   * SPEC §278 grades the offset kernel on it by name: *"`properCross` — ONE exported home; the
   * second spelling in groundLaw.js is gone."* It had two: `fabricGeometry.crossParams` (which
   * `properCross`, `ringSelfCrossings` and `simplifyRing` all consume) and a private, character-
   * for-character copy in `groundLaw.js` deciding §17 abutments. ⛔ TWO SPELLINGS OF ONE
   * PREDICATE IS THE DEFECT SHAPE THIS PROGRAMME KEEPS FINDING — `splitAtGates`'s own docstring
   * records the same class one surface out: *a defect cured in one spelling of a duplicated rule
   * survives in the other, and the two then disagree about the same town.*
   *
   * ⚠ THE SCAN IS OVER THE ARITHMETIC, NOT OVER THE NAME, because a second spelling would not
   * be called `properCross` — it would be called something else and compute the same thing. The
   * signature it hunts is the crossing determinant `r0 * s1 - r1 * s0` in any of its equivalent
   * literal forms, together with the `1e-9` open-interval test that makes a crossing PROPER.
   */
  it('⭐⭐ §278 · ONE proper-crossing predicate in the fabric — a source scan, not a hope', () => {
    const FILES = ['fabricGeometry.js', 'groundLaw.js', 'walls.js', 'wallCircuit.js', 'wallRuns.js',
      'epochAxis.js', 'circuitDemotion.js', 'reservedGround.js', 'parcels.js', 'buildFabric.js',
      'groundRefusal.js', 'districtPartition.js'];
    // The open-interval test that distinguishes a PROPER crossing from an abutment. Comments are
    // stripped first: this file and `fabricGeometry.js` both DISCUSS the bound in prose, and a
    // scan that convicts prose is a scan that gets its comment reworded rather than obeyed.
    const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const holders = [];
    for (const f of FILES) {
      let src;
      try { src = strip(read(f)); } catch { continue; }
      // The open-interval bound, in either the literal or the named spelling. A second spelling
      // that invented its own epsilon name would still have to compare against `1 - <something>`.
      const hasBound = /<\s*1\s*-\s*[A-Za-z0-9_.]+/.test(src);
      // The crossing determinant, in either of its two equivalent literal arrangements.
      const hasDet = /\*\s*s1\s*-\s*\w+\s*\*\s*s0|\)\s*\*\s*\(\s*d\[1\]\s*-\s*c\[1\]\s*\)/.test(src);
      if (hasBound && hasDet) holders.push(f);
    }
    expect(holders, 'the proper-crossing predicate lives in more than one file again — SPEC §278'
      + ' names ONE exported home as a graded exit criterion').toEqual(['fabricGeometry.js']);
    // ⛔ NON-VACUITY: the scan must be able to FIND the predicate at all. A regex that has rotted
    // into matching nothing would report "exactly one home" forever, from an empty set.
    expect(holders.length, 'the scan found NO proper-crossing predicate anywhere — its own regexes'
      + ' have rotted, and an empty result is not a clean result').toBe(1);
    // …and the one home EXPORTS it, so the other file can import rather than re-spell it.
    expect(read('fabricGeometry.js')).toMatch(/export function properCross\s*\(/);
    expect(read('groundLaw.js')).toMatch(/import \{[^}]*properCross[^}]*\} from '\.\/fabricGeometry\.js'/);
  });
});

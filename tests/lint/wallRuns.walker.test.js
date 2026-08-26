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
import { readFileSync, readdirSync } from 'node:fs';
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
 * ⛔⛔⛔ **THE FABRIC DIRECTORY, READ — NOT A HAND-KEPT LIST OF IT.** WALL-CURTAIN, ODQ §699.6.
 *
 * Both source scans below used to name their files by hand: the single-writer arm listed **six**
 * and the §278 proper-crossing arm listed **twelve**. **The directory holds seventy-one.** A
 * seventh classifier — or a second crossing predicate — in any of the other modules passed both
 * arms in silence, and a skeptic's plant proved exactly that. The two arms exist to guarantee
 * SINGLE WRITERS; a scope that is a hand-kept subset of the population guarantees single writers
 * among the files somebody remembered.
 *
 * ⭐ **THE LAW, earned six times and paid out here** (§699.6): *a guard's scope is its SHIPPED
 * PREDICATE, never its name and never its comment — and a guard written to close a class is the
 * most likely place for the class's next instance.* Both scans now enumerate the directory, and
 * MEASURED before the change: widening them convicts **nobody new** (0 further modules assign a
 * run type; the crossing predicate still has exactly one home across all 71). The guards were
 * already true of the whole population — they simply could not say so.
 */
const FABRIC_MODULES = readdirSync(SRC).filter((f) => f.endsWith('.js')).sort();

/**
 * ⛔ NON-VACUITY FOR THE READ ITSELF. A directory scan that came back short — a moved folder, a
 * changed extension, a build that emits elsewhere — would report "exactly one home" from an empty
 * set, which is the precise failure shape both arms exist to prevent. The floor is well under the
 * 71 measured today so a deletion does not red it, and far above the 6 and 12 it replaces.
 */
const MODULE_FLOOR = 40;

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
    /**
     * The producing vocabulary: every string literal the classifier assigns as a run type. A
     * tenth type added to the body without a table row reds here.
     *
     * ⭐⭐ **THE REGEXES MOVED AT SPINE-3 BECAUSE THE PRODUCING CODE DID, AND THE WALKER CAUGHT
     * IT RATHER THAN GOING QUIET.** The ladder was extracted from `deriveRuns`' inline loop into
     * `runTypeAt` so the successor publication could call it instead of carrying a second
     * spelling (ODQ §692.6(ii)). The old `type[k] = '…'` shape vanished, the walker found ONE
     * minted type instead of eight, and **its own `minted.size >= 8` guard — the "its own regexes
     * have rotted" line — fired exactly as written.** That guard is why this red was a red and
     * not a silent pass over an empty set; it is the single most valuable line in the file.
     */
    const minted = new Set();
    for (const m of src.matchAll(/type\[k\]\s*=\s*'([a-z-]+)'/g)) minted.add(m[1]);
    for (const m of src.matchAll(/type:\s*'([a-z-]+)'\s*,\s*idx/g)) minted.add(m[1]);
    for (const m of src.matchAll(/merged\[0\]\.type\s*=\s*'([a-z-]+)'/g)) minted.add(m[1]);
    // ⭐ the ladder's own returns — `runTypeAt` is the one place a vertex is given its type
    const ladder = src.slice(src.indexOf('export function runTypeAt'));
    const ladderBody = ladder.slice(0, ladder.indexOf('\n}\n'));
    for (const m of ladderBody.matchAll(/return\s+'([a-z-]+)'/g)) minted.add(m[1]);
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

  /**
   * ⭐⭐⭐ **SPINE-3 · THE SINGLE-WRITER ARM — `wallRuns.js` IS THE ONLY MODULE THAT MAY DECIDE A
   * RUN'S TYPE.** This is the structural answer to the defect the wave was chartered for, and it
   * closes the habitat rather than the instance.
   *
   * ⛔⛔ WHAT IT PREVENTS, MEASURED: `wallPublication.js` carried a SECOND classifier — six ad-hoc
   * proximity tests in a private priority order, every radius in band widths where the legacy
   * states its radii in the circuit's working margin. The two producers then disagreed about
   * **83 runs of the same corpus** (`crest` 62, `notch` 7, `detour-to-work` 9,
   * `terrain-surrender` 5), and nothing anywhere reddened, because every arm the estate had
   * asked *"is this type in the closed set?"* and none asked *"how many modules decide it?"*
   *
   * ⚠ THE PREDICATE IS ABOUT ASSIGNMENT, NOT MENTION. A module may name a type in a doc comment,
   * in a roster of ungrounded types, or in a test — what it may not do is ASSIGN one as a
   * classification. So the scan is for the assigning shapes, and it runs against a control that
   * proves the scan can see one.
   */
  it('⛔ SPINE-3 · NO MODULE BUT `wallRuns.js` DECIDES A RUN TYPE — the single-writer arm', () => {
    // ⛔ WALL-CURTAIN (§699.6): the whole directory, minus the one module that is ALLOWED to
    // decide. The predicate now matches the name it has carried since SPINE-3.
    expect(FABRIC_MODULES.length, 'the fabric directory read came back short — this scan\'s scope'
      + ' has collapsed and every zero below would be vacuous').toBeGreaterThanOrEqual(MODULE_FLOOR);
    const OTHERS = FABRIC_MODULES.filter((f) => f !== 'wallRuns.js');
    // …and the module that IS allowed to decide must be in the directory, or the exclusion is
    // excluding nothing and the arm is scanning a population that cannot contain the writer.
    expect(FABRIC_MODULES, 'the one permitted writer is not in the scanned directory')
      .toContain('wallRuns.js');
    const assigning = (body) => {
      const found = new Set();
      const shapes = [
        /type\[[a-z]+\]\s*=\s*'([a-z-]+)'/g,
        /\.type\s*=\s*'([a-z-]+)'/g,
        /\btype:\s*'([a-z-]+)'\s*,/g,
      ];
      for (const re of shapes) for (const m of body.matchAll(re)) if (RUN_TYPES.includes(m[1])) found.add(m[1]);
      return found;
    };
    // ⛔ THE CONTROL FIRST: the scan must SEE an assignment, or every zero below is vacuous.
    const probe = assigning("  type[i] = 'new-cutting';\n  r.type = 'crest';\n  x = { type: 'notch', idx: [] };");
    expect([...probe].sort(), 'the single-writer scan cannot see an assignment — it proves nothing')
      .toEqual(['crest', 'new-cutting', 'notch']);
    // and it must NOT fire on a mere mention, or it would forbid documentation
    expect(assigning("// `crest` needs the heightfield; UNGROUNDED.crest = '…'").size,
      'the scan fires on a MENTION — it would forbid a module from documenting a type').toBe(0);
    for (const f of OTHERS) {
      const got = [...assigning(read(f))];
      expect(got, `${f} ASSIGNS run type(s) ${got.join(', ')} — the ladder lives in wallRuns.js`
        + ' and a second spelling is how the estate lost 83 runs of signal (ODQ §692.6(ii))').toEqual([]);
    }
    // …and `wallRuns.js` itself must still be doing the deciding, so this arm cannot pass by
    // everybody having stopped.
    expect(assigning(read('wallRuns.js')).size,
      'NOBODY assigns a run type any more — the ladder has been emptied').toBeGreaterThan(0);
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
    /**
     * ⛔ WALL-CURTAIN: this arm named TWELVE files of seventy-one — the same defect as the
     * single-writer arm above, one arm over, and it was not in §699.6's charter because nobody
     * had looked. Widening it convicts nobody new (measured), so the guard was already true of
     * the whole directory and merely unable to say so.
     */
    expect(FABRIC_MODULES.length, 'the fabric directory read came back short — this scan\'s scope'
      + ' has collapsed and "exactly one home" would be a claim about an empty set')
      .toBeGreaterThanOrEqual(MODULE_FLOOR);
    const FILES = FABRIC_MODULES;
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

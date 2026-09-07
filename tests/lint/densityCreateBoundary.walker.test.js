/**
 * tests/lint/densityCreateBoundary.walker.test.js — THE CREATE-BOUNDARY WALKER
 * (ODQ §822, structural prevention).
 *
 * The density law is a VERSIONED GENERATION LAW: a world's law is fixed at its
 * birth and never changes, because §810 R5 and THE PROMISE together forbid an
 * existing world acquiring a new generation law. The whole guarantee therefore
 * reduces to one question asked of every module that can reach the settlement
 * pipeline — IS THIS A BIRTH? — and to the fact that a birth and a replay look
 * structurally identical at the call (same config shape, same options.seed).
 *
 * ⭐ WHY A WALKER AND NOT JUST CAREFUL CALL SITES. Correctness that rests on
 * "today's caller set happens to be right" is not correctness; it is a snapshot.
 * The failure this guards is IRREVERSIBLE for any world it touches — a settlement
 * silently re-born under a different ladder cannot be un-born — and it is
 * SILENT, because a mis-minted world generates perfectly well, just not the world
 * the seed promised. So the denominator is enforced: a module that reaches the
 * pipeline and is not classified in `PIPELINE_REACHERS` REDS, and a classified
 * module whose class disagrees with whether it actually mints REDS.
 *
 * CANNOT-CATCH (documented evasion gap, in the house style): a module that
 * reaches the pipeline through a dynamically-computed name, or receives the
 * function as an already-bound argument from a caller that is itself classified,
 * is invisible to this scan. The manifest's `why` rows are the human backstop.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import {
  BOUNDARY_CLASSES,
  PIPELINE_REACHERS,
  GENERATION_LAWS,
  LAW_WIRING_STATES,
} from '../../src/domain/density/densityCreateBoundary.js';

const SRC = join(process.cwd(), 'src');

/** The module that DEFINES the pipeline is not a caller of it. */
const SELF = 'src/generators/generateSettlementPipeline.js';

/** The symbols that constitute "this module mints a birth law".
 *
 *  ⭐ `newSettlementLivingContentLaw` JOINED THIS LIST IN THE ACT THAT WIRED IT
 *  (lane L-MAT), AND THE TIMING IS THE POINT. The register's starred arm below
 *  guards NON-WIRED laws only — it is what stopped the living-content mint
 *  reaching a generation-side module while the law was UNWIRED. Flipping that
 *  row to WIRED takes the law OUT of that arm's denominator, so without this
 *  widening the wiring car would have retired the only guard on where that
 *  mint may be named and left a PREVIEW free to mint it. The three per-caller
 *  arms (`every BIRTH mints`, `nothing else does`, `not named outside its
 *  homes`) now cover both laws. */
const MINT_SYMBOLS = [
  'birthConfig',
  'newSettlementDensityLaw',
  'newSettlementLivingContentLaw',
];

/** The create-boundary module and the law module behind it legitimately NAME the
 *  mint without being pipeline callers; they are the mint's home, not generation
 *  sites.
 *
 *  ⚠ `src/store/settlementSliceHelpers.js` WAS THE THIRD ROW AND IS DELETED, NOT
 *  KEPT AS AN ALLOWLIST ENTRY (lane L-MAT). That leaf re-exported `birthConfig`,
 *  and the re-export was the SOLE eager edge into the boundary module — so the
 *  boundary sat in first paint for a pass-through nobody needed. The lane now
 *  imports the boundary directly and the leaf names the mint nowhere, so the row
 *  would be a standing excuse for a mint returning to an EAGER store leaf, which
 *  is the byte defect this file's register exists to keep visible. A row kept
 *  after its reason has gone is how the next re-export lands green. */
const MINT_HOMES = Object.freeze([
  'src/domain/density/densityCreateBoundary.js',
  'src/domain/density/densityLaw.js',
  // The living-content law's own module, added with its mint symbol above: it
  // DECLARES the mint, which is the one legitimate way to name it outside the
  // boundary and its BIRTH callers.
  'src/domain/content/livingContentLaw.js',
]);

/**
 * Comments AND string literals both go, and the second half was earned: the
 * certification row tables (`subsystemRowsBaseline.js`, `subsystemRowsVirtual.js`)
 * carry long PROSE STRINGS describing measurements taken "through the full
 * generateSettlementPipeline". A comment-only stripper flagged both as
 * unclassified pipeline callers on this walker's first run. They do not call it;
 * they talk about it. A mention in prose — in a comment or in a data string —
 * must never count as reaching the pipeline.
 */
function stripCommentsAndStrings(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    // ⛔ TEMPLATE LITERALS GO FIRST, AND THE ORDER IS THE WHOLE BUG. An
    // apostrophe inside a template literal — `…the settlement's cap…`, which
    // this estate writes constantly — opened a spurious single-quoted span that
    // ran to the next apostrophe and swallowed every line between. MEASURED at
    // LGT-P8-MATBOUND: 181 of 2,174 src files were mis-stripped and 521,714
    // characters of LIVE CODE vanished from the scan, `settlementSlice.js`
    // alone losing 32,723. No verdict of this walker flipped — measured both
    // ways, 0 reacher flips and 0 mint flips — so the denominator was intact by
    // luck, not by construction, and a scan that is right by luck is the
    // false-green class this file exists to refuse.
    // ⛔ AND THE SECOND HALF, LANDED 2026-09-05 BY LANE L-CHAIR-901: THE QUOTE CLASSES STOP
    // AT A NEWLINE. Reordering alone was never the whole cure. An apostrophe inside a
    // DOUBLE-quoted string — `other: "the mine-founds-itself pattern, applied to crime"` and
    // the certification prose beside it — opens the same unterminated span the reorder was
    // meant to close, because the SINGLE-quote pass still runs before the double-quote one
    // and reaches it first. Excluding `\n` from both negated classes bounds the damage to
    // one line: an apostrophe with no partner on its own line now matches NOTHING, so the
    // double-quote pass that follows blanks the whole string correctly instead of inheriting
    // a span that already ate it.
    //
    // ⭐ THIS IS THE THIRTEENTH INSTRUMENT OF STRIPPER-UNIFY'S CENSUS, AND THAT CAR
    // DELIBERATELY DID NOT TOUCH IT ("The thirteenth is densityCreateBoundary.walker.test.js,
    // which L-HOMES-8 cured in its own dock"). L-HOMES-8 cured the ORDER half only; the
    // newline half stayed open here while its twelve siblings got both. The spelling below is
    // the estate's, character for character, so the family has ONE shape.
    //
    // MEASURED over all 2,188 src files at this tip: 271 files mis-stripped at the base and
    // 1,322,927 characters of live code recovered, with ZERO verdict flips across 4,382
    // verdicts (reach and mint on every file, plus the re-derivation arm's six probes) — and
    // every one of those verdicts also agrees with the estate's own character scanner
    // (`codeOnly`) on all 2,188 files. The denominator was intact by luck, not construction.
    .replace(/`(?:\\.|[^`\\])*`/g, '``')
    .replace(/'(?:\\.|[^'\\\n])*'/g, "''")
    .replace(/"(?:\\.|[^"\\\n])*"/g, '""');
}

/** Every .js/.jsx file under src/, as repo-relative POSIX paths. */
function sourceFiles(dir = SRC, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { sourceFiles(full, out); continue; }
    if (!/\.(js|jsx)$/.test(name)) continue;
    out.push(relative(process.cwd(), full).split(sep).join('/'));
  }
  return out;
}

/** Modules that can reach the settlement pipeline, comment-stripped so a mention
 *  in prose never counts (this file family is heavily commented, and several
 *  modules discuss the pipeline without calling it). */
function pipelineReachers() {
  return sourceFiles()
    .filter(rel => rel !== SELF)
    .filter(rel => /\bgenerateSettlementPipeline\b/
      .test(stripCommentsAndStrings(readFileSync(join(process.cwd(), rel), 'utf-8'))));
}

function mintsIn(rel) {
  const code = stripCommentsAndStrings(readFileSync(join(process.cwd(), rel), 'utf-8'));
  return MINT_SYMBOLS.some(sym => new RegExp(`\\b${sym}\\b`).test(code));
}

describe('density create-boundary walker (which generation is a BIRTH)', () => {
  const reachers = pipelineReachers();

  it('finds a real denominator (the scan is not vacuous)', () => {
    // If this ever collapses toward zero the scan has broken, and a broken scan
    // that passes is worse than no scan.
    expect(reachers.length).toBeGreaterThanOrEqual(4);
    expect(Object.keys(PIPELINE_REACHERS).length).toBeGreaterThanOrEqual(4);

    // ⭐⭐ AND THE DENOMINATOR'S SOUNDNESS IS PINNED BY TWO MUTANTS, ONE PER HALF OF THE
    // STRIPPER DEFECT (lane L-CHAIR-901). A count that is merely large is not a count that
    // is right: every file this stripper mis-strips falls OUT of `reachers` silently, and
    // the collapse this arm watches for is the one shape the bug never produces. So the two
    // defects are planted here as literals, and the fixtures are SHAPED SO NEITHER CURE CAN
    // RESCUE THE OTHER — STRIPPER-UNIFY's first cut got that wrong and its plant went green
    // for the wrong reason.
    //
    //   F1 — the ORDERING half. The apostrophes sit inside BACKTICKS and both live on ONE
    //   LINE, so a newline-bounded class cannot mask it: under a single-quote pass running
    //   first, `settlement's` opens a span that closes at `guild's` and eats the call
    //   between them. Only blanking template literals FIRST saves it.
    //
    //   F2 — the NEWLINE half. The apostrophes sit inside DOUBLE-quoted strings on
    //   DIFFERENT LINES, so the reorder cannot mask it: no backtick is involved at all, and
    //   the single-quote pass still reaches `settlement's` before the double-quote pass
    //   blanks the string holding it. Only a class that stops at `\n` saves it.
    const F1 = "const note = `the settlement's cap`; generateSettlementPipeline();"
      + " const w = `the guild's hall`;";
    const F2 = [
      'const a = "the settlement\'s cap";',
      'generateSettlementPipeline();',
      'const b = "the guild\'s hall";',
    ].join('\n');
    expect(stripCommentsAndStrings(F1).includes('generateSettlementPipeline'),
      'the ordering half has regressed: an apostrophe inside a template literal is opening a'
      + ' quote span again, and every file behind one drops out of this denominator').toBe(true);
    expect(stripCommentsAndStrings(F2).includes('generateSettlementPipeline'),
      'the newline half has regressed: an apostrophe inside a DOUBLE-quoted string is opening'
      + ' a single-quoted span that runs across lines, and the code between vanishes').toBe(true);

    // ⛔ GUARD THE GUARD — the two fixtures are proven ABLE TO DIE. The landed-defective
    // spellings are rebuilt here as locals (the cured stripper is never mutated), and each
    // must LOSE the symbol its own fixture carries. Without this pair, a fixture that had
    // stopped discriminating would report the cure working on every gate for ever.
    const strip = (code, quoteClass) => code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(new RegExp(`'(?:\\\\.|[^'\\\\${quoteClass}])*'`, 'g'), "''")
      .replace(new RegExp(`"(?:\\\\.|[^"\\\\${quoteClass}])*"`, 'g'), '""')
      .replace(/`(?:\\.|[^`\\])*`/g, '``');
    expect(strip(F1, '\\n').includes('generateSettlementPipeline'),
      'F1 no longer dies under the quotes-before-templates order — it has stopped'
      + ' discriminating and proves nothing').toBe(false);
    expect(strip(F2, '').includes('generateSettlementPipeline'),
      'F2 no longer dies under the unbounded quote classes — it has stopped discriminating'
      + ' and proves nothing').toBe(false);
  });

  it('every module that reaches the pipeline is classified', () => {
    const unclassified = reachers.filter(rel => !(rel in PIPELINE_REACHERS));
    expect(
      unclassified,
      `these modules reach generateSettlementPipeline but are not classified in `
      + `PIPELINE_REACHERS: ${unclassified.join(', ')} — decide whether each is a `
      + `BIRTH (mints a new world's law), DERIVED (re-derives an existing world) or `
      + `PREVIEW (throwaway), and say why. An unclassified caller is exactly how a `
      + `world gets silently re-born under a law it was not created with.`,
    ).toEqual([]);
  });

  it('the manifest names no module that has stopped reaching the pipeline', () => {
    // A row reaches the pipeline itself, or THROUGH the executor it declares.
    // The generation transport split the mint from the call: the store's lane
    // mints the law and posts a plain-data request, and a module under
    // src/workers is what invokes the pipeline with it. `reachesVia` is how a
    // BIRTH row stays held to the tree in that shape rather than reading as
    // stale, and the named executor must itself be a live reacher, so a
    // dangling pointer is a red exactly like a dangling row.
    const stale = Object.keys(PIPELINE_REACHERS).filter((rel) => {
      if (reachers.includes(rel)) return false;
      const via = PIPELINE_REACHERS[rel].reachesVia;
      return !(via && reachers.includes(via));
    });
    expect(
      stale,
      `classified modules that no longer reach the pipeline: ${stale.join(', ')}`,
    ).toEqual([]);
  });

  it('every class is one of the declared three, and carries a reason', () => {
    for (const [rel, row] of Object.entries(PIPELINE_REACHERS)) {
      expect(BOUNDARY_CLASSES, `${rel} has class "${row.class}"`).toContain(row.class);
      expect(String(row.why || '').length, `${rel} needs a why`).toBeGreaterThan(40);
    }
  });

  it('every BIRTH mints the law, and nothing else does', () => {
    const birthsNotMinting = Object.entries(PIPELINE_REACHERS)
      .filter(([rel, row]) => row.class === 'BIRTH' && !mintsIn(rel))
      .map(([rel]) => rel);
    expect(
      birthsNotMinting,
      `classified BIRTH but never calls birthConfig: ${birthsNotMinting.join(', ')} — `
      + `a birth that does not mint produces a world with no recorded law, which reads `
      + `as v1 forever even after the dial flips`,
    ).toEqual([]);

    const nonBirthsMinting = Object.entries(PIPELINE_REACHERS)
      .filter(([rel, row]) => row.class !== 'BIRTH' && mintsIn(rel))
      .map(([rel]) => rel);
    expect(
      nonBirthsMinting,
      `classified ${'DERIVED/PREVIEW'} but mints the birth law: ${nonBirthsMinting.join(', ')} — `
      + `a preview or a re-derivation that mints would stamp a new law onto a world `
      + `that already exists, which is the PROMISE breach the version gate exists to prevent`,
    ).toEqual([]);
  });

  it('at least two real BIRTH paths exist (the product can still make worlds)', () => {
    const births = Object.values(PIPELINE_REACHERS).filter(r => r.class === 'BIRTH');
    // The single-settlement store path and the realm composer. If this drops to
    // one, a birth path was retired or silently reclassified.
    expect(births.length).toBeGreaterThanOrEqual(2);
  });

  it('the mint is not named outside its homes and its declared BIRTH callers', () => {
    const allowed = new Set([
      ...MINT_HOMES,
      ...Object.entries(PIPELINE_REACHERS)
        .filter(([, row]) => row.class === 'BIRTH').map(([rel]) => rel),
    ]);
    const strays = sourceFiles().filter(rel => !allowed.has(rel) && mintsIn(rel));
    expect(
      strays,
      `modules naming the birth mint outside its homes and declared BIRTH callers: `
      + `${strays.join(', ')}`,
    ).toEqual([]);
  });
});

/**
 * ⭐ THE SECOND HALF OF THE BOUNDARY (LGT-P8-MATBOUND) — WHICH LAW A BIRTH MINTS.
 *
 * The suite above enforces the CALLER set: which module is a birth. It was
 * written when there was one generation law, so it also assumed the answer to a
 * second question it never asks — WHICH LAW. There are two laws now, and only
 * one of them is on the boundary; the other, the living-content law, has no
 * caller at all. Every mint arm above is spelled with `MINT_SYMBOLS`, which
 * names the density pair, so all of them were blind to it: a car could have
 * wired the living-content mint into a PREVIEW module and nothing here would
 * have said a word.
 *
 * `GENERATION_LAWS` is therefore the same medicine as `PIPELINE_REACHERS`,
 * applied to the other axis: the law set is a declared denominator, and the
 * scan below holds it to the tree. The consequence that matters is the arm
 * marked with a star — an UNWIRED law that acquires a generation-side caller
 * REDS until its row is changed, which is what stops the materialization dial
 * from being reachable from the product before somebody has answered the byte
 * question the row records.
 *
 * ⚠ ONE LAW IS DECLARED HERE RATHER THAN IN THE REGISTER, and the reason is a
 * red this car earned rather than a preference; see `LAWS_OFF_THE_BOUNDARY`.
 */
describe('generation-law register (which LAW a birth mints)', () => {
  /**
   * ⛔ THE LAWS THAT ARE NOT ON THIS BOUNDARY, DECLARED HERE AND NOT IN `src/`.
   *
   * The estate has one `NEW_SETTLEMENT_…` dial that is not a generation law at
   * all: the layout law is a READ law applied at render time, so it is stamped
   * at the SAVE chokepoints rather than at generation, and the boundary module's
   * own header says why that precedent must not transfer to a write law.
   *
   * It is declared HERE rather than as a row in `GENERATION_LAWS` because its
   * module and its mint spell a retired capability's vocabulary, and
   * `tests/lint/settlementMapSurfaceAllowlist.walker.test.js` convicts that
   * vocabulary anywhere under `src/` as an owner-gated question (ODQ §725). The
   * row was written into the boundary module first and RED on the first
   * whole-directory run; that census deliberately does not scan `tests/`, so
   * this is where naming it is free. The knowledge is not lost, only relocated —
   * and it is still machine-checked, because the denominator below counts these
   * members and the earned-ness arm reds if one of them stops existing.
   */
  const LAWS_OFF_THE_BOUNDARY = Object.freeze([
    Object.freeze({
      mint: ['newSettlement', 'MapEdits'].join(''),
      dial: 'NEW_SETTLEMENT_LAYOUT_LAW_VERSION',
      why: 'a READ law, not a generation law: it is applied at render time and stamped at the '
        + 'three save chokepoints, so it never passes through the create boundary and must not '
        + 'be claimed by it. Spelled in two halves so this roster does not itself become a '
        + 'literal of the vocabulary the terminal census governs.',
    }),
  ]);

  /** The module that owns `birthConfig`, i.e. the one place a law is spread into
   *  every BIRTH at once. It is not a pipeline reacher — it is what the reachers
   *  call — so it has to be added to the scan by hand. */
  const MINT_HOME = 'src/domain/density/densityCreateBoundary.js';

  /** Does this module NAME this symbol in executable source? */
  function names(rel, symbol) {
    const code = stripCommentsAndStrings(readFileSync(join(process.cwd(), rel), 'utf-8'));
    return new RegExp(`\\b${symbol}\\b`).test(code);
  }

  /** Every `newSettlement…` mint and `NEW_SETTLEMENT_…` dial exported anywhere
   *  under src/, as {mints, dials}. This is the denominator: it is derived from
   *  the tree, never from the register, so a third law cannot arrive unnamed. */
  function declaredLawSymbols() {
    const mints = new Set();
    const dials = new Set();
    for (const rel of sourceFiles()) {
      const code = stripCommentsAndStrings(readFileSync(join(process.cwd(), rel), 'utf-8'));
      for (const m of code.matchAll(/\bexport\s+function\s+(newSettlement[A-Za-z0-9_]*)\s*\(/g)) {
        mints.add(m[1]);
      }
      for (const m of code.matchAll(/\bexport\s+const\s+(NEW_SETTLEMENT_[A-Z0-9_]+)\b/g)) {
        dials.add(m[1]);
      }
    }
    return { mints: [...mints].sort(), dials: [...dials].sort() };
  }

  const { mints, dials } = declaredLawSymbols();

  it('finds a real denominator (the symbol scan is not vacuous)', () => {
    // Both halves must be non-empty or every assertion below passes on nothing.
    // Two laws plus the layout precedent is the floor the register was written
    // against; a scan that drops under it has broken, not shrunk.
    expect(mints.length).toBeGreaterThanOrEqual(3);
    expect(dials.length).toBeGreaterThanOrEqual(3);
    expect(Object.keys(GENERATION_LAWS).length + LAWS_OFF_THE_BOUNDARY.length)
      .toBeGreaterThanOrEqual(3);
    expect(Object.keys(GENERATION_LAWS).length).toBeGreaterThanOrEqual(2);
  });

  it('every mint and every dial in src/ is accounted for, on the boundary or off it', () => {
    const offMints = new Set(LAWS_OFF_THE_BOUNDARY.map(row => row.mint));
    const offDials = new Set(LAWS_OFF_THE_BOUNDARY.map(row => row.dial));

    const onMints = new Set(Object.values(GENERATION_LAWS).map(row => row.mint));
    const unregisteredMints = mints.filter(m => !onMints.has(m) && !offMints.has(m));
    expect(
      unregisteredMints,
      `these create-boundary mints exist in src/ and nothing accounts for them: `
      + `${unregisteredMints.join(', ')} — decide whether the law is WIRED through `
      + `birthConfig, UNWIRED (and say what blocks it), or off the boundary entirely `
      + `(and say what stamps it instead). An unaccounted mint is how a second law `
      + `silently acquires a birth caller none of the arms above can see.`,
    ).toEqual([]);

    const registeredDials = new Set(Object.values(GENERATION_LAWS).map(row => row.dial));
    const unregisteredDials = dials.filter(d => !registeredDials.has(d) && !offDials.has(d));
    expect(
      unregisteredDials,
      `these NEW_SETTLEMENT_* dials exist in src/ and no row names them: `
      + `${unregisteredDials.join(', ')}`,
    ).toEqual([]);

    // A law is on the boundary or off it, never both, and never neither.
    const both = [...onMints].filter(m => offMints.has(m));
    expect(both, `claimed on the boundary AND off it: ${both.join(', ')}`).toEqual([]);
  });

  it('every off-boundary row is EARNED — it names a law that really exists', () => {
    // The arm that stops this roster becoming a place to park an exemption. A
    // row whose mint or dial has left the tree is a standing excuse for
    // whatever lands under that spelling next.
    for (const row of LAWS_OFF_THE_BOUNDARY) {
      expect(mints, `off-boundary row names ${row.mint}, which src/ no longer exports`)
        .toContain(row.mint);
      expect(dials, `off-boundary row names ${row.dial}, which src/ no longer declares`)
        .toContain(row.dial);
      expect(String(row.why || '').length, `${row.mint} needs a why`).toBeGreaterThan(60);
    }
  });

  it('every row is well-formed, and points at a law that really exists', () => {
    const seenKeys = new Set();
    for (const [id, row] of Object.entries(GENERATION_LAWS)) {
      expect(LAW_WIRING_STATES, `${id} has wiring "${row.wiring}"`).toContain(row.wiring);
      expect(String(row.why || '').length, `${id} needs a why`).toBeGreaterThan(60);
      // The row's own module must declare both the mint and the dial it names,
      // so a row cannot drift away from the law it governs.
      expect(names(row.module, row.mint), `${row.module} must export ${row.mint}`).toBe(true);
      expect(names(row.module, row.dial), `${row.module} must declare ${row.dial}`).toBe(true);
      // One config key per law. Two laws on one key is two truths about a world.
      expect(seenKeys.has(row.configKey), `${row.configKey} is claimed twice`).toBe(false);
      seenKeys.add(row.configKey);
      // ⚠ The config key is NOT re-derived from the module here, deliberately.
      // Two of the three laws declare their key in a dependency-free leaf and
      // reach it through an import SPECIFIER, which is a string and is stripped
      // before this scan ever sees it; the only surviving mention in the law's
      // own file is a comment, and a comment is a citation, never a mint. The
      // key is held instead by each law's own gate test, where it is compared
      // against the real constant rather than against a spelling.
      expect(String(row.configKey || '').length,
        `${id} needs a config key`).toBeGreaterThan(3);
    }
  });

  it('⭐ a law that is not WIRED is named by NO module that reaches the pipeline', () => {
    // THE ARM THAT MAKES THE MATERIALIZATION DIAL SAFE TO FLIP. While a law is
    // UNWIRED, no generation-side module may name it — so wiring it is a visible
    // act that reds here until somebody changes its row to WIRED and, in doing
    // so, answers the question the row records. An OUT_OF_SCOPE law is held to
    // the same line for the opposite reason: it is stamped somewhere else, and a
    // generation-side mention would mean two laws had been confused for one.
    const reachers = pipelineReachers();
    expect(reachers.length, 'the reacher scan must not be empty').toBeGreaterThanOrEqual(4);
    const offTheBoundary = [
      ...Object.values(GENERATION_LAWS)
        .filter(row => row.wiring !== 'WIRED')
        .map(row => ({ mint: row.mint, dial: row.dial })),
      ...LAWS_OFF_THE_BOUNDARY.map(row => ({ mint: row.mint, dial: row.dial })),
    ];
    expect(offTheBoundary.length, 'the arm has nothing to check').toBeGreaterThan(0);
    // ⛔ THE MINT'S OWN HOME IS IN THE DENOMINATOR, AND A PLANT PROVED IT HAS TO
    // BE. The obvious scan is "no pipeline REACHER names it" — and the first
    // plant of this car's own hazard, the living-content mint spread straight
    // into `birthConfig`, sailed past it, because the boundary module does not
    // reach the pipeline: it is what the reachers CALL. A mint added here is
    // minted by every BIRTH at once, which is the widest possible wiring and
    // was the only one the arm could not see.
    //
    // ⛔⛔ AND THE SAME HOLE WAS STILL OPEN ONE FILE FURTHER OUT (lane L-MAT).
    // `pipelineReachers()` finds the five modules that NAME the pipeline, and
    // the estate's own birth-mint home is not one of them: the generation lane
    // mints the law, posts a plain-data request across a worker boundary, and
    // an EXECUTOR under src/workers/ is what actually calls the pipeline. That
    // is exactly the split `reachesVia` exists to record — so a mint of an
    // UNWIRED law placed in `src/store/settlementGenerateAction.js`, the widest
    // per-caller wiring the product has, would have landed SILENTLY GREEN here.
    // MEASURED at this tip: the reacher scan returns 5 files and that one is not
    // among them. The declared rows and the executors they reach through are
    // therefore folded into the scan; `PIPELINE_REACHERS` is already held to the
    // tree by the staleness arm above, so this cannot become a place to hide.
    const scanned = [...new Set([
      ...reachers,
      MINT_HOME,
      ...Object.keys(PIPELINE_REACHERS),
      ...Object.values(PIPELINE_REACHERS)
        .map(row => row.reachesVia)
        .filter(Boolean),
    ])];
    // The denominator this widening exists for, asserted rather than assumed: a
    // declared row that fell out of the scan would take its own mint sites with
    // it, and the arm would go quiet without going red.
    for (const rel of Object.keys(PIPELINE_REACHERS)) {
      expect(scanned, `${rel} is a declared row but is not scanned`).toContain(rel);
    }
    expect(scanned.length).toBeGreaterThan(reachers.length);
    expect(
      scanned,
      'the birth-mint home left the scanned set — the hole this widening closed is open again',
    ).toContain('src/store/settlementGenerateAction.js');
    const strays = [];
    for (const law of offTheBoundary) {
      for (const rel of scanned) {
        if (names(rel, law.mint) || names(rel, law.dial)) {
          strays.push(`${rel} names ${law.mint}`);
        }
      }
    }
    expect(
      strays,
      `a ${'non-WIRED'} generation law is named by a module that reaches the settlement `
      + `pipeline: ${strays.join(', ')} — if this is the wiring car, change the law's row `
      + `in GENERATION_LAWS to WIRED and record what the edge costs; if it is not, the `
      + `mention is a world being born under a law nobody declared.`,
    ).toEqual([]);
  });

  it('every WIRED law is spread by birthConfig, in the mint\'s own home', () => {
    const unspread = Object.values(GENERATION_LAWS)
      .filter(row => row.wiring === 'WIRED' && !names(MINT_HOME, row.mint))
      .map(row => row.mint);
    expect(
      unspread,
      `declared WIRED but ${MINT_HOME} never names the mint: ${unspread.join(', ')} — a law `
      + `that claims to be on the boundary and is not is worse than one that admits it `
      + `is off it, because the claim is what a later reader trusts.`,
    ).toEqual([]);
    // And at least one law really is on the boundary, or `birthConfig` is a
    // wrapper around nothing and every BIRTH arm above proves nothing.
    expect(Object.values(GENERATION_LAWS).some(row => row.wiring === 'WIRED')).toBe(true);
  });

  it('⭐ the re-derivation path reads the world\'s OWN config first, and mints once', () => {
    // THE PROMISE, at the one place the module-level manifest above cannot see
    // it. `settlementSlice.js` is classified BIRTH as a whole, but it holds
    // BOTH the birth action and `regenSection`, and a manifest keyed on modules
    // can never tell them apart. These three facts are what actually keep a
    // regeneration from stamping a law onto a world that already exists, and
    // until now all three were prose in a header rather than assertions.
    const rel = 'src/store/settlementSlice.js';
    const code = stripCommentsAndStrings(readFileSync(join(process.cwd(), rel), 'utf-8'));
    expect(
      /settlement\.config \|\| config/.test(code),
      `${rel}'s re-derivation must read the settlement's own config FIRST — that is `
      + `what makes a markerless v1 world regenerate as v1 after the dial flips`,
    ).toBe(true);
    expect(
      /\bconfig \|\| settlement\.config/.test(code),
      `${rel} reads the store's form config BEFORE the world's own — the wizard's `
      + `config would then decide an existing world's law on its next regeneration`,
    ).toBe(false);
    // ⛔⛔ THE MINT COUNT IS TAKEN AT THE BIRTH ACTION'S REAL HOME, AND THAT IS A CURE
    // (lane L-CHAIR-901, 2026-09-05). This assertion used to count `birthConfig(` inside
    // `settlementSlice.js` and demand exactly one. MEASURED: that file has called it ZERO
    // times at every commit this arm has ever existed at — 0 at the arm's own landing
    // (af17639a8, LGT-P8-MATBOUND) and 0 at the §901 composition base (04bb92d19). The
    // generation lane LEFT THE SLICE at c9611da70 ("WORKER Car 1: the generation lane
    // leaves the slice and runs behind one core, dark"), taking the mint with it, and the
    // arm was authored against the pre-move shape. So it was never green, and the §901
    // composition is where it finally ran: this is a car that shipped a red, not merge
    // damage.
    //
    // ⭐ THE CLAIM IS KEPT AT FULL STRENGTH AND ONLY ITS ADDRESS MOVES. "Exactly one mint
    // call, and a second one is a re-derivation or a preview minting a law" is the law; the
    // file that holds the birth action is `settlementGenerateAction.js`, measured, with one
    // call at its own `geographyLockedConfig(state.locks, state.settlement, birthConfig({…`.
    // The two assertions ABOVE stay on `settlementSlice.js` because the re-derivation half
    // really does still live there — the two halves of this `it` now name two files, which
    // is what the decomposition made true.
    //
    // ⚠ AND THE SLICE'S SILENCE IS ASSERTED RATHER THAN ASSUMED. If the mint ever returns to
    // the slice, `mintCalls` there goes to 1 and this arm reds — so the pair below cannot
    // rot into a green about a file nobody generates from any more.
    const MINT_HOME = 'src/store/settlementGenerateAction.js';
    const mintCode = stripCommentsAndStrings(readFileSync(join(process.cwd(), MINT_HOME), 'utf-8'));
    const mintCalls = (mintCode.match(/\bbirthConfig\(/g) || []).length;
    expect(
      mintCalls,
      `${MINT_HOME} calls birthConfig ${mintCalls} times; exactly one call is the birth `
      + `action, and a second one is a re-derivation or a preview minting a law`,
    ).toBe(1);
    expect(
      (code.match(/\bbirthConfig\(/g) || []).length,
      `${rel} mints a birth law; the birth action lives in ${MINT_HOME} and the slice holds `
      + `regenSection, so a mint here is a regeneration stamping a law onto a world that `
      + `already exists`,
    ).toBe(0);
  });
});

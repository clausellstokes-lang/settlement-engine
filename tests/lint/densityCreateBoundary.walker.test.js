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

/** ⭐ THE CALLS THAT CONSUME THE LOADED PAYLOAD (lane LIGHT car 2c, on the fold's
 *  cure A3). Written as CALL forms — `name(` — so an import binding or a
 *  destructure of a dynamic import is never mistaken for a call: every one of
 *  the seven awaiters names its consumer in an import line ABOVE the await, and
 *  a bare-symbol needle would therefore report the await "preceded" by the very
 *  line that brought the consumer into scope. */
const PAYLOAD_CONSUMER_CALLS = Object.freeze([
  'generateSettlementPipeline(',
  'composeInstantWorld(',
  'runGeneration(',
  'runGenerationRequest(',
  'forgeContentSample(',
  'forgeContentRuntimeComparison(',
]);

const PAYLOAD_AWAIT_CALL = 'await loadGenerationLawPayloads(';

/**
 * ⭐⭐ THE TWO AWAITERS THAT ARM THE SEAM DIRECTLY, DECLARED BY NAME (lane LIGHT,
 * car 3a). This is a TABLE, not a loosened needle: every awaiter not listed here
 * is still held to the exact literal `await loadGenerationLawPayloads(`, and a
 * module that quietly swapped the boundary's aggregate for a single payload
 * loader still reds unless somebody adds it here and says why.
 *
 * ⛔ WHY THEY DEPART, MEASURED. `loadGenerationLawPayloads()` lives on
 * `densityCreateBoundary.js`, which nothing else in a worker's module graph
 * imports, while `livingContentSeam.js` is already in it (the pipeline calls
 * `livingContentRosterFor`). A Web Worker evaluates its OWN copy of the graph, so
 * routing a worker's arming through the aggregate pulls a whole module into a
 * transport bundle that is held under a MONOTONE-DOWN byte ceiling and buys the
 * worker nothing: 31 B on each of the two worker bundles at `dd0b68c0d`. The
 * main-thread reachers keep the aggregate, because they are where "which laws
 * does this generation obey" is answered and they pay no such ceiling.
 *
 * ⚠ AND THE DEPARTURE IS ONLY SOUND WHILE THE AGGREGATE IS THIS ONE LOADER. The
 * arm below the table holds that to the tree: if `loadGenerationLawPayloads()`
 * ever awaits a SECOND payload, these two shells would silently stop arming it,
 * and the arm reds until the rows are revisited.
 *
 * @type {Readonly<Record<string, {call: string, why: string}>>}
 */
const AWAITER_LOADER_CALLS = Object.freeze({
  'src/workers/generation.worker.js': Object.freeze({
    call: 'await loadLivingContentRoster(',
    why: 'a worker bundle under a monotone-down ceiling; the seam is already in its graph and '
      + 'the create boundary is not',
  }),
  'src/workers/customContentPreview.worker.js': Object.freeze({
    call: 'await loadLivingContentRoster(',
    why: 'the same shape as the generation shell, and the same reason; this bundle carries no '
      + 'ceiling test today, so it is held here by argument rather than by bytes',
  }),
});

/** The exact await literal a named awaiter is held to. */
const awaitCallFor = (awaiter) => AWAITER_LOADER_CALLS[awaiter]?.call ?? PAYLOAD_AWAIT_CALL;

/** Every distinct await literal the table admits, the default included. */
const DECLARED_AWAIT_CALLS = Object.freeze([...new Set([
  PAYLOAD_AWAIT_CALL,
  ...Object.values(AWAITER_LOADER_CALLS).map(row => row.call),
])]);

/**
 * ⭐ DOES AN AWAIT OF THE PAYLOAD LOADER PRECEDE A CONSUMER CALL INSIDE ITS OWN
 * FUNCTION BODY? (lane LIGHT car 2c.)
 *
 * ⛔ WHY A PRESENCE TEST WAS NOT ENOUGH, MEASURED BY THE LANE'S OWN SKEPTIC PASS.
 * This arm used to assert only that the literal `await loadGenerationLawPayloads(`
 * appeared SOMEWHERE in each named awaiter's file. Two regressions keep that
 * green and take generation down: an await MOVED below the pipeline call, and an
 * await moved into a branch that the live path skips. Neither deletes a
 * character the old scan looked for.
 *
 * THE SCAN. Start at the await and walk FORWARD with a relative brace depth of
 * zero. A consumer call found while the depth is still >= 0 was reached after
 * the await without the await's own block having closed — the same body, or a
 * block nested inside it, which is the live path either way. The moment the
 * depth would go below zero, the enclosing body has ended and everything after
 * it belongs to a different body, so the await did not arm this consumer.
 *
 * ⚠ IT ASKS FOR ONE SATISFYING AWAIT, NOT ALL OF THEM. A module may arm the seam
 * in a helper as well as on its live edge; requiring every occurrence to be
 * followed by a consumer would convict the helper. The per-row presence arm and
 * the outage arm hold the other half.
 *
 * The code passed in is already comment- and string-stripped, so no brace inside
 * a string or a comment can move the depth.
 *
 * ⚠ THE AWAIT LITERAL IS A PARAMETER, AND IT IS STILL A LITERAL (lane LIGHT, car
 * 3a). The two worker shells arm the seam's own loader rather than the create
 * boundary's aggregate, and the honest way to admit that is to hand this scanner
 * the exact string that row declares in `AWAITER_LOADER_CALLS` — never to widen
 * the needle into a regex that would also accept a call nobody has argued for.
 */
function awaitPrecedesConsumer(code, awaitCall = PAYLOAD_AWAIT_CALL) {
  for (
    let at = code.indexOf(awaitCall);
    at !== -1;
    at = code.indexOf(awaitCall, at + 1)
  ) {
    let depth = 0;
    for (let i = at + awaitCall.length; i < code.length; i += 1) {
      const ch = code[i];
      if (ch === '{') { depth += 1; continue; }
      if (ch === '}') {
        depth -= 1;
        if (depth < 0) break;
        continue;
      }
      if (PAYLOAD_CONSUMER_CALLS.some(call => code.startsWith(call, i))) return true;
    }
  }
  return false;
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

  // ── THE BOUNDARY'S OTHER HALF: THE LAZY PAYLOAD ────────────────────────────
  // ⭐⭐ WHY THIS ARM EXISTS, AND WHY IT IS HERE RATHER THAN IN A BEHAVIOUR SUITE
  // (lane LIGHT, car 1a). A generation law can be obeyed by a module behind a
  // LAZY seam. The living-content law is: its roster lives behind
  // `livingContentSeam.js`'s dynamic import, and the seam fails LOUD rather than
  // quietly when a world's own config says v2 and the payload was never loaded.
  // For the whole of this law's life the loader had NO CALLER in `src/` — the
  // seam defined `loadLivingContentRoster` and nothing invoked it — so lighting
  // the dial would have taken GENERATION DOWN on every path instead of producing
  // a roster. That is not a defect a behaviour suite catches, because a behaviour
  // suite arms the seam by hand; it is a WIRING fact about the caller set, which
  // is exactly what this walker is for.
  //
  // The manifest above already answers "which module reaches the pipeline". This
  // arm holds the second answer to the tree: for every such module, WHO awaits
  // the payload before it runs. The list is per-row because a reacher can be
  // entered from more than one module instance — the generation core is entered
  // in-thread by the store's lane and inside a Web Worker by the worker shell,
  // and a worker evaluates its own copy of the seam, so a main-thread load does
  // not arm it.
  it('⭐ every reacher declares who awaits the lazy generation-law payload, and they really do', () => {
    const AWAIT_CALL = PAYLOAD_AWAIT_CALL;
    // ANTI-VACUITY, FIRST AND ON THE MATCHER ITSELF, FOR EVERY DECLARED NEEDLE.
    // An absence-shaped scan whose needle never matches anything reports every
    // tree clean, and the table admits two needles now, not one.
    expect(DECLARED_AWAIT_CALLS.length).toBeGreaterThanOrEqual(2);
    for (const needle of DECLARED_AWAIT_CALLS) {
      expect(
        `const x = 1; ${needle});`.includes(needle),
        `the needle ${needle} cannot match its own positive control`,
      ).toBe(true);
      expect(
        'const bundle = composeInstantWorld({ seed });'.includes(needle),
        `the needle ${needle} matches a line that does NOT await a loader — it proves nothing`,
      ).toBe(false);
    }
    // ⛔ AND THE TWO NEEDLES MUST NOT BE INTERCHANGEABLE. If the worker rows'
    // literal were a prefix or a superstring of the default, declaring a row
    // would quietly excuse it from both checks at once.
    expect(
      DECLARED_AWAIT_CALLS.some(needle => needle !== AWAIT_CALL && needle.includes(AWAIT_CALL)),
      'a declared await literal CONTAINS the default one, so the table cannot tell them apart',
    ).toBe(false);
    expect(
      Object.keys(AWAITER_LOADER_CALLS).every(rel => String(AWAITER_LOADER_CALLS[rel].why).length > 40),
      'a declared departure from the aggregate needs a reason, not just a different string',
    ).toBe(true);

    // ⭐ AND THE SAME CONTROL ON THE ORDERING SCANNER, IN THE SHAPES THIS ESTATE
    // ACTUALLY SHIPS (lane LIGHT car 2c). A control that cannot exercise the
    // shipped shape hides the defect it was written for, so all four of these are
    // the real shapes of the seven awaiters: a worker shell's `try`, and a
    // pre-branch await above two branches.
    const SHAPE_WORKER_OK = 'self.onmessage = async (event) => {\n'
      + '  try {\n'
      + '    await loadGenerationLawPayloads();\n'
      + '    const result = runGenerationRequest(request);\n'
      + '  } catch (error) { report(error); }\n};';
    const SHAPE_WORKER_MOVED = 'self.onmessage = async (event) => {\n'
      + '  try {\n'
      + '    const result = runGenerationRequest(request);\n'
      + '    await loadGenerationLawPayloads();\n'
      + '  } catch (error) { report(error); }\n};';
    const SHAPE_BRANCHES_BELOW = 'async function run(config) {\n'
      + '  await loadGenerationLawPayloads();\n'
      + '  if (isRealm) {\n'
      + '    const { settlements } = composeInstantWorld({ seed });\n'
      + '  } else {\n'
      + '    const dossier = generateSettlementPipeline(config, null, { seed });\n'
      + '  }\n}';
    const SHAPE_AWAIT_IN_DEAD_BRANCH = 'async function run(config) {\n'
      + '  if (needsPayload) {\n'
      + '    await loadGenerationLawPayloads();\n'
      + '  }\n'
      + '  const bundle = composeInstantWorld({ seed });\n}';
    expect(
      awaitPrecedesConsumer(SHAPE_WORKER_OK),
      'the ordering scanner cannot see the shipped worker shape it is written for',
    ).toBe(true);
    expect(
      awaitPrecedesConsumer(SHAPE_BRANCHES_BELOW),
      'the ordering scanner cannot see an await that arms BOTH branches below it, which is'
      + ' ConstructionPanel.jsx\'s shipped shape',
    ).toBe(true);
    expect(
      awaitPrecedesConsumer(SHAPE_WORKER_MOVED),
      'the ordering scanner passes an await MOVED BELOW the pipeline call — the exact'
      + ' regression the old presence test could not see',
    ).toBe(false);
    expect(
      awaitPrecedesConsumer(SHAPE_AWAIT_IN_DEAD_BRANCH),
      'the ordering scanner passes an await parked in a branch that closes before the'
      + ' pipeline call, which arms nothing on the live path',
    ).toBe(false);

    // ⭐ AND THE SHIPPED WORKER SHAPE AS THE TABLE NOW DECLARES IT (car 3a): the
    // same `try`, arming the SEAM'S loader. A control written only against the
    // aggregate would leave the two worker rows scanned by nothing they ship.
    const SEAM_CALL = 'await loadLivingContentRoster(';
    const SHAPE_WORKER_SEAM_OK = 'self.onmessage = async (event) => {\n'
      + '  try {\n'
      + '    await loadLivingContentRoster();\n'
      + '    const result = runGenerationRequest(request);\n'
      + '  } catch (error) { report(error); }\n};';
    const SHAPE_WORKER_SEAM_MOVED = 'self.onmessage = async (event) => {\n'
      + '  try {\n'
      + '    const result = runGenerationRequest(request);\n'
      + '    await loadLivingContentRoster();\n'
      + '  } catch (error) { report(error); }\n};';
    expect(
      DECLARED_AWAIT_CALLS.includes(SEAM_CALL),
      'the worker rows no longer declare the seam loader this control is written for',
    ).toBe(true);
    expect(
      awaitPrecedesConsumer(SHAPE_WORKER_SEAM_OK, SEAM_CALL),
      'the ordering scanner cannot see the shipped worker shape with the seam\'s loader',
    ).toBe(true);
    expect(
      awaitPrecedesConsumer(SHAPE_WORKER_SEAM_MOVED, SEAM_CALL),
      'the ordering scanner passes a seam-loader await MOVED BELOW the pipeline call',
    ).toBe(false);
    // ⛔ AND THE NEEDLES DO NOT COVER FOR EACH OTHER: the shipped worker shape
    // read with the DEFAULT needle must fail, or a worker that stopped arming
    // anything at all would still pass under whichever needle happened to match.
    expect(
      awaitPrecedesConsumer(SHAPE_WORKER_SEAM_OK, AWAIT_CALL),
      'the default needle matches a body that only arms the seam loader',
    ).toBe(false);
    expect(
      awaitPrecedesConsumer(SHAPE_WORKER_OK, SEAM_CALL),
      'the seam needle matches a body that only awaits the aggregate',
    ).toBe(false);

    const offenders = [];
    const consumersSeen = new Set();
    for (const [rel, row] of Object.entries(PIPELINE_REACHERS)) {
      const named = row.payloadAwaitedBy;
      if (!Array.isArray(named) || named.length === 0) {
        offenders.push(`${rel}: no payloadAwaitedBy — say which module awaits the payload `
          + 'before this row reaches the pipeline');
        continue;
      }
      for (const awaiter of named) {
        let code;
        try {
          code = stripCommentsAndStrings(readFileSync(join(process.cwd(), awaiter), 'utf-8'));
        } catch { offenders.push(`${rel}: ${awaiter} does not exist`); continue; }
        // The literal this awaiter is held to: the boundary's aggregate unless
        // `AWAITER_LOADER_CALLS` declares a departure for it, with a reason.
        const declaredCall = awaitCallFor(awaiter);
        if (!code.includes(declaredCall)) {
          offenders.push(`${rel}: ${awaiter} no longer contains ${declaredCall.trim()})`);
          continue;
        }
        // ⭐ THE ORDERING HALF (cure A3). Presence is not arming.
        if (!awaitPrecedesConsumer(code, declaredCall)) {
          offenders.push(`${rel}: ${awaiter} awaits the payload, but NOT before the generation `
            + 'call in the same function body — the await was moved below it, or into a branch '
            + 'the live path does not take');
        }
        for (const call of PAYLOAD_CONSUMER_CALLS) {
          if (code.includes(call)) consumersSeen.add(call);
        }
      }
    }
    expect(
      offenders,
      'a module that can reach generateSettlementPipeline has lost the await that loads the '
      + 'generation laws\' lazy payloads, or no longer takes it BEFORE the generation call. '
      + 'On a world whose config carries the living-content '
      + 'law that is not a degraded world, it is NO world: the seam throws '
      + '"[livingContentSeam] v2 world, roster payload not loaded" out of the pipeline. '
      + 'Restore the await above the call, or move the row\'s payloadAwaitedBy to whatever '
      + 'module owns it now. Offenders: '
      + `${offenders.join(' | ')}`,
    ).toEqual([]);
    // ⛔ AND THE NEEDLE LIST ITSELF IS HELD TO THE TREE. A consumer that gets
    // renamed silently stops being a consumer, and every awaiter would then pass
    // the ordering scan by arming nothing at all.
    expect(
      PAYLOAD_CONSUMER_CALLS.filter(call => !consumersSeen.has(call)),
      'a declared payload-consumer call is named by NO awaiter. Either it was renamed — in '
      + 'which case the ordering scan above is now blind to that module — or it is a stale '
      + 'needle that should be removed with its reason.',
    ).toEqual([]);
  });

  // ── THE PRICE OF THE TWO DECLARED DEPARTURES ────────────────────────────────
  // ⭐⭐ WHY THIS ARM EXISTS (lane LIGHT, car 3a). The two worker shells arm the
  // SEAM'S loader instead of the create boundary's aggregate, to keep a module
  // the worker needs for nothing out of a bundle held under a monotone-down byte
  // ceiling. That shortcut is sound for exactly one reason: the aggregate awaits
  // one payload and it is the one they arm. The day a second generation law puts
  // a payload behind a lazy seam, `loadGenerationLawPayloads()` grows a second
  // await, every main-thread reacher picks it up for free, and the two workers
  // silently stop arming it: a v-next world would then throw out of the worker
  // and generate fine in-thread, which is the worst shape a defect can take.
  // Nothing else in the estate would notice, so this arm is the notice.
  it('⭐ each declared worker departure arms the WHOLE of the boundary aggregate', () => {
    const BOUNDARY = 'src/domain/density/densityCreateBoundary.js';
    const code = stripCommentsAndStrings(readFileSync(join(process.cwd(), BOUNDARY), 'utf-8'));
    const head = 'export async function loadGenerationLawPayloads(';
    const at = code.indexOf(head);
    expect(at, `${BOUNDARY} no longer declares the aggregate where this arm reads it`)
      .toBeGreaterThan(-1);

    // The body, taken brace to matching brace, so a later function's awaits
    // cannot be read as this one's.
    const open = code.indexOf('{', at + head.length);
    expect(open, 'the aggregate has no body').toBeGreaterThan(-1);
    let depth = 0;
    let end = -1;
    for (let i = open; i < code.length; i += 1) {
      if (code[i] === '{') depth += 1;
      else if (code[i] === '}') { depth -= 1; if (depth === 0) { end = i; break; } }
    }
    expect(end, 'the aggregate\'s body does not close').toBeGreaterThan(open);
    const body = code.slice(open, end + 1);
    // Positive control on the scanner before anything is concluded from it.
    expect(
      [...'{ await someLoader(); }'.matchAll(/await\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(m => m[1]),
      'the awaited-loader scanner cannot see its own positive control',
    ).toEqual(['someLoader']);

    const awaited = [...body.matchAll(/await\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(m => m[1]);
    expect(
      awaited.length,
      `${BOUNDARY}'s aggregate awaits ${awaited.length} payload loader(s) (${awaited.join(', ')}). `
      + 'The worker shells declared in AWAITER_LOADER_CALLS arm ONE loader directly, which is '
      + 'sound only while the aggregate is that one loader. A second payload here is invisible '
      + 'to both workers: revisit the two rows, and give the workers whatever they now miss.',
    ).toBe(1);
    expect(
      [...new Set(Object.values(AWAITER_LOADER_CALLS).map(row => row.call))],
      `the declared worker departures do not arm ${awaited[0]}, which is what the aggregate awaits`,
    ).toEqual([`await ${awaited[0]}(`]);

    // ⛔ AND NO STALE ROWS. A departure declared for a module no reacher names is
    // an excuse sitting in the tree waiting to cover a module that acquires the
    // name later.
    const namedAwaiters = new Set(
      Object.values(PIPELINE_REACHERS).flatMap(row => row.payloadAwaitedBy || []),
    );
    const stale = Object.keys(AWAITER_LOADER_CALLS).filter(rel => !namedAwaiters.has(rel));
    expect(
      stale,
      `AWAITER_LOADER_CALLS excuses ${stale.join(', ')}, which no PIPELINE_REACHERS row names `
      + 'as an awaiter at all',
    ).toEqual([]);
  });

  it('the payload loader has a caller in src/ at all (the outage arm)', () => {
    // ⛔ THE FLAT FACT, KEPT SEPARATE FROM THE PER-ROW ARM ABOVE. The per-row arm
    // can only convict a module the manifest already names; this one convicts an
    // estate in which the boundary's async edge itself went uncalled, which is
    // the state `src/` was actually in until lane LIGHT.
    const callers = sourceFiles()
      .filter(rel => stripCommentsAndStrings(readFileSync(join(process.cwd(), rel), 'utf-8'))
        .includes('loadGenerationLawPayloads('))
      // The boundary DECLARES it; a declaration is not a call.
      .filter(rel => rel !== 'src/domain/density/densityCreateBoundary.js');
    expect(
      callers.length,
      'nothing in src/ names the create boundary\'s async payload edge. That is the exact '
      + 'state this estate shipped in for the whole dormant life of the living-content law, '
      + 'and it is why lighting the dial would have taken generation down rather than '
      + 'produced a roster.',
    ).toBeGreaterThan(1);
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
    // ⚠ THE ARM THAT USED TO SIT HERE WAS A TAUTOLOGY, AND IT IS DELETED (§912,
    // DEF-6). It looped `Object.keys(PIPELINE_REACHERS)` asserting each key was in
    // `scanned` — a set built two statements above by spreading those very keys
    // into it. It was TRUE FOR EVERY POSSIBLE TREE, including one where the
    // widening had been reverted, so it guarded nothing while reading like the
    // denominator's guard. What it CLAIMED to protect ("a declared row that fell
    // out of the scan") cannot happen by construction; what actually protects the
    // denominator is the staleness arm above, which holds `PIPELINE_REACHERS` to
    // the tree, and the two assertions below, both of which can die.
    expect(scanned.length).toBeGreaterThan(reachers.length);
    expect(
      scanned,
      'the birth-mint home left the scanned set — the hole this widening closed is open again',
    ).toContain('src/store/settlementGenerateAction.js');
    const strays = [];
    for (const law of offTheBoundary) {
      for (const rel of scanned) {
        // ⚠ NAME WHAT ACTUALLY MATCHED (§912, DEF-6). This used to report
        // `names ${law.mint}` on both branches, so a DIAL match sent the reader
        // hunting for a mint symbol that is not in the file — the failure message
        // of a walker is read exactly once, at the worst possible moment, and a
        // wrong symbol there costs more than the arm saves.
        const matched = [
          names(rel, law.mint) ? law.mint : null,
          names(rel, law.dial) ? law.dial : null,
        ].filter(Boolean);
        if (matched.length) strays.push(`${rel} names ${matched.join(' and ')}`);
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

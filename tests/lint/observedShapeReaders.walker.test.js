/**
 * observedShapeReaders.walker.test.js — THE READER-WITH-NO-WRITER RATCHET, pinned
 * and PROVEN against the three defects that motivated it.
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────
 * A reader asks a record for a key NO WRITER EVER PRODUCES, and it is invisible
 * because the read is DEFENSIVELY GUARDED — `governing?.id`, `String(x.foo ||
 * '')`, `containers.find(r => Array.isArray(r.exports))`. It cannot throw. It
 * degrades to a default, and the arm behind it is structurally dead on every
 * generated world, forever, silently. Three were found by accident in one week,
 * during a typecheck census that was looking for something else:
 *
 *   TCD-1  `.id` on a RulingFaction at 9 sites (rulingPower.js, warSeatBooks.js
 *          ×2, applyWorldPulse.js). 0 of 78 generated faction rows carry `id`.
 *          Consequence: a NEWS ADDRESS LAW address-chain gap.
 *   TCD-2  `ownExportsOf` probed `exports` on economicState / economy / trade.
 *          Two of those containers do not exist; the third never carries
 *          `exports`. The `'known'` arm was structurally dead.
 *   TCD-3  `satellite.foundingTier` — no writer at all.
 *
 * The recorded `faction-key-defect-class` is a fourth instance. Nobody knew how
 * many more there were. This file is the answer and the standing guard.
 *
 * ── ⭐⭐ THE AUTHORITY THIS FILE DRIVES IS THE HEURISTIC LEG (schema 4) ────────
 *
 * It used to drive the EXACT resolver over the whole estate. It cannot any more,
 * and the reason is measured, not stylistic: a full-tree exact scan WALLS at
 * `src/data/constants.js:56` on `abstract-state growth steps 16385 > 16384`
 * (~4.2 min on a 12 GB heap; at a default heap the process OOMs before the
 * growth budget can even fire). `budgetFailure` THROWS and nothing catches it,
 * so the `beforeAll` hook here exploded — and vitest reports that as a FAILED
 * suite whose every test is a SKIP. Twenty-four tests silently drained into the
 * skip ceiling. That is precisely the hole CR-TRFZ-4 was built to expose, and
 * this file was its motivating instance.
 *
 * CR-OSR-FREEZE-1/2/3-R1 retired full-tree exact resolution as an ambition and
 * made the governed heuristic (`legacy-leaf`) detector the standing authority.
 * So this walker drives THAT detector, against the schema-4 leaf identity
 * `<key> on <shape>` with a per-file MULTIPLICITY. MEASURED at this tree: the
 * live scan costs ~3.3 s (the exact one cost 13.4–15.9 s when it completed at
 * all), 2,083 files, 120,442 reads, 9,265 resolved, 2,196 findings across 397
 * files / 1,527 identities.
 *
 * ⚠ WHAT DID NOT CHANGE: every mutant below. All seven planted probes were
 * RE-MEASURED under the leaf detector before this file was rewired, and each
 * reports byte-identically to what it reported under the exact one — the five
 * positives fire, both negative controls stay silent. A detector swap that
 * quietly weakened the instrument would have shown up there first.
 *
 * ── THE ACCEPTANCE, EXECUTED, AND WHY IT IS THE WHOLE POINT ──────────────────
 * A walker that cannot rediscover the defects that motivated it is vacuous. So
 * the instrument was driven at eca65c8a — a PRE-FIX sha where all three still
 * exist — in an integrity-counted `git archive` (6,168 tracked paths in, 6,168
 * extracted), with the corpus DERIVED INSIDE THAT ARCHIVE so both halves of the
 * measurement belong to one commit. It reported all three:
 *
 *   TCD-1  src/domain/rulingPower.js:225        `faction?.id`     @factions
 *          + 31 further `.id`-on-a-faction reads across 12 modules
 *   TCD-2  envoyNegotiationPictureBuilder.js:137 `settlement.economy`  @settlement
 *                                          :138 `settlement.trade`    @settlement
 *                                          :140 `row.exports`         @economicState
 *                                          :142 `container.exports`   @economicState
 *   TCD-3  lineageMemberBirth.js:178            `satellite.foundingTier` @steadings
 *
 * ⚠ THE ACCEPTANCE RUN IS NOT RE-EXECUTED HERE. It needs a second checkout of a
 * historical sha, and this program's concurrency law refuses a second worktree.
 * What runs on every gate instead is the LIVE instrument plus the planted
 * mutants below, which drive the identical detector.
 *
 * ── ⚠⚠ THE INVENTORY IS CORPUS-SENSITIVE, AND NOT ONLY WHERE YOU EDITED ──────
 * The layering repair at 67f8a58e once turned this walker red in ELEVEN files,
 * NINE of which that commit never touched, their source byte-identical across
 * it. MEASURED then: the corpus and the reads were IDENTICAL; only RESOLVED
 * moved (12,411 -> 12,433). Perturbing the scanned file SET re-grounds
 * receivers. The heuristic leg is if anything MORE corpus-sensitive, because it
 * grounds a receiver by a name prior over the observed shape set: as the corpus
 * gains shapes, a name that had a single home acquires several and stops
 * resolving at all.
 *
 * WHAT THAT MEANS FOR YOU. Do not read a row as a confirmed defect without
 * checking the site. And expect this walker to red on any commit that adds or
 * moves source files, in files that commit never touched: that is this property,
 * not a regression you caused.
 *
 * ── WHAT THIS FILE PINS ─────────────────────────────────────────────────────
 *   1. STATIC — the baseline is internally consistent, every row names a real
 *      file, and the frozen thresholds match the script's own constants.
 *   2. EXECUTED CORPUS — the producers are RUN (once, shared by every assertion
 *      below) and the corpus is proved to have observed the four shapes the
 *      three defects live on, with the exact key ABSENCES that make the class
 *      real. An empty corpus greens everything; this is the pin that makes every
 *      other green here mean something.
 *   3. EXECUTED MUTANTS — synthetic readers of keys PROVEN to have no writer are
 *      planted into the scanned set and the walker MUST report them, with
 *      negative controls (observed keys, array surface) that must stay silent.
 *      A walker that stays green under its own mutant is not a walker.
 *   4. EXECUTED GROWTH LAW — the shrink-only comparison is driven against a
 *      LIVE-DERIVED inventory in both directions: clean is green, and a single
 *      planted finding reds with its identity named. A growth rule that only
 *      exists in a test TITLE constrains nothing.
 *   5. EXECUTED SWAP MUTANT — the one that beat the ratchet's FIRST form.
 *   6. THE CR-OSR-FREEZE-7 UI COHORT — derived from the live scan, pinned at its
 *      MEASURED size, and proved to be under enforcement rather than excluded.
 *
 * ── ⚠⚠ WHY THE INVENTORY IS CONTENT-ADDRESSED (the swap that beat form one) ──
 * The first spelling froze ONE NUMBER per file. A number cannot tell a defect
 * from its neighbour: a verifier drove it live on `src/domain/rulingPower.js`
 * (ceiling 10) and showed that REMOVING one real finding and ADDING a different
 * one leaves the count unchanged — so a fresh reader-without-a-writer lands and
 * the ratchet reports nothing. The inventory freezes the finding IDENTITY with
 * its multiplicity, and a NEW identity in an already-listed file has ceiling 0
 * exactly as a new file does. That exact mutant is driven twice below —
 * synthetically, and against the LIVE rulingPower.js findings at constant count.
 */
import { readFileSync, existsSync, writeFileSync, mkdtempSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, test, beforeAll } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import {
  buildObservedCorpus,
  OBSERVED_SCALAR_FIELDS,
} from '../../scripts/lib/observed-shape-corpus.mjs';
import { scanReaders as scanLegacyReaders } from '../../scripts/lib/legacy-reader-shape-scan.mjs';
import {
  applyDomGlobalReceiverFilter, applyExplainedWriterFilter, applyLanguageSurfaceFilter,
  applyShapeFamilyFilter,
  applyVirtualDormantWriterFilter,
  assertExplainedWriterRowTags,
  assertVirtualDormantWriterEvidence, assertVirtualDormantWriters,
  VIRTUAL_DORMANT_WRITERS, virtualDormantWriterNotice, VIRTUAL_FLAG_MANIFEST,
  provenanceDriftOf, isDetectorSourcePath, DETECTOR_INPUT_PATHS,
  scannerToolFiles as scannerToolFilesOf, subjectFiles as subjectFilesOf,
  sourceFiles as sourceFilesOf,
  BASELINE_SCAN_MODE, BASELINE_SCHEMA, CLASS_A_PROTECTED_IDENTITIES, cohortOf, compare,
  EXACT_SCAN_EXCLUDED_SCOPE,
  EXPLAINED_WRITER_EXEMPTIONS,
  identityOf, inventoryOf, isExactScanExcludedReadPath, MIN_ROWS, ORIGIN_MIN_ROWS,
  ratchetMessage, rowOf, sentinelFailures, sentinelOf, sourceFiles, UNREVIEWED_UI_COHORT,
} from '../../scripts/check-observed-shape-readers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Repository-relative, forward-slash — the spelling every manifest entry uses. */
const relativeToRoot = (file) => file.slice(ROOT.length + 1).split('\\').join('/');
/** The live `{path, sha256}` manifest rows for a file list, as the snapshot builds them. */
const liveManifestEntries = (files) => files.map((file) => ({
  path: relativeToRoot(file),
  sha256: createHash('sha256').update(readFileSync(file)).digest('hex'),
}));
const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.observed-shape-readers-baseline.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

// ── ⛔ THE GOVERNED `--write` WAS HALF A CURE, AND THIS IS THE OTHER HALF ──────
//
// THE DEFECT. The shrink-only arm below tells a reader, in terms, that "a lawful
// shrink is `node scripts/check-observed-shape-readers.mjs --write` ... NEVER
// hand-edit a row". A lane that follows that instruction EXACTLY re-freezes the
// register, watches the plain script exit 0 — and still lands the walker RED,
// because this file kept its own HARDCODED TWINS of the very figures the
// `--write` re-derives (`reads`/`identities`/`files` were literal `1999`/`1412`/
// `388` beside a register holding exactly those three). The governed write is
// blind to a test-file literal. SEAT-5 shipped that red by obeying the script.
//
// An instrument whose documented remediation leaves it red is not a strict
// instrument; it is one that trains lanes to hand-edit the thing it forbids.
//
// THE CURE — ONE HOME PER FIGURE, chosen by WHO IS ALLOWED TO MOVE IT:
//
//   * the TREE-SHAPED figures (`reads`, `identities`, `files`) live in the
//     REGISTER, because `baselineOf` re-derives all three from ONE scan and a
//     lawful `--write` may only shrink them. Read them from there and the
//     `--write` moves both sides of the assertion in a single act.
//   * the BANK (`bankedReads`/`taggedRows`) keeps its LITERAL at the register
//     pin below, because the bank is the one figure a derived re-freeze may
//     never RAISE — only the governed reasoned path may — so a literal is
//     exactly right there and a red on it is the governed event, announced.
//
// NOTHING BECOMES A SELF-COMPARISON. `registerFigures()` reads the FROZEN
// register; the triple arm compares it against a LIVE full-tree scan, and the
// bank arm compares the register's persisted `rowTags` against the governed
// literal. Two independent productions on each side of both assertions.
/** The register's tagged rows, one derivation shared by every consumer. */
const registerRowTagRows = () => Object.entries(baseline.rowTags).flatMap(([file, row]) => (
  Object.keys(row).map((identity) => ({
    file, identity, count: baseline.inventory[file][identity],
  }))
));

/** The frozen inventory triple + bank, AS THE REGISTER HOLDS THEM. */
const registerFigures = () => {
  const rows = registerRowTagRows();
  return {
    reads: baseline.total,
    identities: baseline.identities,
    files: Object.keys(baseline.inventory).length,
    bankedReads: rows.reduce((sum, row) => sum + row.count, 0),
    taggedRows: rows.length,
  };
};

/** A heuristic-leaf finding: six keys exactly, no `site` and no `origins`. */
const leafFinding = (file, pos, key, shape) => ({
  file, line: 1, pos, key, shapes: [shape], text: `row.${key}`,
});
const leafIdentity = (key, shape) => `${key} on ${shape}`;

/** The producers run ONCE for the whole file. Every executed pin reads this. */
let corpus = null;
let scalarCorpus = null;
let live = null;
/** The estate's file list, walked ONCE — every scan below reuses it. */
let estate = null;

/**
 * ⚠⚠ THE SCAN BUDGET — why this file counts its own full-tree scans.
 *
 * This file used to run SIX full-tree scans — one live, plus one per mutant —
 * and five of them ran INSIDE TEST BODIES against the bare global
 * `testTimeout: 20000` (vite.config.js). The exact scan cost 13,447–15,904 ms
 * under full-suite contention: a 1.26x worst-case margin, and it did not hold.
 * Three full-suite runs at ONE sha produced 0, 2 and 5 failures, all TIMEOUTS
 * with no assertion diff (`Error: STACK_TRACE_ERROR`, 21,173–26,069 ms). A flaky
 * gate is worse than a red one — it teaches everyone to re-run until green and
 * it silently invalidates every census taken through it.
 *
 * The cure was the one the cost demanded: cut the work, do not buy headroom. The
 * scans happen TWICE, both inside `beforeAll` hooks, and `scansRun` is pinned
 * below so re-introducing a per-test scan reds instead of flaking. The heuristic
 * detector is far cheaper (~3.3 s MEASURED), but the discipline stays: a cheap
 * scan multiplied by twenty is not cheap.
 *
 * ── ⚠⚠ THE HOOK BUDGET WAS SIZED AGAINST THE SOLO FIGURE AND WAS A LATENT FLAKE
 * The budget was 300 s because this header believed "the corpus build alone is
 * ~47 s". That 47 s is the SOLO cost. MEASURED 2026-08-11 with the full suite
 * running in parallel, which is the only condition the gate ever runs this in:
 *
 *     buildObservedCorpus()   251,002 ms      ← 84% of the old 300 s budget
 *     the detector scan        11,675 ms
 *     the two schema-5 filters    108 ms      ← 0.04% of the total
 *     ────────────────────────────────────
 *     top-level beforeAll     ~263,700 ms
 *
 * A 300 s budget over a 264 s job is a 1.14x margin — the same shape as the 1.26x
 * margin recorded above, which "did not hold" — and it duly did not hold here
 * either: the hook timed out at 306,759 ms in a full `npm run check`, taking all
 * 27 tests out of the census as SKIPS, which the test ratchet's scope sentinel
 * correctly refuses as vacuous.
 *
 * ⚠ THIS IS A RE-SIZING AGAINST A MEASUREMENT, NOT HEADROOM-BUYING, and the
 * distinction is the whole reason the numbers are above rather than described.
 * There is no work left to cut: the corpus build IS this walker's premise, the
 * scan count is already pinned at two, and the filters that were ADDED in the
 * same change are 0.04% of the cost — arithmetically incapable of being what
 * tipped it. 900 s is 3.4x the measured contended cost, so a genuine collapse
 * (a corpus that stops terminating) still reds rather than hanging the gate.
 */
let scansRun = 0;

/**
 * The one place the detector is called. `extraFiles` are planted probes.
 *
 * ⭐⭐ THE WALKER MUST MEASURE WHAT THE GATE MEASURES — the walker-census law. Under
 * schema 7 the frozen numeric inventory is narrowed by THREE clearing filters and
 * keeps M8/M9 rows banked, so a walker that compared RAW output against it would
 * report every filtered row as a violation and stay red forever, and whoever
 * silenced it would have disabled the guard rather than fixed the walker. All four
 * filters are therefore applied HERE, in the same order `run()` applies them.
 *
 * ⛔ THE STANDING HAZARD THIS COMPOSITION IS: it is COMPOSED BY HAND, so a mint
 * that adds a filter to `run()` and not to this line leaves a walker that greens
 * on rows the gate clears — a disabled guard that reports success. Any change to
 * the chain in `run()` is a change HERE, in the SAME commit, and the arithmetic
 * pin below is what turns a forgotten one into a red instead of a silent pass.
 *
 * ⚠ `stats` passes through all four stages BY IDENTITY, so `live.stats` is still
 * the DETECTOR's reach and the anti-vacuity arm below keeps measuring the detector
 * rather than the filters. That is the property that stops a threshold from ever
 * being tuned into hiding a corpus that stopped observing.
 */
function scanEstateWith(extraFiles = []) {
  scansRun += 1;
  const raw = scanLegacyReaders({
    files: extraFiles.length ? [...estate, ...extraFiles] : estate,
    shapes: corpus.shapes,
    arrayShapes: corpus.arrayShapes,
    singleHome: corpus.singleHome,
    rootShapes: corpus.rootShapes,
    minRows: MIN_ROWS,
    root: ROOT,
  });
  const family = applyShapeFamilyFilter({ scanMode: BASELINE_SCAN_MODE, corpus, scan: raw });
  const domGlobals = applyDomGlobalReceiverFilter({
    scanMode: BASELINE_SCAN_MODE, corpus, scan: family,
  });
  const language = applyLanguageSurfaceFilter({
    scanMode: BASELINE_SCAN_MODE, corpus, scan: domGlobals,
  });
  // ⭐ M13 (TE-OSHAPE-1) — the fourth door. The walker's composition must match the
  // gate's chain or it measures a different instrument, which is why this stage is added
  // here rather than only in the script.
  const explained = applyExplainedWriterFilter({ scanMode: BASELINE_SCAN_MODE, scan: language });
  return {
    ...applyVirtualDormantWriterFilter({ scanMode: BASELINE_SCAN_MODE, scan: explained }),
    raw,
  };
}

beforeAll(async () => {
  corpus = await buildObservedCorpus();
  scalarCorpus = await buildObservedCorpus({ scalarFields: OBSERVED_SCALAR_FIELDS });
  estate = sourceFiles(ROOT);
  live = scanEstateWith();
}, 900_000);

describe('reader-with-no-writer ratchet: the frozen inventory', () => {
  test('the baseline is CONTENT-ADDRESSED, internally consistent, and every row is a real file', () => {
    expect(baseline.schema, 'schema 1 was the count-only form — blind to an identity swap;'
      + ' schema 3 was the RETIRED exact per-site form, which no full-tree scan can produce;'
      + ' schema 4 was the RETIRED UNFILTERED leaf form; schema 5 was the RETIRED leaf form'
      + ' narrowed by M6 and M8/M9 alone, whose rows still include the browser-surface and'
      + ' language-surface reads the declared M11 and M12 post-filters explain')
      .toBe(BASELINE_SCHEMA);
    expect(assertExplainedWriterRowTags(baseline)).toBe(baseline);
    const persistedTags = registerRowTagRows();
    // ⛔ THE ONE LITERAL THAT STAYS A LITERAL, and the reason is WHO MAY MOVE IT: a
    // derived `--write` re-freeze may only LOWER or DELETE rows, so the bank can never
    // GROW except by the governed reasoned path. A frozen number is therefore the right
    // instrument here — a red on it is that governed event announcing itself — whereas
    // the tree-shaped triple below reads the register, which the `--write` owns.
    expect({
      reads: persistedTags.reduce((sum, row) => sum + row.count, 0),
      addresses: persistedTags.length,
    // ⭐ 64/43 → 62/41 AT THE SCHEMA-17 RUNG, and this is the literal doing exactly the
    // job its note describes: the governed migration DELETED the two banked
    // `isCriminal on incomeSources` addresses (EconomicsTab.jsx, treasury.js) because the
    // stress-loaded topology pass made their writer OBSERVABLE, so the reads stopped being
    // findings at all. A shrink of a bank is as much a governed event as a growth, and the
    // red on this line is that event announcing itself.
    // ⭐ 62/41 → 60/39 ON 2026-09-17 AT THE SCHEMA-19 RUNG, AND THIS LINE IS WHERE THAT
    // GOVERNED EVENT WENT UNANNOUNCED FOR THREE COMMITS. The retirement (c4661fe48) moved
    // every LIVE-side pin the same day — `live.explainedWriters.banked` 62 → 60, the
    // clear-outright figure, the exact banked list, both per-identity maps — and
    // deliberately left THIS one, saying so in the map below: "the register's two tagged
    // rows leave when the governed re-freeze absorbs them, which is what moves the 62/41
    // literal above to 60/39". The rung (ae8bc5e29) then DECLARED the move in the
    // migration script's own docblock — "the banked reads go 62 → 60 across 41 → 39
    // tagged addresses" — and the re-freeze (fe021a487) executed it, absorbing both rows.
    // ⛔ BUT fe021a487 TOUCHED EXACTLY ONE FILE, the register. So the register went to
    // 60/39 while this twin stayed at 62/41, and the walker landed RED AT THE TIP ITSELF,
    // before any later lane's first car — the same failure mode the block at the head of
    // this section was written about, recurring in the one figure that block exempted.
    // The two addresses are `factions on locks` in src/domain/locksPreservation.js (×1)
    // and src/domain/worldPulse/coup.js (×1), both tagged `CR-OSR-SCHEMA-6 / M8 —
    // re-triaged out of class (a)`, both reads deleted outright by the owner's 2026-09-17
    // order; neither file reads the `locks` shape's `factions` key at this tree at all.
    // ⚠ THIS IS A SHRINK AND ONLY A SHRINK, which is exactly why moving it by hand is
    // lawful: the bank may never be RAISED except by the governed reasoned path, and the
    // path that LOWERED it ran to completion three commits ago. The figure is READ OFF
    // the re-frozen register, never predicted from the delta — and the literal STAYS a
    // literal, because deriving it from the register is the one change that would make
    // the NEXT bank move silent.
    }).toEqual({ reads: 60, addresses: 39 }); // +2/+1: genesisDiplomacy.js joins the
    // neighbourNetwork row at the schema-12 mint (ODQ §819). ⚠ +2 READS but only +1
    // ADDRESS, which is the shape a BANK-BY-RULE admission has and a new DECLARATION
    // does not: the ninth identity added two of each because it was a new identity in
    // two files; this adds one file to an identity that already had 24.
    // ⚠ THE PER-IDENTITY MAP IS THE POINT, NOT THE TOTAL. 60/40 is the same
    // arithmetic as 44/31 plus 16/9, and a total alone cannot tell a bank that
    // grew by the four declared eventLog identities from one that grew by four
    // of anything else. The schema-9 mint's whole ruling is WHICH rows joined.
    expect(Object.fromEntries(EXPLAINED_WRITER_EXEMPTIONS.map(({ identity }) => {
      const matches = persistedTags.filter((row) => row.identity === identity);
      return [identity, {
        reads: matches.reduce((sum, row) => sum + row.count, 0),
        addresses: matches.length,
      }];
    }))).toEqual({
      // ⛔ `factions on locks` LEFT THE ROSTER ON 2026-09-17 — its writer,
      // src/components/dossier/LockControls.jsx, was deleted with the dossier's lock
      // controls, so gate 0 could no longer read it and the exemption was RETIRED.
      // It stood here at 2 reads / 2 addresses (locksPreservation.js, coup.js). This
      // map is keyed BY THE ROSTER, so the entry leaves as soon as the declaration
      // does; the register's two tagged rows leave when the governed re-freeze
      // absorbs them, which is what moves the 62/41 literal above to 60/39.
      'neighbourNetwork on settlement': { reads: 38, addresses: 25 },
      'stresses on settlement': { reads: 4, addresses: 3 },
      'worldPulse on campaignState': { reads: 2, addresses: 2 },
      'appliedAt on eventLog': { reads: 1, addresses: 1 },
      'deltas on eventLog': { reads: 2, addresses: 1 },
      'event on eventLog': { reads: 9, addresses: 4 },
      'narrativeSummary on eventLog': { reads: 4, addresses: 3 },
      // ⭐ THE NINTH IS NOW UNEXERCISED, AND ZERO IS THE HONEST READING. It banked two
      // reads across two addresses — the flag read in treasury.js's `isCriminalIncome` and
      // the guard it sits behind — on the ground that its writer was a GENERATOR branch the
      // corpus never took. Schema 17's stress-loaded topology pass makes the corpus take it,
      // so the reads are no longer findings and there is nothing left to bank. ⛔ THE ENTRY
      // IS PINNED AT 0/0 RATHER THAN REMOVED FROM THIS MAP: the map is built from
      // EXPLAINED_WRITER_EXEMPTIONS, whose roster is now EIGHT, and a declaration that
      // banks nothing is precisely what this arm should be able to say out loud.
      // ⚠ "THE NINTH" IS ITS HISTORICAL POSITION, NOT ITS INDEX TODAY — it was declared
      // ninth and is now first, because `factions on locks` was retired ahead of it on
      // 2026-09-17. The two cases are worth telling apart: this one keeps its
      // declaration because its WRITER IS STILL THERE and merely became observable;
      // that one lost its writer outright, which gate 0 refuses rather than tolerates.
      'isCriminal on incomeSources': { reads: 0, addresses: 0 },
    });
    // ⭐ THE SCHEMA-9 GENESIS STAMPED ONE REASON ONTO ALL FOUR NEW ROWS AND LEFT
    // THE FOUR OLDER ONES ALONE. `assertExplainedWriterTagTransition` then makes a
    // reason unchangeable without numeric growth, so genesis is the only moment
    // the string is writable and this is the only place it can be checked against
    // the rows it actually landed on.
    const eventLogTags = persistedTags.filter(({ identity }) => identity.endsWith(' on eventLog'));
    expect(eventLogTags).toHaveLength(9);
    expect([...new Set(eventLogTags
      .map(({ file, identity }) => baseline.rowTags[file][identity].reason))])
      .toEqual(['CR-OSR-SCHEMA-9 / M9 — ODQ §346.1 Ruling-B eventLog precedent']);
    const rows = Object.entries(baseline.inventory);
    expect(rows.length).toBeGreaterThan(0);
    // Every row is an identity map, never a bare count. This is the pin that
    // refuses a hand-edit back to the form the swap mutant beat.
    expect(rows.filter(([, r]) => typeof r !== 'object' || r === null || Array.isArray(r))).toEqual([]);
    const ids = rows.flatMap(([, r]) => Object.entries(r));
    expect(ids.reduce((n, [, c]) => n + c, 0)).toBe(baseline.total);
    expect(ids.length).toBe(baseline.identities);
    expect(ids.every(([, c]) => Number.isInteger(c) && c > 0)).toBe(true);
    // An identity is `<key> on <shape>` — the spelling the script mints, and
    // never the retired exact one, which carries ` @ origin # site`.
    expect(ids.filter(([id]) => !/^\S+ on \S+$/.test(id))).toEqual([]);
    const missing = rows.map(([f]) => f).filter((f) => !existsSync(join(ROOT, f)));
    expect(missing).toEqual([]);
    // Forward slashes only: a backslashed key reads differently on POSIX and
    // Windows CI — spurious reds on one, unlimited headroom on the other.
    expect(rows.filter(([f]) => f.includes('\\'))).toEqual([]);
  });

  test('the retired count-only row form is REFUSED, and multiplicity is ACCEPTED', () => {
    // Accepting `10` as a row would restore "any ten findings you like" — the
    // exact headroom the swap mutant exploited.
    expect(() => rowOf(10, 'src/x.js')).toThrow(/RETIRED count-only form/);
    // A leaf identity legitimately covers several reads in one file.
    expect(rowOf({ [leafIdentity('id', 'factions')]: 2 }, 'src/x.js'))
      .toEqual({ [leafIdentity('id', 'factions')]: 2 });
    // ⚠⚠ And the RETIRED exact spelling cannot be smuggled into a schema-4 row.
    expect(() => rowOf({ 'id on factions @ root/factions # v2|x': 1 }, 'src/x.js'))
      .toThrow(/heuristic identity is malformed/);
  });

  test('the frozen threshold and sha are recorded, and match the script', () => {
    expect(baseline.minRows).toBe(MIN_ROWS);
    expect(baseline.originMinRows).toBe(ORIGIN_MIN_ROWS);
    expect(baseline.frozenAtSha).toMatch(/^[0-9a-f]{7,40}$/);
    expect(baseline.frozen).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(baseline.sentinel.usableShapes).toBeGreaterThan(0);
    expect(baseline.sentinel.totalKeys).toBeGreaterThan(0);
    expect(baseline.sentinel.resolvedReads).toBeGreaterThan(0);
  });

  test('the failure message names the rule, the fix, and the only legal shrink', () => {
    const msg = ratchetMessage('src/x.js', [
      { identity: leafIdentity('id', 'factions'), count: 3, ceiling: 1 },
      { identity: leafIdentity('foundingTier', 'steadings'), count: 1, ceiling: 0 },
    ]);
    expect(msg).toContain('frozen ceiling is 1');
    expect(msg).toContain(leafIdentity('id', 'factions'));
    // A NEW identity must be named as new, not as growth — the swap's tell.
    expect(msg).toContain(`NEW      ${leafIdentity('foundingTier', 'steadings')}`);
    expect(msg).toContain('TO COMPLY');
    expect(msg).toContain('--write` re-freeze');
    expect(msg).toContain('clean committed tree');
    expect(msg).toContain('never hand-edit');
    expect(msg).toContain('Never raise a number');
  });

  test('identityOf is the key on the observed shape, and NEVER the line number', () => {
    expect(identityOf(leafFinding('src/a.js', 7, 'id', 'factions')))
      .toBe(leafIdentity('id', 'factions'));
    expect(identityOf(leafFinding('src/a.js', 9, 'id', 'factions')))
      .toBe(leafIdentity('id', 'factions'));
    expect(identityOf(leafFinding('src/a.js', 1, 'x', 'b'))).toBe(leafIdentity('x', 'b'));
    // The RETIRED exact finding shape is refused outright rather than
    // leaf-spelled: a schema-3 artifact cannot be folded into this inventory.
    expect(() => identityOf({
      ...leafFinding('src/a.js', 1, 'x', 'b'), site: 'v2|x', origins: ['root/b'],
    })).toThrow(/legacy finding has noncanonical fields/);
  });

  test('the report/refreeze entry point is reachable as a named script', () => {
    expect(pkg.scripts['check:observed-shape-readers']).toContain('check-observed-shape-readers.mjs');
  });
});

describe('reader-with-no-writer ratchet: the EXECUTED corpus', () => {
  test('the producers ran and the corpus is not empty', () => {
    expect(corpus.meta.generations).toBeGreaterThanOrEqual(8);
    expect(corpus.meta.seeds).toBeGreaterThanOrEqual(3);   // a single seed is vacuous here
    expect(corpus.meta.pulseIntervals).toBeGreaterThan(0);
    expect(corpus.meta.steadingsMinted).toBeGreaterThan(0);
    expect(corpus.meta.simulationFlagsLit).toBeGreaterThan(20);
    expect(Object.keys(corpus.shapes).length).toBeGreaterThan(100);
    // ── RE-RECORDED 2026-08-17 BY TE36 (THE P4 POPULATION RECONCILIATION), CHAIR-AUTHORIZED
    // UNDER ODQ §271 ──────────────────────────────────────────────────────────────────────
    // 1321/8637/14650 → 1300/8607/14586. THE CORPUS ITSELF SHRANK, and the cause is one
    // retired candidate family. `observed-shape-corpus.mjs` builds its world by lighting
    // EVERY `*Enabled` flag it can find in source (76 of them here), so it is the one place
    // in the estate where `demographicsEnabled` — virtual, and false in every shipped preset —
    // is lit. Under that flag the population lane no longer emits bare `population_decline`
    // candidates (P4: a shrink that is not a death belongs to demographicsKernel, the design's
    // one writer), so 21 fewer distinct shapes, 30 fewer origins and 64 fewer transitions are
    // observed. EVERY FIGURE MOVES DOWN, which is the safe direction for a
    // reader-with-no-writer ratchet: fewer observed shapes can only ever mean fewer resolvable
    // reads, never a new blind spot. THE FINDINGS INVENTORY DID NOT MOVE AT ALL — the frozen
    // per-file debt in .observed-shape-readers-baseline.json is byte-identical, so no reader
    // gained or lost a writer; only the corpus that exercises them is smaller.
    // ── RE-RECORDED 2026-09-01 BY THE WAR LANDING (§876) — atop T8's §858 companion
    // movement (1567/272/73/73 → 1565/268/74/74, all four fields T8 car 1; that story and
    // its four-home cross-record stand in this file's history at 1818c8fc8). THE WAR
    // MOVEMENT: 1565/268/74/74 → 1567/272/77/77. ⭐ ATTRIBUTED BY A FIVE-ARM SINGLE-
    // VARIABLE CONTROL (laneWARNEWS-receipt.md): 100% of it is T4 SEAT-2b (5a529f100) —
    // the mint of `legitimacyUpheavalEnabled` whose first reader is stressorGates'
    // upheaval gate. THIS CORPUS LIGHTS EVERY *Enabled FLAG, so the key is live in this
    // denominator and in no shipped preset; the movement is denominator-lighting, not a
    // lost writer. ⚠ TWO plausible causes were FALSIFIED by the same control: W-MEM's
    // publishRuling funnel moves ZERO (the corpus already read 1567/272/77 before any
    // W-MEM commit existed — the sizes coincided with its four families), and T4's
    // occupation prose moves ZERO. A coincidence of sizes is not an attribution; only
    // the per-arm build is. The same movement is cross-recorded in the three companion
    // homes in this same act (news-voice 268/28/51 → 272/32/50, conservation 272−32=240;
    // news-headline ADDRESS_TOTALS with distinctValues HOLDING at 393 — redistribution,
    // never inflation; prose-family 25/63 rows, distinctValues holding at 8).
    expect(scalarCorpus.scalarMeta).toEqual({
      canonEventLogEntries: 1,
      wizardNewsFinalEntries: 240,
      wizardNewsAccumulatedEntries: 1567,
      wizardNewsUnique: 272,
      pulseHistory: 12,
      // TE36 (ODQ §271): 109 → 73, one cause — the regional event log carries the pulse's
      // selected outcomes, and the retired bare-decline family was 36 of them. That mint's
      // reading of "the news layer did not move" is DATED: T8 car 1 moved both layers, in
      // OPPOSITE directions, and 73 → 74 here is the state lane picking up exactly what the
      // Chronicle put down. `wizardNewsFinalEntries` staying at 240 through both mints is
      // the control that keeps the two layers legibly apart.
      regionalEventLog: 77,
      regionalEventLogUnique: 77,
      aiChronicle: 1,
    });
    expect(Object.hasOwn(corpus, 'scalarObservations')).toBe(false);
    expect(Object.hasOwn(corpus, 'scalarMeta')).toBe(false);
    const { scalarObservations, scalarMeta: _scalarMeta, ...scalarTopology } = scalarCorpus;
    expect(scalarTopology).toEqual(corpus);
    expect(scalarObservations.length).toBeGreaterThan(1_000);
    expect(scalarObservations.every(({ root, rootOrdinal, path, value }) => (
      typeof root === 'string'
      && Number.isSafeInteger(rootOrdinal)
      && path.length > 0
      && path.some((segment) => (
        segment.kind === 'field' && OBSERVED_SCALAR_FIELDS.includes(segment.value)
      ))
      && (value === null || ['string', 'number', 'boolean'].includes(typeof value))
    ))).toBe(true);
    const hasPath = (root, wanted) => scalarObservations.some((row) => (
      row.root === root && wanted.every((part, index) => (
        row.path[index]?.kind === part.kind && row.path[index]?.value === part.value
      ))
    ));
    expect(hasPath('canonEventResult', [
      { kind: 'field', value: 'nextEventLog' },
      { kind: 'index', value: 0 },
      { kind: 'field', value: 'event' },
      { kind: 'field', value: 'cause' },
    ])).toBe(true);
    expect(hasPath('wizardNews', [
      { kind: 'field', value: 'entries' },
      { kind: 'index', value: 0 },
    ])).toBe(true);
    const accumulatedWizardRows = scalarObservations.filter((row) => (
      row.root === 'pulseResult'
      && row.path[0]?.kind === 'field' && row.path[0].value === 'wizardNews'
      && row.path[1]?.kind === 'field' && row.path[1].value === 'entries'
      && row.path[2]?.kind === 'index'
    ));
    expect([...new Set(accumulatedWizardRows.map((row) => row.rootOrdinal))])
      .toEqual([...Array(corpus.meta.pulseIntervals).keys()]);
    expect(accumulatedWizardRows.some((row) => (
      row.rootOrdinal === corpus.meta.pulseIntervals - 1
      && row.path[2].value === scalarCorpus.scalarMeta.wizardNewsFinalEntries - 1
    ))).toBe(true);
    expect(hasPath('worldState', [
      { kind: 'field', value: 'pulseHistory' },
      { kind: 'index', value: 0 },
    ])).toBe(true);
    expect(hasPath('pulseResult', [
      { kind: 'field', value: 'regionalGraph' },
      { kind: 'field', value: 'eventLog' },
    ])).toBe(true);
    expect(hasPath('aiChronicle', [
      { kind: 'index', value: 0 },
      { kind: 'field', value: 'mode' },
    ])).toBe(true);
    expect(scalarObservations.some((row) => row.path.some((segment) => (
      segment.kind === 'field' && ['id', 'createdAt'].includes(segment.value)
    )))).toBe(false);
  });

  test('THE PREMISE HOLDS: the four shapes the three defects live on were observed, and the keys are genuinely absent', () => {
    // Positive half — the census REACHED these shapes with real volume. Without
    // this, every absence below is the absence of everything.
    for (const name of ['factions', 'economicState', 'settlement', 'steadings']) {
      expect(corpus.shapes[name], `${name} was never observed — the corpus stopped measuring`).toBeTruthy();
      expect(corpus.shapes[name].rows).toBeGreaterThanOrEqual(MIN_ROWS);
      expect(corpus.shapes[name].keys.length).toBeGreaterThan(3);
    }
    // Negative half — the class's premise, measured, not assumed. Every absence
    // carries a LIVENESS ANCHOR: a sibling key the producers DO write on the
    // SAME shape, travelling the same walk. Without it "the key is absent" and
    // "the shape drifted away and the census measured nothing" are the same
    // green — which is the exact vacuity this whole walker exists to refuse.
    expectAbsentWithAnchor(corpus.shapes.factions.keys, 'id', 'name', 'TCD-1');
    expectAbsentWithAnchor(corpus.shapes.economicState.keys, 'exports', 'primaryExports', 'TCD-2');
    expectAbsentWithAnchor(corpus.shapes.settlement.keys, 'economy', 'economicState', 'TCD-2');
    expectAbsentWithAnchor(corpus.shapes.settlement.keys, 'trade', 'economicState', 'TCD-2');
    expectAbsentWithAnchor(corpus.shapes.steadings.keys, 'foundingTier', 'tier', 'TCD-3');
  });

  test('id-keyed maps are TRANSPARENT, so a parent id never enters a key set', () => {
    // `spatialLedgers.satellites` is `{ [parentId]: ParentSatellites }` and its
    // `steadings` is `{ [satId]: SatelliteRecord }`. If the dictionary detector
    // regressed, these shapes would carry engine-minted ids as "keys" and every
    // real read of them would be reported.
    expect(corpus.shapes.satellites.keys).toEqual(expect.arrayContaining(['steadings']));
    expect(corpus.shapes.satellites.keys.some((k) => k.startsWith('steading.'))).toBe(false);
    expect(corpus.shapes.steadings.keys.some((k) => k.includes('.'))).toBe(false);
    expect(corpus.shapes.steadings.keys).toEqual(expect.arrayContaining(['id', 'parentId', 'population']));
  });
});

describe('reader-with-no-writer ratchet: the live scan', () => {
  test('the scan reached the tree and resolved a real share of its reads', () => {
    expect(live.stats.files).toBeGreaterThan(500);
    expect(live.stats.reads).toBeGreaterThan(10_000);
    expect(live.stats.resolved).toBeGreaterThan(1_000);
    expect(live.findings.length).toBeGreaterThan(0);
  });

  test('SHRINK-ONLY: no file exceeds its frozen ceiling, and no row has vanished', () => {
    const { violations, stale } = compare(live.findings, baseline);
    // The counts assert FIRST so a red here is readable: the arrays hold whole
    // multi-line ratchet messages and their diff is unreadable at scale.
    // ⛔ THE CURE FOR A RED HERE IS THE GOVERNED RE-FREEZE, NEVER A HAND-EDIT: `baselineOf` derives
    // `inventory`, `total` and `identities` from ONE scan, together. The message carries the rest.
    expect(
      { violations: violations.length, stale: stale.length },
      'the live heuristic inventory must exactly match the frozen one. A lawful shrink is'
      + ' `node scripts/check-observed-shape-readers.mjs --write` on a clean tree — it re-derives'
      + ' inventory, total and identities together and refuses anything that is not a shrink.'
      + ' NEVER hand-edit a row: that throws "observed-shape baseline totals are inconsistent"'
      + ' out of validateLeafBaseline (scripts/lib/observed-shape-baseline.mjs).',
    ).toEqual({ violations: 0, stale: 0 });
    expect(violations).toEqual([]);
    expect(stale).toEqual([]);
  });

  test('ANTI-VACUITY: the corpus and the resolver have not collapsed', () => {
    expect(sentinelFailures(sentinelOf(corpus, live.stats, BASELINE_SCAN_MODE), baseline.sentinel))
      .toEqual([]);
    // ⚠⚠ THE SENTINEL IS BUILT FROM THE DETECTOR'S OWN STATS, NOT THE FILTERED
    // SCAN'S. Both schema-5 post-filters pass `stats` through BY IDENTITY, and
    // that is the property being asserted: if a filter ever recomputed stats from
    // its own output, every clearing would lower the anti-vacuity floor and the
    // floor would stop meaning "the corpus is still observing".
    expect(live.stats).toBe(live.raw.stats);
  });

  /**
   * ⭐⭐⭐ THE CLEARING FILTERS AND THE SCHEMA-7 BANK ARE NON-VACUOUS.
   *
   * A filter that clears nothing is indistinguishable from a filter that is not
   * wired in. The filters narrow the detector; the fourth stage banks its
   * matches without removing them. Both behaviors are asserted against the tree.
   *
   * ⛔ THE ARITHMETIC LINE IS THE GUARD ON THE HAND-COMPOSED CHAIN ABOVE. If a
   * later mint adds a fifth filter to `run()` and forgets this file, the walker
   * measures a LARGER set than the gate, the sum stops closing, and this reds —
   * which is the only reason a hand-composed chain is tolerable at all.
   *
   * ⭐⭐ M12's LIVE POPULATION IS ERADICATED, AND ITS ARM IS CONVERTED RATHER
   * THAN DELETED OR RELAXED (the `CR-EST-CONTROLZERO` shape, applied to a
   * detector filter). The language-surface filter's entire subject was reads of
   * `.toLocaleString` off an observed shape. DA-B2 moved the five count sites
   * that produced them onto `formatCount` (`popFirst`/`popLast`/`popChange`,
   * `t.min`/`t.max`, `m.populationBefore`/`After`, `Number(population)`), so the
   * raw detector now reports ZERO findings under that key — measured before any
   * filter runs, over the whole live source set: 0 of 2131 raw findings. The
   * eradication is of the LIVE HABITAT and is attributable to DA-B2.
   *
   * ⚠ WHAT DIED IS THE POPULATION, NOT THE DEMONSTRABLE BEHAVIOUR, and the
   * distinction is the whole reason this is a conversion. The filter is still
   * WIRED (`applied` below) and still CAPABLE: the sentinel suite drives it on a
   * seeded fixture and asserts it clears exactly one finding
   * (`observedShapeSentinel.test.js`, "M12: a builtin prototype member clears; a
   * domain key that merely looks like one does NOT"). So the suite's own law —
   * a filter clearing nothing is indistinguishable from one not wired in — is
   * ANSWERED rather than waived: the fixture distinguishes them, and this arm no
   * longer has to.
   *
   * ⛔⛔ THIS IS THE RE-EMERGENCE WATCH, AND IT LIVES ON THE EXACT ZERO BELOW.
   * `>= 0` was available and is REFUSED: it would report nothing and manufacture
   * the exact vacuity class this instrument exists to kill. 22 `.toLocaleString`
   * reads survive in source across 21 files, every one of them on a NON-OBSERVED
   * receiver (`Date` objects and plain numbers), which the detector never flags.
   * If a refactor moves one of those reads onto an OBSERVED shape, the class
   * returns: `cleared` goes positive and THIS ARM REDS ON ARRIVAL, so the row is
   * triaged rather than silently re-suppressed. The eradication is a won
   * position, not a ceiling, and it may not be spent.
   */
  // ── M13 · THE FOURTH DOOR: VIRTUAL-DORMANT WRITERS (TE-OSHAPE-1, ODQ §768.3) ──────
  //
  // The door admits a read whose writer is real, is in the scanned tree, and writes the
  // key on every lit tick — but stands behind a VIRTUAL simulation-rules flag the corpus
  // never lights, so no corpus run can ever observe the write. Left unadmitted, the
  // instrument calls such a read a reader-with-no-writer forever, which is FALSE.
  //
  // ⛔ THE WHOLE VALUE OF THIS DOOR IS THAT IT CONVICTS. An exemption list that only
  // ever admits becomes a list of claims nobody re-checks; this one re-executes every
  // clause on every scan and THROWS when one stops holding. The arms below drive that
  // conviction with PLANTED rows rather than describing it, because a conviction arm
  // that has never been seen to fire is indistinguishable from one that cannot.
  describe('M13 — the virtual-dormant writer door convicts what it cannot verify', () => {
    const REAL = VIRTUAL_DORMANT_WRITERS[0];

    test('the registry is structurally lawful and its rows are all live-verified', () => {
      expect(assertVirtualDormantWriters()).toBe(VIRTUAL_DORMANT_WRITERS);
      const evidence = assertVirtualDormantWriterEvidence();
      expect(evidence).toHaveLength(VIRTUAL_DORMANT_WRITERS.length);
      for (const row of evidence) {
        expect(row.spellings.length, `${row.identity} verified against no write spelling`).toBeGreaterThan(0);
      }
      // The first row, by name, so a silent re-point is visible in the diff.
      expect(REAL.identity).toBe('treasury on economicState');
      expect(REAL.writer).toBe('src/domain/worldPulse/treasury.js');
      expect(REAL.flag).toBe('treasuryEnabled');
      expect(REAL.charter).toMatch(/768\.3/);
      expect(REAL.charter).toMatch(/763\.2/);
    });

    test('CLAUSE 1 CONVICTS: a writer that no longer writes the key', () => {
      // PLANTED CONTROL. The writer source is replaced with one that keeps the gate but
      // drops every write of the key — the exact shape of a refactor that moves a record
      // elsewhere and leaves the registry row behind, still claiming to explain a read.
      const gateOnly = 'export function f(rules) { return rules.treasuryEnabled === true; }';
      expect(() => assertVirtualDormantWriterEvidence([REAL], {
        readSource: (path) => (path === REAL.writer ? gateOnly : readFileSync(join(ROOT, path), 'utf8')),
      })).toThrow(/UNVERIFIABLE \(clause 1\)/);
    });

    test('CLAUSE 2 CONVICTS: a gate that is not spelled by name, including one in prose', () => {
      const writes = `export function f(s) { return { ...s, economicState: { treasury: { coin: 0 } } }; }`;
      // (a) no gate at all.
      expect(() => assertVirtualDormantWriterEvidence([REAL], {
        readSource: (path) => (path === REAL.writer ? writes : readFileSync(join(ROOT, path), 'utf8')),
      })).toThrow(/UNVERIFIABLE \(clause 2\)/);
      // (b) ⭐ A GATE THAT EXISTS ONLY IN PROSE. This is the arm that makes the clause
      // mean something: a comment describing the gate, and a string literal quoting it,
      // must BOTH fail to satisfy it — otherwise a row could be kept alive by its own
      // documentation long after the code stopped gating.
      const prose = `${writes}\n// rules.treasuryEnabled === true is what this used to do.\n`
        + `const help = 'rules.treasuryEnabled === true';\n`;
      expect(() => assertVirtualDormantWriterEvidence([REAL], {
        readSource: (path) => (path === REAL.writer ? prose : readFileSync(join(ROOT, path), 'utf8')),
      })).toThrow(/UNVERIFIABLE \(clause 2\)/);
      // …and the SAME source with a real executed gate appended VERIFIES, so the arm is
      // proven to be reading the code rather than refusing everything.
      const real = `${prose}\nif (rules.treasuryEnabled === true) { run(); }\n`;
      expect(assertVirtualDormantWriterEvidence([REAL], {
        readSource: (path) => (path === REAL.writer ? real : readFileSync(join(ROOT, path), 'utf8')),
      })).toHaveLength(1);
    });

    test('CLAUSE 3 CONVICTS: a flag the estate does not call engine-gated-virtual', () => {
      const invented = { ...REAL, identity: 'treasury on economicState', flag: 'notARealEnabled' };
      // The structural law refuses nothing here — the name is well-formed — so the
      // conviction has to come from the live manifest read, which is the point.
      expect(() => assertVirtualDormantWriterEvidence([invented])).toThrow(/UNVERIFIABLE \(clause [23]\)/);
    });

    // ⚠ THIS ARM WAS RENAMED (lane T9, E-T2-7). It was titled "a flag that has become
    // PRESET-LIT", and it plants into the DEFAULTS — the sentinel below lands just above
    // the ENGINE_GATED declaration, inside clause 4a's window. So the preset case, the
    // one the title advertised, was tested by nothing, and an auditor reading test titles
    // would have concluded it was covered. The title now says what the plant does, and
    // the preset case has its own arm below.
    test('CLAUSE 4a CONVICTS: a flag that has re-entered DEFAULT_SIMULATION_RULES outlives its own premise', () => {
      // The row's whole premise is "the corpus never lights this". The moment the flag
      // is declared in DEFAULT_SIMULATION_RULES the corpus DOES light it, the write IS
      // observed, and the read must be judged normally. The row must die at that moment.
      const manifest = readFileSync(join(ROOT, VIRTUAL_FLAG_MANIFEST), 'utf8')
        .replace('export const ENGINE_GATED_VIRTUAL_RULE_KEYS', 'const DEFAULT_SIMULATION_RULES_SENTINEL = { treasuryEnabled: false };\nexport const ENGINE_GATED_VIRTUAL_RULE_KEYS');
      expect(() => assertVirtualDormantWriterEvidence([REAL], {
        readSource: (path) => (path === VIRTUAL_FLAG_MANIFEST ? manifest : readFileSync(join(ROOT, path), 'utf8')),
      })).toThrow(/UNVERIFIABLE \(clause 4\)/);
    });

    // ⭐ THE ARM THE OLD CLAUSE 4 COULD NOT HAVE PASSED. A preset override spread is how
    // every virtual flag in this estate is actually lit, and the whole preset table sits
    // BEYOND the window clause 4a slices — so the clause could not fire for the one path
    // it was written to watch. The plant below lands where a real preset light lands, and
    // the arm asserts that position rather than trusting it: an arm that plants inside the
    // old window would pass against the old code and prove nothing about the new.
    test('CLAUSE 4b CONVICTS THE PRESET LIGHT, which is the path every virtual flag actually takes', () => {
      const real = readFileSync(join(ROOT, VIRTUAL_FLAG_MANIFEST), 'utf8');
      const anchor = 'export const SIMULATION_RULE_PRESETS = Object.freeze({';
      expect(real, 'the preset-table anchor moved; re-point this plant').toContain(anchor);

      const plant = (value) => real.replace(
        anchor,
        `const PRESET_LIGHT_SENTINEL = { treasuryEnabled: ${value} };\n${anchor}`,
      );
      const drive = (manifest) => assertVirtualDormantWriterEvidence([REAL], {
        readSource: (path) => (path === VIRTUAL_FLAG_MANIFEST ? manifest : readFileSync(join(ROOT, path), 'utf8')),
      });

      // GUARD THE GUARD: the plant must sit OUTSIDE clause 4a's window, or this arm is
      // just clause 4a's arm wearing a different name.
      const lit = plant('true');
      expect(lit.indexOf('PRESET_LIGHT_SENTINEL'))
        .toBeGreaterThan(lit.indexOf('ENGINE_GATED_VIRTUAL_RULE_KEYS'));

      expect(() => drive(lit)).toThrow(/UNVERIFIABLE \(clause 4\)/);
      expect(() => drive(lit)).toThrow(/4b, a preset light/);

      // NEGATIVE CONTROL, and it is the clause's boundary rather than decoration. A preset
      // that declares the flag FALSE does not light it: the corpus discovers on
      // `<x>Enabled: true`, the write stays unobservable, and this row's premise survives.
      // That case is answered by clause 3 (via the virtuality walker) — not here. Without
      // this control, clause 4b would be indistinguishable from a clause that convicts any
      // mention of the flag anywhere in the manifest.
      expect(drive(plant('false'))).toHaveLength(1);

      // …and the UNDOCTORED manifest verifies, so neither result above is a refusal of
      // everything. treasuryEnabled is dark in the defaults and in all SEVEN presets today
      // (measured by driving the real preset table, not by reading the source).
      expect(drive(real)).toHaveLength(1);
    });

    test('the structural law refuses a malformed, duplicated or double-doored row', () => {
      const bad = (patch) => () => assertVirtualDormantWriters([{ ...REAL, ...patch }]);
      expect(bad({ lighting: 'too short' })).toThrow(/LIGHTING CONDITION/);
      expect(bad({ charter: 'no numbers here' })).toThrow(/minting charter/);
      expect(bad({ writer: 'scripts/elsewhere.mjs' })).toThrow(/repository-relative src\//);
      expect(bad({ flag: 'treasury' })).toThrow(/Enabled/);
      expect(bad({ key: 'coin' })).toThrow(/does not name key/);
      expect(() => assertVirtualDormantWriters([REAL, REAL])).toThrow(/repeats/);
      // ONE IDENTITY, ONE DOOR — a row that is also an explained-writer exemption.
      const doubled = { ...REAL, identity: 'stresses on settlement', key: 'stresses' };
      expect(() => assertVirtualDormantWriters([doubled])).toThrow(/ALSO an explained-writer/);
      // A class-(a) TRUE POSITIVE can never be admitted as a dormant writer.
      const guarded = { ...REAL, identity: 'authored on institutions', key: 'authored' };
      expect(() => assertVirtualDormantWriters([guarded])).toThrow(/class-\(a\)/);
    });

    test('the door CLEARS exactly its verified identities, and nothing else', () => {
      // ⭐ FOUR IDENTITIES SINCE §893.3. The three ENCOUNTERS rows are the first to use the
      // clause-2 COMPANION: their key is written by a PURE leaf that carries no flag, and the
      // gate lives in the stage that reads it. They are enumerated rather than counted, so a
      // fifth row cannot arrive unread — which is the whole point of a door that convicts.
      expect(live.virtualDormantWriters.applied).toBe(true);
      expect(live.virtualDormantWriters.clearedIdentities).toEqual([
        'fromSid on grievance',
        'incidentType on grievance',
        'toSid on grievance',
        REAL.identity,
      ]);
      // 4 → 5 READS at the §900 composition (Fable chair): ENC-4b's `approacherNidOf` is a FIFTH read of
      // `grievance.toSid` — an identity the door already clears — so the read count moves and the
      // enumerated identity list above does NOT (still four). Attributed by ENC-4c's receipt and by the
      // walker green at every dock but ENC-4b's; a read of a cleared identity is exactly what this door
      // exists to clear, and the list is what makes a fifth IDENTITY impossible to absorb silently.
      //
      // 5 → 6 READS at INSTR-912 car 11, the SAME shape of move and the same attribution rule.
      // `institutionTable.js` reads `economicState.treasury.coinFlows.taxed` as `whatItCounts`'s third
      // source (CLERK-LAWS §1.2). That is a SIXTH read of `treasury on economicState` — REAL.identity,
      // the row this door has always cleared — so the count moves and the enumerated list above does
      // NOT (still four). ⭐ IT IS ALSO THIS DOOR'S OWN VINDICATION: car 9 shipped the read at
      // `settlement.treasury`, a path NO writer in the estate produces, and the ratchet convicted it
      // (`treasury on settlement`, ceiling 0, no frozen row) precisely BECAUSE the door is keyed on the
      // full identity and never on the key alone — the arm two tests below asserts exactly that. Car 11
      // re-pointed the read to the path this row's declared writer actually writes
      // (`src/domain/worldPulse/treasury.js`, behind `treasuryEnabled`), and the gate went silent
      // without a single baseline byte moving.
      expect(live.virtualDormantWriters.cleared).toBe(6);
      // …and the cleared read is really GONE from the post-filter findings, while the
      // raw scan still holds it — the door narrows the verdict, it does not blind the
      // detector.
      const identityIn = (findings) => findings.some((f) => f.key === REAL.key
        && identityOf(f) === REAL.identity);
      expect(identityIn(live.raw.findings), 'the detector stopped seeing the read entirely').toBe(true);
      expect(identityIn(live.findings)).toBe(false);
    });

    test('an UNDECLARED identity on a declared key is NOT cleared', () => {
      // The door is keyed on the full identity, never on the key alone. A second,
      // unrelated `treasury` read on some other shape must still be judged.
      const foreign = { file: 'src/domain/x.js', line: 1, pos: 1, key: 'treasury', shapes: ['somethingElse'], text: 'row.treasury' };
      const out = applyVirtualDormantWriterFilter({
        scanMode: BASELINE_SCAN_MODE,
        scan: { findings: [foreign], stats: {} },
      });
      expect(out.findings).toHaveLength(1);
      expect(out.virtualDormantWriters.cleared).toBe(0);
    });

    test('the notice names the door in both states', () => {
      expect(virtualDormantWriterNotice(live.virtualDormantWriters)).toMatch(/cleared 6 read/); // six reads across four identities (ENC-4b's fifth read of grievance.toSid; INSTR-912 car 11's sixth, of treasury on economicState)
      expect(virtualDormantWriterNotice({ applied: false })).toMatch(/NOT APPLIED/);
    });
  });

  // ── THE PROVENANCE DRIFT CLASSIFIER (TE-OSHAPE-1, ODQ §768.3) ────────────────────
  //
  // THE DEFECT: the provenance gate refused a `--write` re-freeze whenever EITHER the
  // detector digest or the unscanned-input digest moved — and both cover files that
  // change for reasons having nothing to do with how the detector decides. The unscanned
  // set is, by construction, "every generated artifact and every data JSON under src/";
  // the detector set carries one TEST FIXTURE among ten real tool sources. So any lane
  // that regenerated the compendium or re-minted the dossier prose PERMANENTLY BRICKED
  // the re-freeze until somebody ran a governed schema migration.
  //
  // ⭐ IT IS THE SECOND SIGHTING, AND THE FIRST IS RECORDED IN THE MIGRATION TOOL'S OWN
  // HEADER: schema 8→9 says the unscanned digest "MOVED — recorded for review by named
  // path instead of refused, because refusing it would leave the instrument permanently
  // dark." It was cured once by hand and the habitat was left standing, so schema 10 went
  // dark the same way. MEASURED at the pristine base `518c40880`: 1 of 11 detector-tree
  // entries stale (the fixture) and 4 of 13 unscanned entries stale (two dossier-prose
  // generated files, the generated compendium, and the intent-atlas distillate).
  describe('the provenance drift classifier separates a detector change from an input change', () => {
    test('the classifier is a TOTAL positive predicate over the declared tool list', () => {
      for (const file of scannerToolFilesOf()) {
        const rel = relativeToRoot(file);
        const expected = !DETECTOR_INPUT_PATHS.includes(rel);
        expect(isDetectorSourcePath(rel), `${rel} classified wrongly`).toBe(expected);
      }
      // The fixture is the ONE declared input inside the tool list, by name.
      expect(DETECTOR_INPUT_PATHS).toEqual(['tests/fixtures/spatialPackFixtures.js']);
      // ⛔ The lockfile and the manifest stay on the DETECTOR side deliberately: a
      // dependency bump can move the parser, and the estate already treats any
      // package.json byte as a mint trigger.
      expect(isDetectorSourcePath('package.json')).toBe(true);
      expect(isDetectorSourcePath('package-lock.json')).toBe(true);
      // A file that is on NEITHER list must not fail open into the absorbable half.
      expect(isDetectorSourcePath('src/domain/anything.js')).toBe(false);
      expect(isDetectorSourcePath('scripts/not-a-scanner-tool.mjs')).toBe(false);
    });

    // A minimal snapshot/baseline pair the classifier can be driven against, so the arms
    // below test the CLASSIFIER rather than the live tree's happenstance.
    const manifestOf = (entries) => ({ entries, digest: 'ignored' });
    const snapshotOf = ({ detector, source, scanned }) => ({
      detectorTree: manifestOf(detector),
      sourceTree: manifestOf(source),
      scanTree: manifestOf(scanned),
    });
    const baselineOf = ({ detector, source, scanned }) => ({
      manifests: {
        detectorTree: manifestOf(detector),
        sourceTree: manifestOf(source),
        scanTree: manifestOf(scanned),
      },
    });
    const TOOL = 'scripts/check-observed-shape-readers.mjs';
    const FIXTURE = 'tests/fixtures/spatialPackFixtures.js';
    const GENERATED = 'src/domain/compendium/generated/compendiumData.generated.js';

    test('a moved DETECTOR SOURCE is classified as a detector change', () => {
      const drift = provenanceDriftOf(
        baselineOf({ detector: [{ path: TOOL, sha256: 'old' }], source: [], scanned: [] }),
        snapshotOf({ detector: [{ path: TOOL, sha256: 'new' }], source: [], scanned: [] }),
      );
      expect(drift.detectorSources).toEqual([TOOL]);
      expect(drift.inputs).toEqual([]);
    });

    test('a moved FIXTURE or GENERATED artifact is classified as an input change', () => {
      const drift = provenanceDriftOf(
        baselineOf({
          detector: [{ path: FIXTURE, sha256: 'old' }],
          source: [{ path: GENERATED, sha256: 'old' }],
          scanned: [],
        }),
        snapshotOf({
          detector: [{ path: FIXTURE, sha256: 'new' }],
          source: [{ path: GENERATED, sha256: 'new' }],
          scanned: [],
        }),
      );
      expect(drift.detectorSources).toEqual([]);
      expect(drift.inputs).toEqual([FIXTURE, GENERATED].sort());
    });

    test('a SCANNED source file is not an unscanned input — it is judged by the scan itself', () => {
      const scanned = 'src/domain/worldPulse/treasury.js';
      const drift = provenanceDriftOf(
        baselineOf({ detector: [], source: [{ path: scanned, sha256: 'old' }], scanned: [{ path: scanned, sha256: 'old' }] }),
        snapshotOf({ detector: [], source: [{ path: scanned, sha256: 'new' }], scanned: [{ path: scanned, sha256: 'new' }] }),
      );
      expect(drift.inputs).toEqual([]);
      expect(drift.detectorSources).toEqual([]);
    });

    test('an ADDED or REMOVED path on either side is caught, not just a changed one', () => {
      const added = provenanceDriftOf(
        baselineOf({ detector: [], source: [], scanned: [] }),
        snapshotOf({ detector: [{ path: TOOL, sha256: 'x' }], source: [], scanned: [] }),
      );
      expect(added.detectorSources).toEqual([TOOL]);
      const removed = provenanceDriftOf(
        baselineOf({ detector: [{ path: TOOL, sha256: 'x' }], source: [], scanned: [] }),
        snapshotOf({ detector: [], source: [], scanned: [] }),
      );
      expect(removed.detectorSources).toEqual([TOOL]);
    });

    test('NOTHING moved ⇒ nothing classified (the arm is not reporting drift at rest)', () => {
      const same = { detector: [{ path: TOOL, sha256: 'x' }], source: [{ path: GENERATED, sha256: 'y' }], scanned: [] };
      const drift = provenanceDriftOf(baselineOf(same), snapshotOf(same));
      expect(drift).toEqual({ detectorSources: [], inputs: [] });
    });

    test('THE LIVE ESTATE INSTANCE: a freshly re-minted baseline has NO drift at all', () => {
      // ⭐ THE HISTORY THIS ARM RECORDS, because the tree no longer shows it. MEASURED at
      // the pristine base `518c40880`, BEFORE the schema-11 re-mint: 1 of 11 detector-tree
      // entries stale (tests/fixtures/spatialPackFixtures.js) and 4 of 13 unscanned entries
      // stale (two dossier-prose leaves, the generated compendium, the intent-atlas
      // distillate) — NOT ONE a detector source, and yet the gate refused every `--write`.
      // That was the whole defect, and it is why the classifier exists.
      // ⚠ THE RE-MINT CURED IT AT SOURCE, so the honest assertion NOW is the opposite one:
      // a freshly minted baseline records the tree it was minted from, so BOTH halves are
      // empty. Leaving the old arm in place would have been a pin that could only pass by
      // the instrument being broken again.
      const drift = provenanceDriftOf(baseline, {
        detectorTree: { entries: liveManifestEntries(scannerToolFilesOf()) },
        sourceTree: { entries: liveManifestEntries(subjectFilesOf()) },
        scanTree: { entries: liveManifestEntries(sourceFilesOf()) },
      });
      expect(drift.detectorSources,
        'a DETECTOR SOURCE drifted since the mint — that needs a governed migration, not a re-freeze')
        .toEqual([]);
      expect(drift.inputs,
        'an execution INPUT drifted since the mint — lawful, and the shrink-only re-freeze absorbs it')
        .toEqual([]);
      // …and the arm is NOT vacuous: the classifier still SEES a planted change on this
      // very tree, so an empty result means "nothing moved", never "nothing is watched".
      const planted = provenanceDriftOf(baseline, {
        detectorTree: { entries: liveManifestEntries(scannerToolFilesOf()).map((e, i) => (i === 0 ? { ...e, sha256: 'f'.repeat(64) } : e)) },
        sourceTree: { entries: liveManifestEntries(subjectFilesOf()) },
        scanTree: { entries: liveManifestEntries(sourceFilesOf()) },
      });
      expect(planted.detectorSources.length + planted.inputs.length).toBe(1);
    });
  });

  test('A1/A7: schema-7 filters narrow ordinary noise while explained writers stay banked live', () => {
    expect(live.familyFilter.applied).toBe(true);
    expect(live.domGlobals.applied).toBe(true);
    expect(live.languageSurface.applied).toBe(true);
    expect(live.explainedWriters.applied).toBe(true);
    expect(live.virtualDormantWriters.applied).toBe(true);
    expect(live.findings.length).toBeLessThan(live.raw.findings.length);
    // The arithmetic closes with nothing left over: raw − each filter = live.
    // ⭐ M13 (TE-OSHAPE-1) JOINS THIS SUM, and it had to: the fourth door CLEARS rather
    // than banks, so a stage left out of the total would show up here as an unexplained
    // read. This arm caught exactly that when the door was first wired, which is the
    // argument for closing the arithmetic rather than describing it.
    const clearedTotal = live.familyFilter.cleared + live.domGlobals.cleared
      + live.languageSurface.cleared + live.virtualDormantWriters.cleared;
    expect(live.raw.findings.length - clearedTotal).toBe(live.findings.length);
    // Each is independently NON-VACUOUS — a zero here is a filter that is not
    // reaching the estate, which the sum above cannot distinguish from absence.
    expect(live.familyFilter.cleared).toBeGreaterThan(0);
    expect(live.domGlobals.cleared).toBeGreaterThan(0);
    // ⭐⭐ M12's CONVERTED ARM — see the header. EXACTLY zero, never `>= 0`: the
    // live habitat is eradicated (attributable to DA-B2) and any re-emergence
    // reds here on arrival instead of being re-suppressed. The filter is proven
    // still-capable on a fixture in the sentinel suite, not by this figure.
    expect(
      live.languageSurface.cleared,
      'M12 cleared a live read again. The language-surface habitat was ERADICATED by DA-B2\n'
      + '(raw findings under the declared key: 0 of 2131). A nonzero here means a refactor moved a\n'
      + '.toLocaleString read onto an OBSERVED shape — TRIAGE the row, do not widen or relax this\n'
      + 'pin. The 22 surviving reads across 21 files are all on non-observed receivers.',
    ).toBe(0);
    // ⭐ 62 → 64 at the schema-12 mint (ODQ §819): genesisDiplomacy.js's two reads of the
    // already-declared M9 identity. The bank's DECLARED roster was untouched at nine —
    // bank-by-rule tags a row from an existing declaration, so this figure moves while
    // EXPLAINED_WRITER_EXEMPTIONS does not, and the two arms below still pin the roster.
    // ⭐ 62 → 60 ON 2026-09-17, AND THIS TIME THE ROSTER IS WHAT MOVED — the opposite
    // shape to the note above, which is why both are kept. `factions on locks` was
    // retired when the owner's order deleted its writer, so its two reads
    // (locksPreservation.js, coup.js) are no longer banked. ⚠ They are not merely
    // unbanked: they left the estate with the lock controls, so they are also two of
    // the six STALE rows the governed re-freeze must absorb. MEASURED off this scan.
    expect(live.explainedWriters.banked).toBe(60);
    expect(Object.entries(corpus.shapes)
      .filter(([, shape]) => shape.keys.includes('source'))
      .map(([name]) => name)).toEqual([
      // ⭐ `stress` and `stressors` JOIN AT THE SCHEMA-17 RUNG, and they are the corpus's
      // own receipt that the stress-loaded topology pass actually executed: neither shape
      // carried an observed `source` while every config ran unstressed.
      'causes', 'changes', 'charter', 'evidence', 'garrison', 'incomeSources',
      'institutions', 'magicDef', 'mercenary', 'site', 'stress', 'stressors',
      'walls', 'watch',
    ]);

    // ⭐ EACH FILTER'S FOUNDING CASE, PRESENT RAW AND ABSENT FILTERED. Without
    // the raw half these are "the identity is not in the set", which is also
    // true of every identity that never existed.
    // ⚠ M12's founding case (`toLocaleString on history`) IS ABSENT FROM THIS MAP
    // BY MEASUREMENT, not by omission: DA-B2 cured the reads that produced it, so
    // the RAW half of the pair would now be the vacuous claim rather than the
    // control. Its live-fixture equivalent moved to the sentinel suite, which
    // drives the filter on a seeded finding and asserts `cleared === 1`.
    const founding = {
      familyFilter: 'populationDeltas on outcome',
      domGlobals: 'replaceState on history',
      explainedWriters: 'neighbourNetwork on settlement',
    };
    for (const [filter, identity] of Object.entries(founding)) {
      expect(live.raw.findings.some((f) => identityOf(f) === identity),
        `${identity} is absent from the RAW scan — ${filter}'s control is vacuous`).toBe(true);
      const survives = live.findings.some((f) => identityOf(f) === identity);
      if (filter === 'explainedWriters') {
        expect(survives, `${identity} was cleared instead of banked`).toBe(true);
        expect(live[filter].bankedIdentities).toContain(identity);
      } else {
        expect(survives, `${identity} survived ${filter}`).toBe(false);
        expect(live[filter].clearedIdentities).toContain(identity);
      }
    }
    // The explained-writer set is EXACT, because it is the one filter whose
    // membership is hand-declared rather than derived from a rule.
    expect([...live.explainedWriters.bankedIdentities].sort()).toEqual([
      'appliedAt on eventLog',
      'deltas on eventLog',
      'event on eventLog',
      // ⛔ `factions on locks` SORTED HERE UNTIL 2026-09-17 AND LEFT BY THE OTHER DOOR:
      // not "declared but unexercised" like the entry below, but UNDECLARED — its
      // writer was deleted, gate 0 refused it, and the declaration was retired. An
      // identity can leave this list for either reason and the two must not be
      // conflated, which is why both notes sit here.
      // ⚠ `isCriminal on incomeSources` LEFT THIS LIST AT THE SCHEMA-17 RUNG — it is still
      // DECLARED (the roster is now eight) but banks nothing, because its reads stopped
      // being findings once the corpus could observe their writer. Banked ⊆ declared, always.
      'narrativeSummary on eventLog',
      'neighbourNetwork on settlement',
      'stresses on settlement',
      'worldPulse on campaignState',
    ]);
    // ⚠ AND THE OTHER eventLog IDENTITIES STAY UNBANKED — §346.1 banked four and
    // left the rest RECORDED-EXPLAINED. Both halves are anchored, because a bare
    // exclusion is true just as happily when the whole cohort drifted out of the
    // estate as when gate 0 correctly refused it.
    const liveEventLog = [...new Set(live.findings
      .map((finding) => identityOf(finding))
      .filter((identity) => identity.endsWith(' on eventLog')))];
    const bankedEventLog = live.explainedWriters.bankedIdentities
      .filter((identity) => identity.endsWith(' on eventLog'));
    expect(bankedEventLog).toHaveLength(4);
    expect(liveEventLog.length).toBeGreaterThan(bankedEventLog.length);
    for (const refused of ['type on eventLog', 'targetId on eventLog']) {
      // POSITIVE first: the refusal is a RULING about a read that is still live,
      // not an observation that the read went away. Both survive in the estate, on
      // the inner Event's own (correct) home.
      expect(liveEventLog, `${refused} left the estate — the exclusion below is vacuous`)
        .toContain(refused);
      // …and excluded from the BANK, anchored on a sibling travelling the SAME
      // filter on the SAME shape, so an emptied bank reds on the anchor instead.
      expectAbsentWithAnchor(
        bankedEventLog, refused, 'event on eventLog',
        `gate 0 refuses ${refused} on applyEvent.js — it reads the inner Event`,
      );
    }
    // M11 names the receiver it fired on, so a filter that started matching
    // something other than a host global would be visible rather than merely
    // arithmetically larger.
    expect(live.domGlobals.receivers).toEqual(['window']);
    // The converted M12 arm's companion: an eradicated habitat clears no identity.
    expect(live.languageSurface.clearedIdentities).toEqual([]);

    // ⚠ SAID AS DISJOINTNESS RATHER THAN AS BARE EXCLUSIONS. An unanchored
    // exclusion would pass just as happily if a filter had drifted to clearing
    // NOTHING — it would outlive the very regression it is written to catch. The
    // non-emptiness assertions above are the liveness anchor, and disjointness is
    // the stronger claim anyway: two filters that both claim an identity mean one
    // is redundant and the reported arithmetic stops being additive. It is also
    // the measured property that makes the chain ORDER immaterial.
    const claimed = [
      live.familyFilter.clearedIdentities, live.domGlobals.clearedIdentities,
      live.languageSurface.clearedIdentities, live.explainedWriters.bankedIdentities,
    ].flat();
    expect(claimed.length, 'two schema-7 filter stages both claim the same identity')
      .toBe(new Set(claimed).size);

    const liveInventory = inventoryOf(live.findings);
    const taggedAddresses = Object.entries(liveInventory).flatMap(([file, row]) => (
      Object.entries(row)
        .filter(([identity]) => EXPLAINED_WRITER_EXEMPTIONS
          .some((entry) => entry.identity === identity))
        .map(([identity, count]) => ({ file, identity, count }))
    ));
    expect({
      reads: live.findings.length,
      identities: Object.values(liveInventory).reduce((sum, row) => sum + Object.keys(row).length, 0),
      files: Object.keys(liveInventory).length,
      bankedReads: taggedAddresses.reduce((sum, row) => sum + row.count, 0),
      taggedRows: taggedAddresses.length,
    // ⚠ THE INVENTORY TRIPLE IS UNCHANGED ACROSS A MINT, AND THAT IS THE CLAIM
    // RATHER THAN AN ACCIDENT: M8/M9 BANKS rows, it does not clear them, so a bank
    // that grew by 16 reads had to leave the schema-9 triple (1998/1412/387) exactly
    // where it was. A triple that moves in the same commit as a bank growth means the
    // filter stopped banking and started clearing.
    // ⭐ RR-1 (§353.3) moved it for the OTHER lawful reason — an ESTATE SHRINK, not a
    // filter change: two dead read arms deleted from ONE file, so reads and identities
    // each fall by two while files, bankedReads and taggedRows all hold. A shrink that
    // moved the banked figures too would mean a cleared row wearing a shrink's clothes.
    // ⭐ RR-2 (§373) moved it again the SAME lawful way and from the SAME file, one
    // property up: 1996/1410 → 1995/1409. The struck arm is the `blurb` fallback of the
    // institution DESCRIPTION chain — writerless at every commit since genesis — and it
    // was the file's last row on that key, so exactly one identity and one read leave
    // while files holds at 387 (viewModelBodySlices keeps its other eighty rows).
    // ⚠ THE SIBLING ARM OF THE SAME CURE ADDS NO ROW, AND THAT IS ASSERTED HERE BY
    // ARITHMETIC RATHER THAN ASSUMED: the cure also introduces a NEW read, `inst?.desc`.
    // `desc` has abundant institution writers, so it resolves and mints nothing. Had the
    // detector's writer census disagreed, `reads` would have held at 1996 with
    // `identities` still falling — a shrink and a mint cancelling to look like stillness.
    // Both figures falling by exactly one is what rules that out.
    // ⛔ These two literals were READ OFF the re-frozen baseline after the governed
    // `--write`, never predicted from the delta.
    // ⭐ MOVED 2026-08-31 BY T11 CAR 1 (§805), the third lawful ESTATE-SHRINK shape:
    // a FILE deletion, not a dead-arm strike. WarFaithTab.jsx died in the WAR/FAITH
    // split and its only row (`primaryDeitySnapshot on config` ×2) left with it, so
    // reads fall by two and identities and files by one each: 2001/1413/389 →
    // 1999/1412/388. The successors add NO row — FaithTab reads the embed through
    // faithPanelModel (which owns that identity already) and WarTab asks
    // martialReadiness's new hasMartialRecord instead of spelling the faithProfile
    // read a second time — measured at the pre-refreeze scan on this very tree: zero
    // NEW findings, exactly ONE STALE row (the deleted file's).
    // ⚠ bankedReads/taggedRows HOLD at 64/43 (a shrink that moved the banked figures
    // would be a cleared row wearing a shrink's clothes). They read 64/43 rather than
    // the lane's build-time 62/42 because the LANDING BASE had already moved them at
    // the schema-12 mint (ODQ §819); the lane's own delta on them is zero, which is
    // why a rebase moves this pin by −2/−1/−1 and nothing else.
    // ⭐ MOVED 2026-09-01 BY lane PAID-REPAIR (repair 1/5), a DEAD-ARM STRIKE — the
    // first shrink shape, not a file deletion. The campaign PDF and the World Book both
    // read a top-level `settlement.culture`, a key NO writer in src/ produces; the
    // exporters now read domain/resolveCulture.js (config.culture, then the
    // materialized culturalIdentity.key). `culture on settlement` leaves
    // generateCampaignPDF.js at ×2 and generateWorldBook.js at ×1, so reads fall by
    // THREE and identities by TWO — one identity per file, both files keeping their
    // other rows: 1996/1411 → 1993/1409.
    // ⚠ FILES HOLDS AT 388 AND THAT IS THE LOAD-BEARING HALF. The cure introduces a
    // NEW module, src/domain/resolveCulture.js, which reads `config.culture` and
    // `culturalIdentity.key` — both abundantly written — plus the guarded sentinel
    // compare. Had either resolved to a dead key the new file would have minted its own
    // row and `files` would read 389 while reads/identities still fell: a mint and a
    // shrink cancelling to look like a clean strike. 388 is what rules that out, and it
    // is why the chokepoint could be introduced without a schema genesis (`--write`
    // may never add a file).
    // ⚠ bankedReads/taggedRows HOLD at 64/43 — this lane cleared no row and tagged none.
    // ⛔ THE EXPECTED SIDE IS NO LONGER A LITERAL, AND THAT IS THE REPAIR. It was
    // `{ reads: 1999, identities: 1412, files: 388, bankedReads: 64, taggedRows: 43 }` —
    // five hardcoded twins of figures the register already holds, which the governed
    // `--write` cannot see and therefore could not move. A lane that obeyed the
    // shrink-only arm's own instruction re-froze the register and still landed red here.
    // The register is now the single home for the tree-shaped three; the bank keeps its
    // governed literal at the register pin above. The ledger of moves below is retained
    // in full — it explains why the REGISTER holds what it holds, which is still the
    // thing a reader needs and the thing no derivation can supply.
    // ⭐ LANDING NOTE (INSTRUMENTS consist, 2026-09-01, lane INSTR-land). The `1999/1412/388`
    // quoted above is TE-INSTR-1's OWN BASE figure and stays as the historical record of
    // what the repair was written against. AT THIS TIP the literal this line actually
    // replaced read `{ reads: 1996, identities: 1411, files: 388, bankedReads: 64,
    // taggedRows: 43 }` — the WAR landing's walker re-record `18df1bb3d` moved the triple
    // beneath the train while it held. ⛔ THAT DRIFT IS THE REPAIR'S OWN ARGUMENT, NOT A
    // COMPLICATION OF IT: a hardcoded twin went stale AGAIN, in the very span between this
    // cure being written and being landed, and the register-read shape is what makes the
    // next such move cost nothing. The two figures differ; the mechanism does not.
    }).toEqual(registerFigures());
    expect(Object.fromEntries(EXPLAINED_WRITER_EXEMPTIONS.map(({ identity }) => {
      const rows = taggedAddresses.filter((row) => row.identity === identity);
      return [identity, {
        reads: rows.reduce((sum, row) => sum + row.count, 0),
        addresses: rows.length,
      }];
    }))).toEqual({
      // ⛔ RETIRED 2026-09-17 with its writer — see the register arm above. On the LIVE
      // side it had already stopped existing as well: both of its reads
      // (locksPreservation.js, coup.js) left the estate with the lock controls, which
      // is why they show up as STALE rows the re-freeze must absorb rather than as
      // rows that merely stopped being banked.
      'neighbourNetwork on settlement': { reads: 38, addresses: 25 },
      'stresses on settlement': { reads: 4, addresses: 3 },
      'worldPulse on campaignState': { reads: 2, addresses: 2 },
      'appliedAt on eventLog': { reads: 1, addresses: 1 },
      'deltas on eventLog': { reads: 2, addresses: 1 },
      'event on eventLog': { reads: 9, addresses: 4 },
      'narrativeSummary on eventLog': { reads: 4, addresses: 3 },
      // ⭐ THE NINTH IS NOW UNEXERCISED, AND ZERO IS THE HONEST READING. It banked two
      // reads across two addresses — the flag read in treasury.js's `isCriminalIncome` and
      // the guard it sits behind — on the ground that its writer was a GENERATOR branch the
      // corpus never took. Schema 17's stress-loaded topology pass makes the corpus take it,
      // so the reads are no longer findings and there is nothing left to bank. ⛔ THE ENTRY
      // IS PINNED AT 0/0 RATHER THAN REMOVED FROM THIS MAP: the map is built from
      // EXPLAINED_WRITER_EXEMPTIONS, whose roster is now EIGHT, and a declaration that
      // banks nothing is precisely what this arm should be able to say out loud.
      // ⚠ "THE NINTH" IS ITS HISTORICAL POSITION, NOT ITS INDEX TODAY — it was declared
      // ninth and is now first, because `factions on locks` was retired ahead of it on
      // 2026-09-17. The two cases are worth telling apart: this one keeps its
      // declaration because its WRITER IS STILL THERE and merely became observable;
      // that one lost its writer outright, which gate 0 refuses rather than tolerates.
      'isCriminal on incomeSources': { reads: 0, addresses: 0 },
    });

    // A7 guard mutant: the retired clear-outright behavior loses exactly the
    // bank and therefore cannot satisfy the live count asserted above.
    const bankedIdentities = new Set(live.explainedWriters.bankedIdentities);
    const clearOutright = live.findings.filter((finding) => !bankedIdentities.has(identityOf(finding)));
    expect(clearOutright).toHaveLength(live.findings.length - 60);
    expect(inventoryOf(clearOutright)).not.toEqual(liveInventory);
  });

  /**
   * ⭐⭐ CR-OSR-FREEZE-7 — THE UNREVIEWED-UI COHORT, MEASURED AT THIS TREE.
   *
   * Making the heuristic leg the gate authority pulls `src/components/` into
   * direct enforcement. The literal below is the MEASURED figure for the live
   * scan, not a transcription from the ruling — CR-OSR-FREEZE-4-R1 records that
   * the ruling's "88 files / 250 identities" was the SCHEMA-2 predecessor's
   * slice, produced by a DIFFERENT detector, and a pin written to it would red
   * on first measurement.
   *
   * It is pinned against the LIVE SCAN rather than the frozen baseline on
   * purpose: it is then green immediately and stays green across the genesis,
   * so it never becomes a second number a freeze has to remember to move.
   *
   * ⭐ MOVED 2026-08-11 BY REPAIR, NOT BY DRIFT: 53/162/260 → 53/153/249. The
   * UI-cohort triage's display repairs deleted NINE reader identities that no
   * writer had ever produced — `campaignId on save` (ProvenanceBlock, 2 reads),
   * `port`/`tradeRouteAccess on settlement` (PlacementsLayer, 1 each),
   * `culture`/`cultureName`/`terrain on settlement` (PlacementDetailCard, 1
   * each) and `decreed`(2)/`source`(1)/`visibility`(1) `on stressors`
   * (heraldFeed) — eleven reads across nine identities. The file count is
   * unchanged because no file lost ALL of its rows. This is the cohort SHRINKING
   * as rows are triaged and cured, which is the direction the ratchet exists to
   * permit; the frozen inventory's matching nine rows are deleted by the
   * `--write` re-freeze, which only runs from a committed tree.
   *
   * ⭐ MOVED AGAIN 2026-08-11 BY THE DOMAIN-SIDE REPAIR, SAME DIRECTION:
   * 53/153/249 → 53/152/248. Exactly ONE cohort row went, and it is the only one
   * that COULD: of the seven identities that lane deleted, six live outside
   * `src/components/` (`__adjudicationPending`/`__forecast`/`__resolution on
   * stressors` in domain/realm/heraldRouting.js, `evidenceId on outcome` in
   * domain/worldPulse/warCoalitionEvidence.js, and `title on currentTensions` in
   * generators/aiLayer.js and generators/narrative/siegeCapability.js). The
   * seventh, `title on currentTensions` in components/new/dailyLifeLogic.js, is
   * the cohort member: one identity, one read, hence −1/−1. `files` holds at 53
   * because dailyLifeLogic keeps its other three rows — the whole-file drop in
   * this repair was siegeCapability.js, which is not a cohort path.
   *
   * ⭐ MOVED AGAIN 2026-08-11 BY THE OWNER-RULED DISPLAY LANE, SAME DIRECTION:
   * 53/152/248 → 53/150/246. The owner ruled that NOTHING INTRINSICALLY MAKES A
   * SETTLEMENT A CAPITAL — the closest in-system analog is an overlord — so the
   * two `capital on settlement` / `isCapital on settlement` rows in
   * components/map/PlacementsLayer.jsx are not an unwired feature but a concept
   * ABSENT FROM THE WORLD MODEL, and both were deleted. One read each, hence
   * −2 identities / −2 counts, and BOTH are cohort members because
   * PlacementsLayer.jsx is a `src/components/` path. `files` holds at 53 because
   * that file keeps its other four rows (`ancientRuin on history` 2,
   * `lifecycleStatus on config` 2, `lifecycleStatus on settlement` 1,
   * `settlement on settlement` 3) — this repair dropped no file entirely.
   * ⚠ THE TWO DELETIONS WERE ALSO DEAD A SECOND, INDEPENDENT TIME: TierIcon's
   * gold fill was unreachable AND its `tierFor` allowlists six tiers with the
   * size-tier token absent, so the flag sense and the tier sense could never
   * cross-wire. The frozen inventory's matching two rows are deleted by the
   * `--write` re-freeze, which only runs from a committed tree.
   *
   * ⭐⭐ MOVED BY THE SCHEMA-5 MINT (2026-08-11), AND THIS TIME BY THE INSTRUMENT
   * RATHER THAN BY A REPAIR: 53/150/246 → 51/128/193. `live` is now the FILTERED
   * scan, because schema 5's inventory is the filtered set and a walker measuring
   * something else is not a walker. ⚠ THE RAW READING IS UNCHANGED at 53/150/246 —
   * asserted directly below on `live.raw`, so the delta is provably the filters
   * and provably not drift in the estate.
   *
   * ⭐ DERIVED TWICE, INDEPENDENTLY, AND THE TWO AGREE EXACTLY. Once by taking
   * `cohortOf` of the filtered inventory (51/128/193), and once by summing the
   * CLEARED reads that sit under a cohort path straight off the finding arrays:
   * 53 reads over 22 (file, identity) addresses, spanning `neighbourNetwork on
   * settlement` plus seventeen `… on stressors` family rows. 150 − 22 = 128 and
   * 246 − 53 = 193 close on the nose, and `files` drops 53 → 51 because exactly
   * two cohort files lost ALL of their rows. Had anything else moved in this
   * window the two derivations would have disagreed.
   *
   * ⭐ MOVED AGAIN 2026-08-11 BY THE H9 REPAIR, SAME DIRECTION, BOTH READINGS:
   * filtered 51/128/193 → 51/127/192 and raw 53/150/246 → 53/149/245. `recentEvents
   * on settlement` was deleted at BOTH of its reader sites in one change —
   * components/OutputContainer.jsx (the cohort member, 1 read) and
   * store/aiChronicleContext.js (1 read, outside `src/components/` and so invisible
   * to these two figures). ONE identity, ONE read, hence −1/−1 on each reading, and
   * `files` holds at 51 because OutputContainer keeps its other five rows
   * (`canonizedAt on campaignState` 1, `primaryDeitySnapshot on config` 2,
   * `startedAt on campaignState` 1, `worldPulse on campaignState` 1, `worldState on
   * campaignState` 2). BOTH readings move by the same −1/−1, which is the property
   * this pair exists to expose: the drop is the estate genuinely shrinking, not the
   * filters clearing more.
   * ⚠ THE SAME CHANGE REPAIRED aiChronicleContext's world lane (CR-S6-6) by pointing
   * it at the campaign's worldState.pulseHistory, and that added ZERO identities —
   * measured, not assumed: the run that produced the two figures above reported
   * `violations: 0`. The new reads are spelled the way the already-clean sibling
   * spells them (a call-result receiver, which the name prior does not ground).
   * ⚠⚠ `worldPulse on campaignState` DELIBERATELY SURVIVES in both files. It is the
   * legacy per-save fallback the dossier Chronicle also kept, so the repair does not
   * silently narrow behaviour for a save that happens to carry the old shape.
   * ⛔ THE FROZEN INVENTORY STILL CARRIES THE TWO DELETED ROWS, so SHRINK-ONLY reads
   * `stale: 2` until a `--write` re-freeze — which only runs from a committed tree
   * with a clean `src/`, and was BLOCKED at this commit by a concurrent lane's
   * uncommitted src/generators/factionRoles.js. Owed, not forgotten. (Discharged at
   * `33487c77`, the re-freeze that deleted exactly those two rows.)
   *
   * ⭐⭐ MOVED BY THE SCHEMA-6 MINT (2026-08-11), BY THE INSTRUMENT AGAIN AND NOT BY
   * A REPAIR: filtered 51/127/192 → 49/123/185, raw UNCHANGED at 53/149/245. The two
   * new post-filters and the three new explained-writer entries clear FOUR cohort
   * identities and SEVEN cohort reads between them — `replaceState on history` in
   * CompendiumPanel.jsx (2 reads, M11), `toLocaleString on history` in
   * WhatChangedPanel.jsx (2, M12), `stresses on settlement` in EventComposer.jsx (2,
   * M8) and `worldPulse on campaignState` in OutputContainer.jsx (1, M9). `files`
   * drops by exactly 2 because CompendiumPanel and WhatChangedPanel lose ALL of
   * their rows while EventComposer and OutputContainer keep others.
   * ⚠ THE RAW READING HOLDING STILL AT 53/149/245 IS THE POINT OF PINNING BOTH: it
   * proves the estate did not move and the delta is provably the instrument.
   *
   * ⭐ MOVED 2026-08-15 BY DA-B2, AND THIS TIME THE RAW HALF IS THE ONE THAT MOVES:
   * raw 53/149/245 → 52/148/243, filtered UNCHANGED at 51/130/195. The two readings
   * moving APART is the signature of a genuine estate repair whose rows the filters
   * were already clearing — DA-B2 put `WhatChangedPanel.jsx`'s two population reads
   * through `formatCount`, deleting the `toLocaleString on history` identity at its
   * only remaining site. ONE file (WhatChangedPanel lost its last raw row), ONE
   * identity, TWO reads, hence −1/−1/−2 on the raw reading alone. The filtered
   * figure cannot move because M12 was already clearing exactly those two reads,
   * which is also why the frozen inventory needed no re-freeze (`total` stood at
   * 1998 then; RR-1's later shrink took it to 1996 and RR-2's to 1995 — this is a
   * dated account).
   */
  test('the UNREVIEWED-UI cohort is ENFORCED, banked, and exactly its measured size', () => {
    // ⭐ MOVED 2026-08-31 BY T11 CAR 1 (§805): WarFaithTab.jsx deleted in the
    // WAR/FAITH split, its one identity (`primaryDeitySnapshot on config` ×2)
    // leaving BOTH readings in lockstep — filtered 51/130/195 → 50/129/193, raw
    // 52/148/243 → 51/147/241 (−1 file / −1 identity / −2 counts on each). The
    // two readings moving TOGETHER is the signature of a whole-file estate
    // shrink no filter was clearing; the successors (WarTab/FaithTab) mint no
    // cohort row — their reads route through faithPanelModel / martialReadiness,
    // whose rows are domain-side and already frozen.
    // ⛔ THE SECOND TWIN OF THE GOVERNED `--write`, FOUND BY EXECUTION. Both readings
    // used to be hardcoded here — `{files:50,…}` and `{files:51,…}` — and a lawful
    // ESTATE SHRINK in a `src/components/` file moves BOTH while the `--write` can
    // reach neither, so a lane obeying the shrink-only arm still landed red. Measured,
    // not reasoned: deleting one read from TierIcon.jsx in a scratch tree took the
    // filtered reading to 49/128 and left this arm red AFTER a successful re-freeze.
    // Note the SCRIPT never had this disease — `cohortOf` is a derivation over whatever
    // inventory it is handed, and its own comment says a transcribed number would "rot
    // away from the artifact it describes". Only the walker transcribed.
    //
    // THE FILTERED READING NOW READS THE REGISTER, so the `--write` moves both sides.
    const cohort = cohortOf(inventoryOf(live.findings));
    const frozenCohort = cohortOf(baseline.inventory);
    expect(cohort).toMatchObject({
      files: frozenCohort.files,
      identities: frozenCohort.identities,
      counts: frozenCohort.counts,
    });
    // ⚠⚠ THE RAW READING IS PINNED BESIDE THE FILTERED ONE, AND THE PIN IS NOW THE
    // GAP RATHER THAN THE ABSOLUTE. The claim this arm has always been making is that
    // the cohort figure could fall for two completely different reasons — the filters
    // clearing more, or the estate genuinely shrinking — and one number cannot tell
    // them apart. That claim is about the RELATIONSHIP, so the relationship is what is
    // frozen: the raw reading lives nowhere in the register (the register is
    // post-filter), so what the filters CLEAR is the honest thing to hold as a literal.
    // A pure estate shrink moves raw and filtered together and this gap HOLDS — cured
    // end-to-end by the `--write`, with nothing left to hand-edit. A filter change moves
    // them apart and reds HERE, named, which is the governed event announcing itself.
    // Strictly stronger than two absolutes: those two reds could not tell the cases apart.
    const rawCohort = cohortOf(inventoryOf(live.raw.findings));
    expect({
      files: rawCohort.files - cohort.files,
      identities: rawCohort.identities - cohort.identities,
      counts: rawCohort.counts - cohort.counts,
    }, 'the schema-7 filters cleared a DIFFERENT amount of the unreviewed-UI cohort than'
      + ' the frozen gap — this is a filter change, not an estate shrink, and it is'
      + ' governed: re-derive the gap and say which filter moved and why').toEqual({
      files: 1, identities: 18, counts: 48,
    });
    expect(UNREVIEWED_UI_COHORT.tag).toBe('UNREVIEWED-UI');
    expect(UNREVIEWED_UI_COHORT.scopes).toEqual([...EXACT_SCAN_EXCLUDED_SCOPE]);

    // ⚠⚠ THE COHORT IS UNDER ENFORCEMENT, NOT EXCLUDED — and these two claims
    // are the whole content of CR-OSR-FREEZE-7's answer to the freeze docket.
    // The same paths the EXACT instrument refuses to resolve are paths this
    // authority reports findings in.
    expect(cohort.paths.length).toBeGreaterThan(0);
    expect(cohort.paths.every((path) => isExactScanExcludedReadPath(path))).toBe(true);
    const uiFindings = live.findings.filter((f) => isExactScanExcludedReadPath(f.file));
    expect(uiFindings.length).toBe(cohort.counts);
    // NEGATIVE CONTROL: the cohort is a strict SUBSET — the domain layer is not
    // being counted into it, so a cohort that swallowed the tree would red.
    expect(cohort.counts).toBeLessThan(live.findings.length);
    expect(live.findings.some((f) => f.file.startsWith('src/domain/'))).toBe(true);
  });

  /**
   * ⭐⭐ THE CLASS-(a) WORKLIST IS A DERIVATION, AND THIS IS THE MACHINERY THAT SAYS SO.
   *
   * ── THE HAZARD, WHICH HAS BITTEN TWICE AND COST A DAY ────────────────────────
   * "How many reader-without-writer defects are still open?" has a correct answer
   * that anyone can compute in one line — join `CLASS_A_PROTECTED_IDENTITIES`
   * against the frozen register — and a WRONG answer that is much easier to reach:
   * read the last number somebody wrote down. `docs/SOL_QUEUE.md` §4 carried
   * "the 21 remaining reader-without-writer defects (2 of 23 repaired)" from
   * 2026-08-11, and that sentence mis-dispatched two lanes. Lane C took it on
   * 2026-08-11, measured the register at SEVEN, and recorded the finding as a law:
   * *"`scripts/.observed-shape-readers-baseline.json` at HEAD is the ONLY authority
   * on what class-(a) debt is outstanding … believing the brief would have cost a
   * day chasing already-dead reads"* (memory/osr-class-a-worklist-is-the-baseline-
   * not-the-brief.md). Thirteen months later the long-tail card read 21 back off
   * the same unrepaired row and dispatched a second lane on it.
   *
   * ── WHY THE CURE IS A TEST AND NOT A BETTER SENTENCE ─────────────────────────
   * Under the HAZARD CONVERSION LAW a confirmed hazard class becomes MACHINERY or
   * is explicitly accepted with a stated reason, and a prose correction is neither:
   * it is one more number in one more document, which is the thing that rotted.
   * What cannot rot is a derivation that reds. This arm computes the worklist from
   * the register AND from the live scan, proves the two agree, and then pins the
   * result — identity, file and multiplicity, with each row's standing disposition
   * beside it. It reds in BOTH directions and neither red is silenceable by a
   * transcription: a REPAIR shrinks the join and must be recorded here, a
   * REGRESSION grows it and names the new row.
   *
   * ⛔ WHY IT LIVES IN THE WALKER AND NOT IN THE SCANNER. Any byte in a detector
   * source moves `detectorTree`, the drift classifier refuses the ordinary gate,
   * and the change costs a governed schema rung. `scannerToolFiles()` lists
   * package.json, package-lock.json, the five `scripts/lib` detector modules,
   * `check-observed-shape-readers.mjs`, `migrate-observed-shape-readers.mjs` and
   * `tests/fixtures/spatialPackFixtures.js` — this file is on none of them, so the
   * guard costs NO rung. Do not "tidy" the scanner while adding to this arm.
   *
   * ── THE TWO SIDES ARE INDEPENDENT PRODUCTIONS, WHICH IS WHY BOTH ARE READ ────
   * The frozen side is a persisted artifact; the live side is this run's scan. A
   * pin over the register alone would still be green on a tree whose estate had
   * moved underneath it, and a pin over the live scan alone would be green on a
   * register that had been hand-edited. The equality between them is the claim the
   * CLI's own headline makes ("exactly matching the frozen inventory") narrowed to
   * the rows that are debt.
   *
   * ⚠ THE ROSTER LENGTH IS PINNED TOO, and it is not decoration. The join is a
   * FILTER: an identity quietly dropped from `CLASS_A_PROTECTED_IDENTITIES` leaves
   * a row in the register that this arm would simply stop looking at, and that is
   * the one mutation the triple pin below cannot see. The roster is a historical
   * bank of CONFIRMED true positives — a repair does NOT remove an entry (six
   * repaired identities are still listed) — so it moves only by a deliberate
   * re-triage, exactly the act that should have to stop here and say so.
   *
   * ── THE EXECUTED MUTANTS (both run out of band at 935b3d94b, both red) ───────
   * (1) THE SHRINK DIRECTION — delete the `coalitionEvidence on outcome` row from
   *     the expected triples below. 1 failed of 45, and the diff named the dropped
   *     row by identity and file. So the pin is not a tautology.
   * (2) THE GROWTH DIRECTION — plant a live read of a REPAIRED class-(a) identity,
   *     `export function probe(settlement) { return settlement.plotHooks; }` at
   *     `src/domain/__lt30RegressionProbe.js`, and the live side grew a fourth row
   *     the register does not carry. 3 failed of 45, and THIS arm's equality
   *     assertion reds first and names it:
   *       "the live scan and the frozen register disagree about which class-(a)
   *        rows are still outstanding … + file: src/domain/__lt30RegressionProbe.js,
   *        identity: plotHooks on settlement"
   *     The probe was removed and `git status --porcelain` re-checked afterwards.
   *
   * ⚠⚠ TWO MEASURED FACTS ABOUT PLANTING THIS PARTICULAR MUTANT, because both cost
   * a run and the next lane will otherwise repeat them:
   *   * `title on currentTensions` — the obvious repaired identity to regress —
   *     CANNOT be planted through a bare parameter. `currentTensions` is an ARRAY
   *     shape, so `currentTensions.title` is array surface, and the detector's
   *     arrayness rule correctly declines to call it a domain key. The plant ran
   *     GREEN at 45/45, which reads exactly like a vacuous mutant and is not one:
   *     it is the `arraySurface` negative control firing. Plant on a NON-array
   *     shape — `settlement` is the root-name-prior case the other probes use.
   *   * A probe in a `mkdtempSync` dir (the `scanEstateWith` `extraFiles` door the
   *     MUTANTS block uses) CANNOT reach this arm's assertion: `inventoryOf` runs
   *     `assertCanonicalPath` and throws "observed-shape finding has a noncanonical
   *     path" on the absolute temp path first. The MUTANTS block never hits this
   *     because it filters raw findings by basename instead of inventorying them.
   *     A growth mutant for any inventory-shaped arm must be an IN-TREE file.
   *
   * ⚠ Mutant (2) is deliberately NOT kept as a standing arm: it needs a third
   * full-tree scan and `scansRun` is pinned at two, which is the flake budget this
   * file paid for in timeouts. The regression direction is guarded by the equality
   * assertion; the plant proved the assertion can see it.
   */
  test('the LIVE class-(a) worklist is exactly the rows the register still holds', () => {
    // The roster is a FILTER over both sides, so its own size is load-bearing.
    expect(CLASS_A_PROTECTED_IDENTITIES.length,
      'the class-(a) roster changed size — a re-triage is a governed act and the worklist'
      + ' pin below cannot see an identity that was removed from the roster it filters by')
      .toBe(20);

    const guarded = new Set(CLASS_A_PROTECTED_IDENTITIES);
    /** Every class-(a) row an inventory still carries, in a stable order. */
    const worklistOf = (inventory) => Object.entries(inventory)
      .flatMap(([file, row]) => Object.entries(row)
        .filter(([identity]) => guarded.has(identity))
        .map(([identity, count]) => ({ identity, file, count })))
      .sort((a, b) => (a.identity.localeCompare(b.identity) || a.file.localeCompare(b.file)));

    const frozenWorklist = worklistOf(baseline.inventory);
    const liveWorklist = worklistOf(inventoryOf(live.findings));
    // ⚠ THE LIVE SIDE FIRST: a regression plants itself here, and this is the arm the
    // planted mutant reds on. The register can only disagree with the estate by being
    // stale, and staleness is the failure this whole file exists to refuse.
    expect(liveWorklist, 'the live scan and the frozen register disagree about which'
      + ' class-(a) rows are still outstanding — the register is stale, or a repaired'
      + ' identity has come back; re-derive the join before touching the pin below')
      .toEqual(frozenWorklist);

    // ⛔ THE PIN. Three rows, each a DELIBERATE STOP documented AT THE READ. If this
    // reds, the cure is NEVER to transcribe the new number: re-run the join, read the
    // disposition at each surviving read, and edit this list with the reason.
    expect(frozenWorklist, 'the class-(a) worklist moved — say WHICH row and WHY here,'
      + ' and correct docs/SOL_QUEUE.md §4 item 2 in the same commit').toEqual([
      // A TOLERANT FAMILY READ, refuted twice: `metadata.coalitionEvidence ??
      // outcome.coalitionEvidence` — the fallback arm is the dead one, and deleting it
      // narrows a contract that is deliberately permissive about where evidence rides.
      { identity: 'coalitionEvidence on outcome', file: 'src/domain/worldPulse/warCoalitionEvidence.js', count: 1 },
      // ⛔ OWNER-OWED, ODQ §338.2 — these two are a FENCE, not a display read.
      // `compareEntityArrays` reports `invented_entity` for a key present in `refined`
      // and absent from `original`, so the undefined-vs-populated comparison is exactly
      // the case the arm exists to catch, and REMOVING it is FAIL-OPEN on an
      // anti-hallucination guard sitting on a PAID AI surface. The in-file note above
      // the two calls records the non-repair. A lane may not re-point this.
      { identity: 'hooks on settlement', file: 'src/domain/aiOverlayVerifier.js', count: 1 },
      { identity: 'supplyChains on settlement', file: 'src/domain/aiOverlayVerifier.js', count: 1 },
    ]);

    // NEGATIVE CONTROL — the derivation is not structurally blind. A repaired identity
    // is still ON the roster (the roster banks history, not the worklist), so feeding
    // one back in through a synthetic inventory must produce a row. Without this, a
    // `worklistOf` that had quietly stopped matching identities would green on three
    // rows it never actually found.
    expect(guarded.has('title on currentTensions')).toBe(true);
    expect(worklistOf({ 'src/domain/__synthetic__.js': { 'title on currentTensions': 2 } }))
      .toEqual([{ identity: 'title on currentTensions', file: 'src/domain/__synthetic__.js', count: 2 }]);
    // …and it does not match a NON-class-(a) identity, so the filter is a filter.
    expect(worklistOf({ 'src/domain/__synthetic__.js': { 'neighbourNetwork on settlement': 2 } }))
      .toEqual([]);
  });
});

describe('reader-with-no-writer ratchet: the MUTANTS', () => {
  /** Self-contained modules planted into the scanned set. Each imports nothing,
   *  so each resolves through the ROOT NAME PRIOR alone — the same rule the
   *  estate uses — and each is written to a temp dir, never into the shared
   *  `src/` tree.
   *
   *  ⚠⚠ ALL SEVEN ARE SCANNED IN ONE PASS, and that changes NO probe's answer.
   *  They are seven separate FILES: nothing imports them, they import nothing,
   *  and no estate module can resolve into the temp dir, so no probe can reach
   *  another. Findings partition by file, and every expectation below is
   *  byte-for-byte the expectation it carried when each probe bought its own
   *  full-tree scan — which is what made this file flake — AND byte-for-byte
   *  what each reported under the exact detector before the schema-4 rewire. */
  const PROBES = {
    // Both `inspect` declarations begin at source-file position 0. The
    // resolver's parameter memo is keyed `${file}:${fn.pos}:${index}:${prop}`
    // (legacy-reader-shape-scan.mjs:477), so `fn.pos` ALONE would alias these
    // two entries even though one call site supplies `settlement` and the other
    // supplies `save`. The `file` component is the only thing separating them.
    paramMemoSettlement: 'function inspect(value) { return value.__memoSettlement; }\n'
      + 'export function probe(settlement) { return inspect(settlement); }\n',
    paramMemoSave: 'function inspect(value) { return value.__memoSave; }\n'
      + 'export function probe(save) { return inspect(save); }\n',
    noWriter: 'export function probe(settlement) {\n'
      + '  return settlement.__noWriterEverWritesThisKey;\n'
      + '}\n',
    // `tier` exists on BOTH `settlement` and `steadings`; `population` exists on
    // both too. A detector that merely disliked unusual key names would flag the
    // negative control as well — this is the discrimination pin.
    observedKeys: 'export function probe(settlement) {\n'
      + '  return [settlement.tier, settlement.population, settlement.economicState];\n'
      + '}\n',
    nested: 'export function probe(settlement) {\n'
      + '  const ps = settlement.powerStructure;\n'
      + '  const rows = ps.factions;\n'
      + '  return rows.map((faction) => faction.id);\n'
      + '}\n',
    // The path that let TCD-3 escape the FIRST spelling of this scanner. Inside
    // `inner`, `bag` resolves to a PARAMETER SENTINEL, not a shape; a receiver
    // check that treated the sentinel as "grounded" looked up `shapes['@param0']`,
    // found nothing, and silently discarded the whole chain. `factions` has more
    // than one home, so it cannot be recovered by the ungrounded rule — this
    // probe is only reported while the sentinel is handled correctly.
    helper: 'function inner(bag) { return bag.powerStructure.factions; }\n'
      + 'export function probe(settlement) {\n'
      + '  return inner(settlement).map((faction) => faction.id);\n'
      + '}\n',
    arraySurface: 'export function probe(settlement) {\n'
      + '  const rows = settlement.powerStructure.factions;\n'
      + '  return rows.length + rows.filter(Boolean).length;\n'
      + '}\n',
  };

  /** probe name -> that probe's OWN findings, from the single combined scan. */
  let planted = null;

  const hitsFor = (name) => {
    expect(planted, 'the combined plant scan did not run — every mutant below would be vacuous').not.toBe(null);
    return planted[name];
  };

  beforeAll(() => {
    const dir = mkdtempSync(join(tmpdir(), 'osr-mutant-'));
    const basenames = Object.fromEntries(Object.keys(PROBES).map((name) => [name, `probe_${name}.js`]));
    for (const [name, body] of Object.entries(PROBES)) writeFileSync(join(dir, basenames[name]), body);
    const out = scanEstateWith(Object.values(basenames).map((b) => join(dir, b)));
    planted = Object.fromEntries(Object.keys(PROBES)
      .map((name) => [name, out.findings.filter((f) => f.file.endsWith(basenames[name]))]));
  }, 900_000);

  test('THE PARTITION HOLDS: each probe was planted and is addressed by its own file', () => {
    // Without this, a basename typo would hand every mutant an EMPTY array and
    // the two negative controls below would pass on nothing at all — the exact
    // vacuity the single-scan refactor could have introduced.
    expect(Object.keys(planted).sort()).toEqual(Object.keys(PROBES).sort());
    expect(hitsFor('noWriter').length + hitsFor('nested').length + hitsFor('helper').length)
      .toBe(3);
  });

  test('THE PARAMETER MEMO IS FILE-SCOPED: same-position helpers keep distinct shapes', () => {
    expect(PROBES.paramMemoSettlement.indexOf('function inspect')).toBe(0);
    expect(PROBES.paramMemoSave.indexOf('function inspect')).toBe(0);
    expect(hitsFor('paramMemoSettlement').map(({ key, shapes }) => ({ key, shapes })))
      .toEqual([{ key: '__memoSettlement', shapes: ['settlement'] }]);
    expect(hitsFor('paramMemoSave').map(({ key, shapes }) => ({ key, shapes })))
      .toEqual([{ key: '__memoSave', shapes: ['save'] }]);
  });

  test('THE MUTANT REDS: a planted reader of a key with no writer is reported', () => {
    const hits = hitsFor('noWriter');
    expect(hits.length).toBe(1);
    expect(hits[0].key).toBe('__noWriterEverWritesThisKey');
    expect(hits[0].shapes).toEqual(['settlement']);
  });

  test('THE MUTANT SHAPE-CHECKS: the SAME key is silent on a shape that carries it', () => {
    expect(hitsFor('observedKeys')).toEqual([]);
  });

  test('THE MUTANT REACHES A NESTED SHAPE, not just the root', () => {
    const hits = hitsFor('nested');
    expect(hits.map((h) => h.key)).toEqual(['id']);
    expect(hits[0].shapes).toEqual(['factions']);
  });

  test('THE MUTANT CROSSES A HELPER: a parameter sentinel does not kill the chain', () => {
    const hits = hitsFor('helper');
    expect(hits.map((h) => h.key)).toEqual(['id']);
    expect(hits[0].shapes).toEqual(['factions']);
  });

  test('THE MUTANT IS SILENT ON AN ARRAY: array surface is never a domain key', () => {
    expect(hitsFor('arraySurface')).toEqual([]);
  });

  test('⚠⚠ THE SCAN BUDGET: exactly TWO full-tree scans, never one per mutant', () => {
    // THE DETERMINISM RATCHET. See the scan-budget note at the top of this file.
    // If this number grows, a per-test scan has come back. SHARE the scan — do
    // NOT raise a timeout to cover it, and do NOT baseline the resulting
    // failure: a timeout frozen into scripts/.test-ratchet-baseline.json is a
    // phantom that can never be burned down.
    expect(scansRun, 'a full-tree scan was added — share it instead of buying headroom').toBe(2);
  });

  /**
   * ⭐⭐ THE GROWTH LAW, DRIVEN LIVE AND IN BOTH DIRECTIONS.
   *
   * ⚠⚠ A GROWTH RULE THAT LIVES IN A TEST TITLE CONSTRAINS NOTHING. The recorded
   * instance: a census arm titled "never grew" asserted no SIZE at all, and
   * planted growth passed 16/16 GREEN. So this pin does not read the frozen
   * baseline — that comparison belongs to the shrink-only test above and is
   * whatever the freeze state makes it. It derives the inventory FROM THE LIVE
   * SCAN, proves the clean comparison is empty, and then proves that ONE planted
   * finding reds WITH ITS IDENTITY NAMED. Both halves execute at every sha,
   * before and after any freeze.
   */
  test('THE GROWTH LAW IS EXECUTED: a live-derived inventory is green, and ONE planted read reds', () => {
    const frozen = { inventory: inventoryOf(live.findings) };
    const clean = compare(live.findings, frozen);
    expect(clean.violations).toEqual([]);
    expect(clean.stale).toEqual([]);
    // The control is not vacuous: the live scan really did find things.
    expect(Object.keys(frozen.inventory).length).toBeGreaterThan(100);

    const planted = [
      ...live.findings,
      leafFinding('src/domain/rulingPower.js', 10_000_001, '__plantedGrowthKey', 'factions'),
    ];
    const grown = compare(planted, frozen);
    expect(grown.violations).toHaveLength(1);
    expect(grown.violations[0]).toContain('src/domain/rulingPower.js');
    expect(grown.violations[0]).toContain(leafIdentity('__plantedGrowthKey', 'factions'));
    expect(grown.violations[0]).toContain('ceiling 0');
    expect(grown.stale).toEqual([]);

    // …and growth of an EXISTING identity's multiplicity reds too, which a
    // per-identity presence check (rather than a count check) would miss.
    const subject = Object.entries(frozen.inventory)
      .flatMap(([file, row]) => Object.entries(row).map(([id, count]) => ({ file, id, count })))
      .find(({ file }) => file.startsWith('src/'));
    const duplicated = [
      ...live.findings,
      leafFinding(subject.file, 10_000_002, subject.id.split(' on ')[0], subject.id.split(' on ')[1]),
    ];
    const overcount = compare(duplicated, frozen);
    expect(overcount.violations).toHaveLength(1);
    expect(overcount.violations[0]).toContain(`frozen ceiling is ${subject.count}`);

    // A2: a SAME-IDENTITY explained-writer read is not exempt from the numeric
    // ceiling. It is reported structurally and names the exact address/count.
    const explained = Object.entries(frozen.inventory)
      .flatMap(([file, row]) => Object.entries(row).map(([id, count]) => ({ file, id, count })))
      .find(({ id }) => EXPLAINED_WRITER_EXEMPTIONS.some((entry) => entry.identity === id));
    const taggedOverage = compare([
      ...live.findings,
      leafFinding(explained.file, 10_000_003, explained.id.split(' on ')[0], explained.id.split(' on ')[1]),
    ], frozen);
    expect(taggedOverage.explainedGrowth).toEqual([{
      file: explained.file,
      identity: explained.id,
      count: explained.count + 1,
      ceiling: explained.count,
    }]);
    expect(taggedOverage.violations[0]).toContain(explained.file);
    expect(taggedOverage.violations[0]).toContain(explained.id);
    expect(taggedOverage.violations[0]).toContain(`${explained.count + 1} read(s)`);
    expect(taggedOverage.violations[0]).toContain(`frozen ceiling is ${explained.count}`);
  });

  test('RATCHET FAILURE PATHS: growth, a vanished row, and a collapsed corpus each red', () => {
    const RP = 'src/domain/rulingPower.js';
    const findings = [
      leafFinding(RP, 1, 'id', 'factions'),
      leafFinding(RP, 2, 'id', 'factions'),
    ];
    const inventory = inventoryOf(findings);
    // (a) a multiplicity above the frozen row
    expect(compare(findings, { inventory: { [RP]: { [leafIdentity('id', 'factions')]: 1 } } }).violations)
      .toHaveLength(1);
    // (b) the exact inventory — the control that keeps (a) honest
    expect(compare(findings, { inventory }).violations).toEqual([]);
    // (c) an UNBASELINED file has ceiling ZERO — the law for all new work
    expect(compare([leafFinding('src/brand/new.js', 1, 'k', 'settlement')], { inventory: {} }).violations)
      .toHaveLength(1);
    // (d) a row whose file is gone is fatal, not merely bankable, and tells the
    // caller to re-derive rather than hand-edit the generated baseline.
    const vanished = compare([], {
      inventory: { 'src/does/not/exist.js': { [leafIdentity('k', 's')]: 1 } },
    }).stale;
    expect(vanished).toHaveLength(1);
    expect(vanished[0]).toContain('governed --write re-freeze');
    expect(vanished[0]).toContain('Never hand-edit');
    const gone = compare([], {
      inventory: { [RP]: { [leafIdentity('id', 'factions')]: 1 } },
    }).stale;
    expect(gone[0]).toContain('is GONE');
    expect(gone[0]).toContain('governed --write re-freeze');
    expect(gone[0]).toContain('Never hand-edit');
    // (e) an unbanked shrink is stale: the live inventory has no headroom.
    const shrunk = compare([findings[0]], { inventory });
    expect(shrunk.violations).toEqual([]);
    expect(shrunk.stale).toHaveLength(1);
    expect(shrunk.stale[0]).toContain('governed --write re-freeze');
    expect(shrunk.stale[0]).toContain('Never hand-edit');
    // (f) a collapsed corpus is refused
    expect(sentinelFailures({ usableShapes: 1, totalKeys: 1, resolvedReads: 1 }, baseline.sentinel).length)
      .toBeGreaterThanOrEqual(3);
    expect(sentinelFailures(baseline.sentinel, baseline.sentinel)).toEqual([]);
  });

  test('⚠⚠ THE SWAP MUTANT: a NEW identity at CONSTANT COUNT reds (the defect form one let land)', () => {
    const RP = 'src/domain/rulingPower.js';
    const held = [
      leafFinding(RP, 1, 'id', 'factions'),
      leafFinding(RP, 2, 'id', 'factions'),
    ];
    const frozen = { inventory: inventoryOf(held) };
    // CONTROL — same identities, same count: green.
    expect(compare(held, frozen).violations).toEqual([]);
    // MUTANT — one finding REMOVED, a different one ADDED. The file's total is
    // identical, so the retired count-only ratchet was green here.
    const swapped = [held[0], leafFinding(RP, 2, 'foundingTier', 'steadings')];
    expect(swapped.length, 'the mutant must hold the count constant or it proves nothing').toBe(held.length);
    const out = compare(swapped, frozen);
    expect(out.violations).toHaveLength(1);
    expect(out.violations[0]).toContain(leafIdentity('foundingTier', 'steadings'));
    expect(out.violations[0]).toContain('ceiling 0');
    // and the departed multiplicity is stale, not swallowed silently
    expect(out.stale.join('\n')).toContain(leafIdentity('id', 'factions'));
  });

  test('⚠⚠ THE SWAP MUTANT, LIVE: rulingPower.js swapped at constant count against the REAL scan', () => {
    // The verifier drove exactly this against the real frozen inventory. It is
    // repeated here on live findings so the proof re-executes on every gate.
    // ⚠ The frozen side is the LIVE-DERIVED inventory, not the baseline file:
    // the swap property must hold at every sha, including one where the baseline
    // is mid-migration and the shrink-only comparison above is legitimately red.
    const RP = 'src/domain/rulingPower.js';
    const rows = live.findings.filter((f) => f.file === RP);
    expect(rows.length, `${RP} carries no findings — pick another live subject`).toBeGreaterThan(0);
    const others = live.findings.filter((f) => f.file !== RP);
    const frozen = { inventory: inventoryOf(live.findings) };
    // the tree as it stands is green against its own inventory
    expect(compare(live.findings, frozen).violations).toEqual([]);
    // drop one real finding, add one that no writer produces: SAME COUNT
    const swapped = [
      ...rows.slice(1),
      leafFinding(RP, 10_000_003, '__swappedInNoWriterKey', 'settlement'),
    ];
    expect(swapped.length).toBe(rows.length);
    const out = compare([...others, ...swapped], frozen);
    expect(out.violations, 'a constant-count identity swap MUST red — this is the whole cure').toHaveLength(1);
    expect(out.violations[0]).toContain(leafIdentity('__swappedInNoWriterKey', 'settlement'));
  });

  test('inventoryOf counts per file AND per identity', () => {
    expect(inventoryOf([
      leafFinding('src/b.js', 1, 'x', 's'),
      leafFinding('src/a.js', 1, 'x', 's'),
      leafFinding('src/b.js', 2, 'y', 's'),
      leafFinding('src/b.js', 3, 'x', 's'),
    ])).toEqual({
      'src/a.js': { [leafIdentity('x', 's')]: 1 },
      'src/b.js': {
        [leafIdentity('x', 's')]: 2,
        [leafIdentity('y', 's')]: 1,
      },
    });
  });
});

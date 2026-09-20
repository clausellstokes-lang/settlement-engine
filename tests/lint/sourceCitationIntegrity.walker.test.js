// @vitest-environment node
/**
 * sourceCitationIntegrity.walker.test.js — A CITED LINE NUMBER IS A CLAIM, AND
 * NOTHING IN THIS ESTATE HAD EVER CHECKED ONE (FIX-C2, ODQ §934.47 addendum 44).
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────
 * The estate carries 14,604 `<path>:<line>` citations across 471 files. Measured
 * 2026-09-20, ZERO of them were truth-guarded and 64 were form-guarded: the
 * prose-wiring census asserts only that a `cite:` field CONTAINS a colon, and the
 * three baselines that hold line numbers REGENERATE them rather than assert them
 * (their own headers record "88 pure line moves" and "re-addresses 238 → 373" as
 * routine). So an address is written once, is true for a day, and then an
 * unrelated insertion six lines above it silently makes it false — eleven
 * citations of one `Primitives.jsx` address rotted together that way, all by
 * exactly six.
 *
 * The sharpest case is not a comment. `subsystemRowsWar.js` carried SEVEN
 * citations past the end of `warDeployment.js` (a 1,338-line file cited as far
 * as 2,133), TWO of them inside executable strings that ship as the `other:`
 * evidence prose of certification rows. The file had been decomposed into
 * `warHomeCosts.js` and `warSiegeVerdict.js`; the evidence kept naming the old
 * module at the old line.
 *
 * Even the instrument that measures the estate's tuning had rotted: of the three
 * hand-written `realHome` addresses in `scripts/count-tuning-inventory.mjs`, one
 * was off by 11 and one was off by one INTO THE WRONG SEMANTIC ARM.
 *
 * ── ARM 1 · THE EOF ARM, OVER LIVE CODE (GATE-WIRED, NO BASELINE) ────────────
 * A citation whose line is past the end of the file it addresses cannot be right,
 * whatever it meant to name. No symbol, no heuristic, no judgment. Measured over
 * the whole live-code corpus it has ZERO false positives and reaches 100% of
 * RESOLVABLE citations, where the symbol arm reaches 5.6%. `src/`, `tests/` and
 * `scripts/` carry NO baseline: past-EOF there is always red.
 *
 * ── ARM 2 · THE EOF ARM, OVER LIVE DOCS (SHRINK-ONLY BASELINE) ───────────────
 * The same objective test over `docs/`, against .source-citation-baseline.json —
 * the prose-numerics idiom. A NEW past-EOF citation reds; a baselined row that
 * has cleared also reds, with "delete its entry", so the set can only fall. The
 * baseline holds the SET (citing file × address), never counts, because a count
 * assertion would red every time a document legitimately restates an address it
 * already carries, and a gate that reds on correct behaviour gets turned off.
 *
 * ⚠ THE ARCHIVAL EXCLUSION, MEASURED AND LISTED. 30 documents are frozen records
 * of their day, and re-addressing them to today's tree would FALSIFY a record
 * rather than repair it — `docs/review-r2/VERIFY_SUBSYSTEMS_RESULTS.json` pins a
 * sha and states that all its cited lines matched AT THAT SHA. They carry 377
 * past-EOF citations this gate deliberately does not see. FOUR rules select them,
 * each checkable, and the full roster is committed in the baseline's
 * `archivalExclusionAtFreeze.files`:
 *   tree (16)    docs/review-r2/**, docs/shift-records/**
 *   banner (8)   a blockquote status banner naming HISTORICAL in the opening ten
 *                lines — the estate's OWN marker (docs/README.md §"HISTORICAL —
 *                point-in-time audit / plan / status exhaust (not maintained)"):
 *                A_PLUS_ROADMAP, CAPABILITY_REMEDIATION_PLAN, GAME_GRADE_AUDIT,
 *                GENERATION_COHERENCE_AUDIT, LANDING_HANDOFF_AMENDMENTS,
 *                SIMULATION_LOGIC_AUDIT, SOL_QUEUE, UIUX_AUDIT_AND_PLAN
 *                (GAME_GRADE_AUDIT joined 2026-09-20, FIX-C2b: a 2026-07-24 audit
 *                pinning composite-r4 @ 69b7a8d3 whose citations address a town-map
 *                surface deleted at 43c3ac3805. It hid nothing — the excluded
 *                past-EOF count stayed 377 and ARM 2 was 0 on both sides.)
 *   dated (5)    an ISO date in the filename: the three COMPREHENSIVE_REVIEWs,
 *                HANDOFF_2026-08-01_PAUSE, SIM-SEALS-SURVEY-2026-09-19
 *   sha-pin (1)  a header that pins the tree it describes (`**Snapshot base:**`):
 *                SETTLEMENT_CAPABILITY_ATLAS
 * The BLOCKQUOTE is required, not decoration: docs/README.md discusses the word
 * HISTORICAL in body prose while being the most live document in the tree, and a
 * bare word match excluded it. A first pass tried "any hex sha in the header"
 * instead and swallowed 269 of 493 documents including live design specs — the
 * measurement is in the lane report. The bias is deliberate and one-directional:
 * a live document wrongly baselined costs one row, a frozen one wrongly excluded
 * costs a permanent blind spot, so anything not provably frozen is INCLUDED.
 *
 * ── ARM 3 · THE SYMBOL ARM (REPORT-ONLY, LIVE CODE + LIVE DOCS) ──────────────
 * A citation whose adjacent backticked symbol is not on the cited line. It never
 * fails the gate, and the reason is arithmetic rather than caution: a citation is
 * symbol-checkable only when the name and the number sit on the SAME line, which
 * is true of 5.6% of live-code citations. The charter's own example is invisible
 * to it — `bearerSituation` is named on the line ABOVE its address. Widening the
 * window to a paragraph pushed the measured finding count from 38 to 8,120, on
 * common nouns ("tabs", "source", "settlement") read as symbols. Precision and
 * coverage trade directly, and this arm keeps the precision and prints what it
 * sees, exactly as proseWiringCensus gates three identities and reports the rest.
 *
 * ⭐ IT REACHED ONLY `CODE_TREES` UNTIL FIX-C2c (2026-09-20), WHICH IS WHERE IT IS
 * WORST. Measured at `578272a99` the two halves are almost mirror images:
 *   live code   4 findings, THREE of them confirmed false positives
 *   live docs 223 findings on a sample-of-twenty lead-validity of 19/20
 *             (209 after FIX-C2c's own twenty cures)
 * The structural cause is where each corpus writes its citations. Code writes them
 * inside dense, backtick-rich comments where a NEIGHBOURING symbol steals the
 * attribution; docs write "`symbol` at `path:line`" in prose and tables, where the
 * adjacent backtick IS the address's subject. The three standing code false
 * positives are `scripts/wiring-census.mjs:349` (the documented case below),
 * `tests/domain/roadsParticipation.test.js`'s `npcVerdictPulse.js:133` (TRUE: the
 * `replaceOustedNpcs(` call whose base argument sits at `:134`) and
 * `tests/lint/dossierMountRegistry.walker.test.js`'s `Primitives.jsx:120` (TRUE:
 * that line IS `{open && <div>{children}</div>}`; the sentence attaches
 * `Collapsible` to the BARE `:89`, which is the same construct inside it).
 *
 * ⛔ THE LANDED-PACKET RULE, AND WHY THE DOCS HALF NEEDS ONE. 192 of the
 * manifest's 194 packets are LANDED, and a landed packet is a frozen record in
 * exactly the sense a `docs/review-r2/` result is — it names the base it was
 * verified at and its own header says "do not redispatch". Without the rule the
 * widened arm prints 443 findings; with it, 223. The excluded 220 are the
 * packets' own frozen evidence, among them three stale `implementation-packets.mjs`
 * addresses in HB-2, WF-1D and SCW-0. The five in-range stale addresses FIX-C2b
 * recorded (in GR-3B-ORIENT, GR-4A, GR-4B, IN-0C, IN-1A, TC-5B-II, ES-DA and
 * DCS-1) are covered by the same rule — every one of those packets is LANDED — but
 * this arm never printed them and does not now: they carry no adjacent backticked
 * declared symbol, which is the 5.6% ceiling above, not the exclusion.
 * The rule reads `PACKET_MANIFEST.json`'s
 * `status` (`landedPacketPaths`) and never a hand list, so a packet that changes
 * status moves the corpus with it; READY, SUPERSEDED and a packet file the
 * manifest does not list at all stay LIVE. (443 and 223 are both measured BEFORE
 * this lane's own twenty cures, so the pair compares the rule against itself on
 * one tree state.)
 *
 * ⚠ A LEAD IS NOT A CURE INSTRUCTION, AND THE SAMPLE SAYS SO TWICE. On the same
 * twenty, lead validity was 19/20 but SYMBOL ATTRIBUTION was only 16/20: the arm
 * pointed at the right citation by the wrong name four times. The sharpest is
 * `tests/components/handbookVoice.test.jsx`'s "AppViews.jsx:46 renders
 * `<HowToUse />`" — `declaredAt` says `:47` (the lazy() DECLARATION) and the
 * sentence's verb says `:182` (the only place it RENDERS). Cure by reading the
 * sentence; a cure driven by `declaredAt` writes a new wrong address.
 *
 * ⛔ AND IT HAS A MEASURED FALSE POSITIVE, WHICH IS WHY IT MUST NEVER GATE. Of the
 * 31 findings in its first run, ONE was wrong, and it was wrong in the way this
 * arm is structurally able to be wrong: a NEIGHBOURING backtick wins the
 * attribution. `scripts/wiring-census.mjs` cites `defenseGenerator.js:189-191`
 * for a `milUpkeepMult` derivation, with `economicGates.military` backticked
 * beside it; the arm attributed `economicGates` (declared far below) to the span
 * and convicted a citation that was TRUE. It was caught only by reading the
 * re-address diff line by line — the automated cure had already broken the
 * correct address. Two survivors of the same audit went the other way
 * (`EconomicsTab.jsx:251-257`, `OverviewTab.jsx:120-134` were genuinely stale),
 * so the class is not "ranges are safe": it is that a SPAN addresses what its
 * sentence says it addresses, and only a reader knows which name that is.
 * TREAT EVERY LINE THIS ARM PRINTS AS A LEAD, NEVER AS A VERDICT.
 *
 * ── WHAT THIS WALKER CANNOT SEE (measured, not guessed) ──────────────────────
 * An UNRESOLVABLE citation is SKIPPED, never convicted: this gate judges only an
 * address it can read, which is also what makes the synthetic `fixture.ts:1`
 * inside a test assertion a non-event rather than an allowlist entry. Measured at
 * `578272a99` (FIX-C2c): 14,834 citations seen, 14,244 resolved, 166 ambiguous
 * (12 distinct basenames — now READ by ARM 5 below) and 424 absent (143 tokens).
 *
 * ⭐ THE ABSENT SET IS NOT ONE THING, AND CALLING IT "absent" HID FOUR CLASSES.
 * Classified against the WHOLE history path set (one `git log --all --name-only`
 * pass; a per-token pathspec glob under-matched four of them by anchoring on the
 * token's own leading segment):
 *   DELETED-or-RENAMED (307)  the token suffix-matches a path in history.
 *                             Dominated by the town-map strip — TE-STRIP-1
 *                             (43c3ac3805), -2 (f02289efec), -3, -4.
 *   SYNTHETIC (32)            the walkers' own planted fixtures and illustrations.
 *   MISPATHED (13)            the file is LIVE but the citation names a wrong
 *                             directory — `src/domain/spatialSubstrateRead.js` is
 *                             `src/domain/spatial/spatialSubstrateRead.js`.
 *   VENDORED                  a `node_modules` build named without its prefix
 *                             (`jspdf.es.js`, `react-pdf.js`, lint-staged's own
 *                             `gitWorkflow.js`, vitest's `tasks.d-*.d.ts`).
 *   ABBREVIATED               a LIVE file exists whose basename ENDS with the
 *                             token: `packets.mjs` is
 *                             `scripts/implementation-packets.mjs`, `session.mjs`
 *                             is `implementation-session.mjs`, `schema.js` is
 *                             `settlement.schema.js`. True as prose, false as an
 *                             address, and invisible to a suffix index.
 *   PINNED-UNCOMMITTED        THE FOURTH SUB-CLASS, named by FIX-C2c. TWO tests,
 *                             both checkable: the token suffix-matches NOTHING in
 *                             `git log --all`, AND the citing document records a
 *                             tree hash or a date. The proof case is FIX-C2b's:
 *                             `writers.js` x27 in the sha-pinned
 *                             SETTLEMENT_CAPABILITY_ATLAS, whose own front matter
 *                             says several mapped systems "exist only as untracked
 *                             files". It is NOT deletion and NOT a rename — the
 *                             target never entered history on this line, so no
 *                             commit can ever be cited for its going.
 * ⚠ THE MEASURED CONSEQUENCE, and it is why the class needs naming rather than
 * curing: every PINNED-UNCOMMITTED citation already sits inside an archival
 * document or a LANDED packet, EXCEPT ONE — `docs/DESIGN_REALM_MAGIC_TOGGLE.md`'s
 * `WorldMap.js:758-770`, struck by FIX-C2c with its reason. There is nothing to
 * re-address, because there is no file to re-address to.
 *
 *   · a stale address that still lands inside the file (ARM 3 reads for this, and
 *     reports rather than convicts).
 *
 * ── ARM 4 · THE BARE `:NNN` ARM (REPORT-ONLY, LIVE CODE + LIVE DOCS) ─────────
 * A line address with no path in front of it, inheriting its file from a citation
 * earlier in the same SENTENCE, as in `peaceTerms.js:213, :269` — both true here
 * on purpose, because this arm reads its own header and an illustrative address
 * that is false would be a finding the walker itself planted.
 * The CITATION regex requires a path token, so ARMS 1-3 are blind to the whole
 * form. MEASURED 2026-09-20: 661 of them — 59 in live code, 602 in live docs, more
 * than four times ARM 1's entire live-code reach — and 12 address a line past the
 * end of the file their sentence names.
 *
 * ⛔ IT NEVER GATES, and like ARM 3 the reason is arithmetic. A bare number can
 * inherit a path the sentence names WITHOUT a line, which this reader cannot see:
 * MF-UC1.md:178 cites `resolveTerrain.js:57` and then lists seven TERRAIN_DATA
 * classes as `:51`…`:623`, which belong to a `geographyData.js` named two clauses
 * later as a grep argument. SIX of the twelve findings are that one sentence, and
 * restricting the arm to single-path sentences does not remove them (measured).
 * There is no precision knob that makes it gateable, so it prints and the reader
 * judges — the same contract ARM 3 earns for the same measured reason.
 *
 * ⛔ AND IT HAD A BLIND SPOT OF ITS OWN, FOUND BY MEASUREMENT (FIX-C2b, 2026-09-20).
 * `SKIP_DIRS` carried a bare `build`, and `collectFiles` matches a bare name at EVERY
 * depth, so the entry meant for a repo-root build output hid `tests/build/` — 59 test
 * files — from the walk and from the target index. Both halves of the estate paid: the
 * 7 citations written inside those files were read by no arm, and 44 citations
 * elsewhere that NAMED one of them (`vendorPdfLazy.test.js` x18, `townMapLazy.test.js`
 * x6, …) resolved to nothing and were skipped as unreadable rather than checked — which
 * is why they surfaced as "absent target paths" in FIX-C2's recon when the files were
 * there all along. PROVED by planting a past-EOF citation inside `tests/build/`: the
 * pre-cure walk saw 5,208 files and ZERO findings, the cured walk 5,268 and the plant.
 * Re-admitting the directory added no past-EOF finding (ARM 1 stays 0); ARM 3 went 2→3.
 * THE LAW: a skip list matched by bare name is matched at every depth, so every entry
 * must be a name that can never be a source directory.
 *
 * ── ARM 5 · THE AMBIGUOUS-BASENAME ARM (REPORT-ONLY, ALL CORPORA) ────────────
 * A citation whose token matches 2+ files. Until FIX-C2c every arm dropped it
 * WITHOUT A WORD — `buildTargetIndex` returned null and all four arms `continue`
 * on a null target — so 166 citations across 12 basenames were the estate's
 * largest remaining blind spot after `tests/build/`. The biggest are `en.js` (67,
 * two candidates: `src/copy/en.js` and a vendored tinymce i18n file), `index.js`
 * (21, THIRTEEN candidates) and `index.ts` (13, THIRTY-TWO supabase entrypoints).
 *
 * It resolves what the sentence actually says — one objective filter (`extent`: a
 * candidate too short to hold the address cannot be meant) and three kinds of
 * evidence (a discriminating directory segment in the sentence, an import in the
 * citing file, a backticked symbol exactly one candidate declares) — and NAMES the
 * rest with their candidates. Measured at this tip: 98 of 169 resolved
 * (`extent` 86, `directory` 7, `symbol` 5), 71 left open and printed. The estate's
 * own population is 166; the other three are this walker's and the shared module's
 * illustrative citations, which are TRUE and which the arm resolves, exactly as
 * ARM 4's header carries real addresses rather than invented ones.
 *
 * ⛔ AND IT MUST NEVER FEED ARMS 1 AND 2, which is a stronger rule than "it must
 * never gate". `buildTargetIndex`'s null for an ambiguous token is the only thing
 * keeping those addresses out of the gating arms, and teaching IT to guess would
 * hand ARM 1 (live code, no baseline) and ARM 2 (live docs, a ratchet AT ZERO) a
 * set nobody has ever checked — `docs/FIRST_CONTACT_BACKLOG.md:2830` alone cites
 * `en.js:1549`. The disambiguation therefore lives in `disambiguateToken`, is
 * consumed only here, and leaves the gate's resolver byte-identical.
 *
 * ⚠ IT READS FROM DISK, DELIBERATELY. `git grep` without a rev reads the INDEX,
 * and the mutation sweep proves this gate by PLANTING an untracked file, so an
 * index-based walk would be blind to its own mutant.
 *
 * ⛔⛔ THREE FILES ARE READ BY THIS GATE BUT MUST NOT BE CURED FROM IT. The prose
 * manifest golden pins its RECORDER by the RAW SHA of three files —
 * `tests/helpers/dossierManifest.js`, `tests/helpers/goldenMasterCorpus.js` and
 * `scripts/prose-rate-corpus.mjs` (`MANIFEST_RECORDER_FILES`,
 * `tests/helpers/dossierManifest.js:335`). A raw-byte pin cannot tell a comment
 * from a behaviour change, so re-addressing a CITATION inside one of them breaks
 * the fixture's provenance and `tests/property/dossierProseManifest.test.js`
 * REFUSES it. It has already happened once: FIX-C2's one-line docblock re-address
 * in `scripts/prose-rate-corpus.mjs` (`EconomicsTab.jsx:251-257` -> `:272`) moved
 * that file's sha with ZERO of the golden's 1,050 rows moved, and reddened run 21
 * (ODQ §934.47 addendum 84). MEASURED at this tip: two of the three recorder shas
 * still MATCH the fixture and only `prose-rate-corpus.mjs` diverges.
 * ⇒ IF AN ARM EVER PRINTS A FINDING WHOSE CITING FILE IS ONE OF THOSE THREE, DO
 * NOT CURE IT. Record it "left — recorder file" and hand it to the lane that owns
 * the recorder identity (CURE-J), because the cure costs a golden re-record that a
 * citation lane may not perform. Measured 2026-09-20: ARMS 1, 3 and 4 each report
 * ZERO findings inside the three, so there is no bait TODAY — this note exists for
 * the day an address in one of them rots.
 *
 * ⚠ ONE FILE IS EXCLUDED BY NAME: .source-citation-baseline.json, which is a
 * register of convicted addresses and would otherwise convict this gate of its
 * own findings. Nothing else is exempt, including this file — its own citations
 * are written to be true.
 *
 * @enforced-by scripts/mutation-sweep.sh ("citations/past-EOF citation planted")
 */
import { describe, expect, test } from 'vitest';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

import {
  BASELINE_REL,
  CODE_TREES,
  ambiguousFindings,
  archivalReason,
  bareFindings,
  buildCandidateIndex,
  buildTargetIndex,
  citationsIn,
  citedLines,
  collectFiles,
  createReader,
  disambiguateToken,
  eofFindings,
  landedPacketPaths,
  partitionDocs,
  rowKey,
  sentenceSpans,
  symbolFindings,
} from './sourceCitationIntegrity.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const read = createReader(ROOT);
const resolve = buildTargetIndex(ROOT);
const candidatesFor = buildCandidateIndex(ROOT);
const codeFiles = CODE_TREES.flatMap((tree) => collectFiles(ROOT, tree));
const docs = partitionDocs(ROOT, read);
/** The frozen-record rule for packet bodies, read from the manifest's own status. */
const landedPackets = landedPacketPaths(ROOT);
/** ARM 3's corpus: live code plus every live document that is not a LANDED packet. */
const symbolCorpus = [...codeFiles, ...docs.live.filter((p) => !landedPackets.has(p))];
const stats = { seen: 0, resolvable: 0 };
const codeEof = eofFindings({ files: codeFiles, resolve, read, stats });
const docsEof = eofFindings({ files: docs.live, resolve, read });

const baseline = JSON.parse(readFileSync(join(ROOT, BASELINE_REL), 'utf8'));
const baselinedRows = new Set(baseline.rows.map(rowKey));

/** One finding, as a line a reader can act on without opening the tree. */
const fmt = (r) => `  ${r.from}:${r.line}  cites ${r.cite}  but ${r.target} has ${r.targetLines} lines`;

describe('source citation integrity — the controls (each proves an arm can RED)', () => {
  /** A synthetic estate: three files, no disk. */
  const files = { 'a/one.js': ['line1', 'line2', 'line3'], 'b/two.md': [] };
  const fakeRead = (rel) => files[rel] ?? null;
  const fakeResolve = (token) => (token === 'one.js' || token === 'a/one.js' ? 'a/one.js' : null);
  const cite = (text) => {
    files['b/two.md'] = [text];
    return eofFindings({ files: ['b/two.md'], resolve: fakeResolve, read: fakeRead });
  };

  test('CONTROL: a citation past the end of its target is convicted', () => {
    const found = cite('see `one.js:9` for the roster');
    expect(found.map((r) => r.cite)).toEqual(['one.js:9']);
    expect(found[0].targetLines).toBe(3);
  });

  test('CONTROL: the same citation acquits the moment it lands inside the file', () => {
    expect(cite('see `one.js:3` for the roster')).toEqual([]);
    expect(cite('see `one.js:1` for the roster')).toEqual([]);
  });

  test('CONTROL: an unresolvable target is SKIPPED, never convicted', () => {
    // A vendored build, an absent file, an ambiguous basename and the synthetic
    // `fixture.ts:1` inside a test assertion all land here. Convicting them would
    // make the gate a liar about files it cannot read.
    expect(cite('see `nowhere.js:9999` for the roster')).toEqual([]);
  });

  test('CONTROL: ranges and lists are parsed, and a range is an INTERVAL', () => {
    // A naive split(':') sees neither form. And endpoints-only reading called a
    // true citation stale: `tuningRegister.walker.test.js:75-91` names a constant
    // declared at :84.
    expect(citationsIn('`one.js:1-17` and `one.js:211,229`').map((c) => c.spec)).toEqual(['1-17', '211,229']);
    expect([...citedLines('75-91')]).toContain(84);
    expect([...citedLines('4,9')].sort((a, b) => a - b)).toEqual([4, 9]);
    // The last number of a range is checked too, not only its opening.
    expect(cite('see `one.js:1-9` for the roster').length).toBe(0);
    expect(cite('see `one.js:8-9` for the roster').length).toBe(1);
  });

  test('CONTROL: the symbol arm convicts a moved symbol and acquits a present one', () => {
    files['a/one.js'] = ['const alpha = 1;', 'const beta = 2;', 'const gammaRay = 3;'];
    const stale = { 'b/two.md': ['`gammaRay` lives at `one.js:1`'] };
    const fresh = { 'b/two.md': ['`gammaRay` lives at `one.js:3`'] };
    const readOf = (bank) => (rel) => (rel === 'a/one.js' ? files['a/one.js'] : bank[rel] ?? null);
    expect(symbolFindings({ files: ['b/two.md'], resolve: fakeResolve, read: readOf(stale) })
      .map((r) => r.symbol)).toEqual(['gammaRay']);
    expect(symbolFindings({ files: ['b/two.md'], resolve: fakeResolve, read: readOf(fresh) })).toEqual([]);
    files['a/one.js'] = ['line1', 'line2', 'line3'];
  });

  test('CONTROL: a bare `:NNN` inherits the NEAREST PRECEDING path, and is convicted past EOF', () => {
    // `one.js` has three lines. The bare `:9` belongs to it and is past its end.
    const bare = (text) => {
      files['b/two.md'] = [text];
      return bareFindings({ files: ['b/two.md'], resolve: fakeResolve, read: fakeRead });
    };
    expect(bare('`one.js:1`, and also :9').map((r) => r.bare)).toEqual([':9']);
    expect(bare('`one.js:1`, and also :2')).toEqual([]);
    // ⛔ NEAREST PRECEDING, never the sentence's LAST: a later path must not steal
    // a bare address written before it. `one.js:1 … :9 … nowhere.js:4` — the `:9`
    // is one.js's, and reading the last anchor would attribute it to an
    // unresolvable target and silently drop a real finding.
    expect(bare('`one.js:1` then :9 then `nowhere.js:4`').map((r) => r.target)).toEqual(['a/one.js']);
    // A bare address with NO preceding citation in its sentence is not a citation.
    expect(bare('the ratio is :9 by itself')).toEqual([]);
    // The anchor's OWN line number is never re-counted as a bare address.
    expect(bare('`one.js:9`').map((r) => r.bare)).toEqual([]);
    // A sentence boundary ends inheritance: `one.js` cannot reach past the stop.
    expect(bare('`one.js:1` is the roster. And :9 is something else.')).toEqual([]);
  });

  test('CONTROL: sentenceSpans splits on stops and cells, but not inside a number', () => {
    expect(sentenceSpans('a. b').map((s) => s.text)).toEqual(['a.', ' b']);
    expect(sentenceSpans('| a | b').map((s) => s.text)).toEqual(['|', ' a |', ' b']);
    // A digit before the stop is a version or a range end, never a sentence end.
    expect(sentenceSpans('v1.2 holds').map((s) => s.text)).toEqual(['v1.2 holds']);
  });

  test('CONTROL: the LANDED rule excludes a landed packet and KEEPS a ready one', () => {
    // A synthetic manifest, because the live one has no READY row to read: EM-R0a
    // was placed READY at 680eacb8d, a DESCENDANT of the base this control was
    // written at. A rule that cannot be shown to keep a READY packet would be a
    // rule nobody could trust the day one exists.
    const dir = mkdtempSync(join(tmpdir(), 'packet-status-'));
    try {
      mkdirSync(join(dir, 'docs/implementation'), { recursive: true });
      writeFileSync(join(dir, 'docs/implementation/PACKET_MANIFEST.json'), JSON.stringify({
        packets: [
          { id: 'L-1', status: 'LANDED', packetPath: 'docs/implementation/packets/x/L-1.md' },
          { id: 'R-1', status: 'READY', packetPath: 'docs/implementation/packets/x/R-1.md' },
          { id: 'S-1', status: 'SUPERSEDED', packetPath: 'docs/implementation/packets/x/S-1.md' },
        ],
      }));
      const landed = landedPacketPaths(dir);
      expect([...landed]).toEqual(['docs/implementation/packets/x/L-1.md']);
      // READY and SUPERSEDED are LIVE, and so is a packet file the manifest never lists.
      expect(landed.has('docs/implementation/packets/x/R-1.md'), 'a READY packet is live').toBe(false);
      expect(landed.has('docs/implementation/packets/x/S-1.md'), 'a SUPERSEDED packet is live').toBe(false);
      expect(landed.has('docs/implementation/packets/x/UNLISTED.md'), 'unknown status is not frozen status').toBe(false);
      // A missing or malformed manifest excludes NOTHING rather than guessing.
      writeFileSync(join(dir, 'docs/implementation/PACKET_MANIFEST.json'), '{ not json');
      expect(landedPacketPaths(dir).size, 'a malformed manifest excludes nothing').toBe(0);
      expect(landedPacketPaths(join(dir, 'no-such-root')).size, 'an absent manifest excludes nothing').toBe(0);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test('CONTROL: the ambiguity reader resolves on evidence and REFUSES without it', () => {
    // synthetic-citation-names: `__c2cCopy.js` and `__c2cTheme.js` name NO file in this
    // tree, deliberately. A first draft of this control used `en.js` and `theme.js` —
    // both of which are REAL ambiguous basenames here — and ARM 5 read six of the
    // control's own string literals as live citations, inflating its population from
    // 168 to 174. A fixture shaped like a real artifact name is read by the walkers
    // that govern its directory (the CURE-I fixture law, run 19); an absent name is
    // skipped by every arm, which is what makes this control inert.
    const bank = {
      'src/copy/__c2cCopy.js': Array.from({ length: 400 }, (_, i) => (i === 41 ? 'const bannerTitle = 1;' : '')),
      'vendor/i18n/__c2cCopy.js': ['short', 'file'],
      'src/a/__c2cTheme.js': ['a', 'b', 'c'],
      'src/b/__c2cTheme.js': ['a', 'b', 'c'],
      'src/importer.js': ["import { x } from './a/__c2cTheme.js';"],
    };
    const r = (rel) => bank[rel] ?? null;
    const copies = ['src/copy/__c2cCopy.js', 'vendor/i18n/__c2cCopy.js'];
    const themes = ['src/a/__c2cTheme.js', 'src/b/__c2cTheme.js'];
    const ask = (token, candidates, sentence, citingFile, cites) => disambiguateToken({
      token, candidates, sentence, citingFile, read: r, cites,
    });
    // extent: a two-line file cannot hold line 300, so only one candidate can be meant.
    expect(ask('__c2cCopy.js', copies, 'see the copy table at 300', 'docs/D.md', 300))
      .toEqual({ path: 'src/copy/__c2cCopy.js', by: 'extent' });
    // directory: a discriminating segment written in the sentence.
    expect(ask('__c2cCopy.js', copies, 'see vendor/i18n/ line 1', 'docs/D.md', 1))
      .toEqual({ path: 'vendor/i18n/__c2cCopy.js', by: 'directory' });
    // import: the citing file's own module graph settles it.
    expect(ask('__c2cTheme.js', themes, 'the theme at 1', 'src/importer.js', 1))
      .toEqual({ path: 'src/a/__c2cTheme.js', by: 'import' });
    // symbol: exactly one candidate declares the backticked name.
    expect(ask('__c2cCopy.js', copies, '`bannerTitle` at line 1', 'docs/D.md', 1))
      .toEqual({ path: 'src/copy/__c2cCopy.js', by: 'symbol' });
    // ⛔ AND IT REFUSES. No extent split, no directory, no import, no symbol.
    expect(ask('__c2cTheme.js', themes, 'the theme at 2', 'docs/D.md', 2)).toBeNull();
    // An address NO candidate can hold leaves the bucket whole rather than re-homing
    // a merely-stale citation onto the longest file that happens to survive.
    expect(ask('__c2cTheme.js', themes, 'the theme at 9999', 'docs/D.md', 9999)).toBeNull();
  });

  test('CONTROL: the archival rule DISCRIMINATES — it is four checkable predicates, not a hunch', () => {
    const bank = {
      'docs/LIVE.md': ['# live', 'body'],
      'docs/BANNERED.md': ['# t', '', '> **⚠️ HISTORICAL (audit snapshot) — do NOT read as current state.**'],
      'docs/PROSE.md': ['# t', '', '**HISTORICAL** docs are point-in-time exhaust, unlike this index.'],
      'docs/PINNED.md': ['# t', '', '**Snapshot base:** `composite-r4 @ 8033ddbe`'],
      'docs/SNAP_2026-07-13.md': ['# t'],
      'docs/review-r2/RESULTS.json': ['{}'],
    };
    const r = (rel) => bank[rel] ?? null;
    expect(archivalReason('docs/review-r2/RESULTS.json', r)).toBe('tree');
    expect(archivalReason('docs/SNAP_2026-07-13.md', r)).toBe('dated');
    expect(archivalReason('docs/BANNERED.md', r)).toBe('banner');
    expect(archivalReason('docs/PINNED.md', r)).toBe('sha-pin');
    expect(archivalReason('docs/LIVE.md', r)).toBeNull();
    // The blockquote is load-bearing: docs/README.md names HISTORICAL in body
    // prose and is the most live document in the tree.
    expect(archivalReason('docs/PROSE.md', r)).toBeNull();
  });
});

describe('source citation integrity — the live estate', () => {
  test('guard-the-guard: the walk reached the corpus and resolved real targets', () => {
    // Every arm below would pass vacuously on an empty walk. Floors are measured
    // against this tree and TIGHTEN toward reality; they are never lowered to
    // admit a shrinking scan.
    expect(codeFiles.length, 'the src/tests/scripts walk collapsed').toBeGreaterThanOrEqual(5000);
    expect(docs.all.length, 'the docs walk collapsed').toBeGreaterThanOrEqual(480);
    expect(docs.live.length, 'the live-docs corpus collapsed').toBeGreaterThanOrEqual(450);
    expect(stats.seen, 'the citation parser matched nothing').toBeGreaterThanOrEqual(700);
    expect(stats.resolvable, 'the target index resolved nothing').toBeGreaterThanOrEqual(600);
    expect(resolve('sourceCitationIntegrity.shared.mjs')).toBe('tests/lint/sourceCitationIntegrity.shared.mjs');
    // ⛔ THE GATE'S RESOLVER STILL REFUSES A COIN FLIP. ARM 5 resolves ambiguity for a
    // READER; this null is what keeps those addresses out of ARM 1 and ARM 2.
    expect(resolve('index.js')).toBeNull();
    expect(candidatesFor('index.js').length, 'the candidate index keeps the whole bucket').toBeGreaterThan(1);
    expect(candidatesFor('no-such-file-anywhere.js'), 'an absent token has no candidates').toEqual([]);

    // The LANDED rule is DERIVED from the manifest, never transcribed, so a packet
    // that changes status moves the corpus with it instead of drifting past a list.
    const manifest = JSON.parse(readFileSync(join(ROOT, 'docs/implementation/PACKET_MANIFEST.json'), 'utf8'));
    const landedRows = manifest.packets.filter((p) => p.status === 'LANDED');
    expect(landedPackets.size, 'every LANDED manifest row is excluded, and nothing else is').toBe(landedRows.length);
    expect(landedPackets.size, 'the frozen-packet set collapsed').toBeGreaterThanOrEqual(150);
    for (const row of manifest.packets.filter((p) => p.status !== 'LANDED')) {
      expect(landedPackets.has(row.packetPath), `${row.id} is ${row.status} and must stay LIVE`).toBe(false);
    }
    expect(symbolCorpus.filter((p) => landedPackets.has(p)), 'ARM 3 still reads a frozen packet body').toEqual([]);
    expect(symbolCorpus.length, 'ARM 3\'s corpus collapsed').toBeGreaterThanOrEqual(5000);
    expect(symbolCorpus.length - codeFiles.length, 'ARM 3 reaches no live document').toBeGreaterThanOrEqual(200);
  });

  test('ARM 1 — NO citation in src/, tests/ or scripts/ points past the end of its target', () => {
    expect(
      codeEof.map(fmt),
      '\nA live-code citation addresses a line that does not exist. The file it names was'
      + ' decomposed, truncated or replaced, and the address was never re-verified — the'
      + ' subsystemRowsWar class (ODQ §934.47 addendum 44). Open the citing line, find the'
      + ' symbol its sentence NAMES, locate that symbol in the target, and write its true'
      + ' line. There is no baseline for live code and there will not be one.\n',
    ).toEqual([]);
  });

  test('ARM 2 — ONLY-SHRINKS: no NEW past-EOF citation in a live document', () => {
    const novel = docsEof.filter((r) => !baselinedRows.has(rowKey(r)));
    expect(
      novel.map(fmt),
      `\nNEW past-EOF citation(s) in live documentation, against ${BASELINE_REL}.`
      + ' Re-address the citation to the symbol its sentence names. This baseline never'
      + ' grows: a new row is a red, not an entry. If the document is a frozen record of'
      + ' its day, give it the estate\'s own HISTORICAL banner rather than editing this'
      + ' gate — the archival rules are listed in this file\'s header.\n',
    ).toEqual([]);
  });

  test('ARM 2 — ONLY-SHRINKS: every baselined row is still live — delete it when it clears', () => {
    const live = new Set(docsEof.map(rowKey));
    const cleared = [...baselinedRows].filter((k) => !live.has(k)).sort();
    expect(
      cleared,
      `\n${cleared.length} baselined past-EOF citation(s) no longer exist. The ratchet only`
      + ` shrinks, so the win is banked by DELETING these rows from ${BASELINE_REL}`
      + ' (the "rows" array; leave frozenAt alone).\n',
    ).toEqual([]);
  });

  test('ARM 3 — REPORT-ONLY: citations whose named symbol has moved, over live code AND live docs', () => {
    const findings = symbolFindings({ files: symbolCorpus, resolve, read });
    // Never an assertion on the count: this arm exists to be READ, and a ratchet
    // over a 5.6%-coverage heuristic would freeze the heuristic, not the estate.
    const inCode = findings.filter((r) => !r.from.startsWith('docs/')).length;
    const lines = findings.map(
      (r) => `  ${r.from}:${r.line}  cites ${r.cite}  but \`${r.symbol}\` is declared at `
        + `${r.declaredAt.slice(0, 4).join(', ')} in ${r.target}`,
    );
    // ⚠ process.stdout.write, NOT console.log, and this is measured rather than
    // stylistic. Under vitest 4.1.8's DEFAULT reporter a passing test's
    // console.log is DROPPED — probed on this tree 2026-09-20, both channels in
    // one passing test: process.stdout survived the default reporter and
    // --reporter=verbose, console.log only the latter. A report-only arm whose
    // report nobody can read is a false instrument, and this walker exists
    // because false instruments are the class.
    process.stdout.write(
      `\nSYMBOL ARM (report-only): ${findings.length} citation(s) whose named symbol is not on the cited line`
      + ` — ${inCode} in live code, ${findings.length - inCode} in live docs, over ${symbolCorpus.length} files`
      + ` (${landedPackets.size} LANDED packet bodies excluded as frozen records).\n`
      + '  ⚠ EVERY LINE IS A LEAD, NEVER A VERDICT. Measured 2026-09-20 on a systematic sample of\n'
      + '  twenty docs findings: 19/20 led to a citation that genuinely needed re-addressing, but only\n'
      + '  16/20 named the right symbol — so cure by reading the SENTENCE, never by `declaredAt`.\n'
      + `${lines.join('\n')}\n\n`,
    );
    expect(Array.isArray(findings)).toBe(true);
  });

  test('ARM 5 — REPORT-ONLY: citations whose basename matches more than one file', () => {
    const stats5 = { seen: 0, resolved: 0 };
    const findings = ambiguousFindings({
      files: [...codeFiles, ...docs.all], candidatesFor, read, stats: stats5,
    });
    const byRule = {};
    for (const r of findings) if (r.by) byRule[r.by] = (byRule[r.by] ?? 0) + 1;
    const open = findings.filter((r) => !r.resolved);
    const byToken = new Map();
    for (const r of findings) {
      const e = byToken.get(r.token) ?? { seen: 0, resolved: 0, candidates: r.candidates.length };
      e.seen += 1;
      if (r.resolved) e.resolved += 1;
      byToken.set(r.token, e);
    }
    const ledger = [...byToken.entries()]
      .sort((a, b) => b[1].seen - a[1].seen)
      .map(([token, e]) => `  ${String(e.resolved).padStart(3)}/${String(e.seen).padEnd(4)} resolved  ${token}`
        + `  (${e.candidates} candidates)`);
    process.stdout.write(
      `\nAMBIGUOUS-BASENAME ARM (report-only): ${stats5.seen} citation(s) whose token matches 2+ files;`
      + ` ${stats5.resolved} resolved by path evidence, ${open.length} left open.\n`
      + `  by rule: ${JSON.stringify(byRule)}\n${ledger.join('\n')}\n`
      + `${open.map((r) => `  OPEN  ${r.from}:${r.line}  ${r.cite}  ->  ${r.candidates.slice(0, 4).join(' | ')}`
        + `${r.candidates.length > 4 ? ` | …${r.candidates.length - 4} more` : ''}`).join('\n')}\n\n`,
    );
    // A population floor, exactly as ARM 4 carries: a walk that stops finding the
    // form entirely has broken, and that is worth a red even in a report-only arm.
    expect(stats5.seen, 'the ambiguity reader matched nothing — 2+-candidate tokens cannot have vanished')
      .toBeGreaterThanOrEqual(100);
  });

  test('ARM 4 — REPORT-ONLY: bare `:NNN` addresses past the end of the file their sentence names', () => {
    const stats4 = { seen: 0 };
    const findings = bareFindings({ files: [...codeFiles, ...docs.live], resolve, read, stats: stats4 });
    // No assertion on the count, for ARM 3's reason: the attribution is not sound
    // (a bare address can inherit a path named without a line), so a ratchet here
    // would freeze a heuristic rather than the estate. It prints leads.
    const lines = findings.map(
      (r) => `  ${r.from}:${r.line}  ${r.bare} inherits ${r.inherits} -> ${r.target} (${r.targetLines} lines)`,
    );
    process.stdout.write(
      `\nBARE-ADDRESS ARM (report-only): ${stats4.seen} bare \`:NNN\` address(es) read; `
      + `${findings.length} point past the end of the file their sentence names.\n`
      + `${lines.join('\n')}\n\n`,
    );
    // The population itself is a floor, not a ratchet: a walk that stops finding
    // the form entirely has broken, and that is worth a red even here.
    expect(stats4.seen, 'the bare-address reader matched nothing — the form cannot have vanished')
      .toBeGreaterThanOrEqual(400);
  });

  test('the archival exclusion is still the set this walker documents', () => {
    // An exclusion nobody counts is an exclusion nobody audits. If a document
    // acquires or loses its frozen-record marks, the header above and the
    // committed roster must move WITH it, deliberately.
    const byRule = {};
    for (const { reason } of docs.archival) byRule[reason] = (byRule[reason] ?? 0) + 1;
    expect(
      byRule,
      'the archival roster moved. Re-measure, update archivalExclusionAtFreeze in '
      + `${BASELINE_REL} and the header of this file, and say in the commit which `
      + 'document changed class and why.',
    ).toEqual(baseline.archivalExclusionAtFreeze.byRule);
  });
});

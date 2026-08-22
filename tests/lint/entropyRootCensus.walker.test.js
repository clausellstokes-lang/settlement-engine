/**
 * entropyRootCensus.walker.test.js — the ENTROPY-ROOT census (wave EP-0).
 *
 * THE CLASS: an advance-epoch program that freshens only the pulse root ships a "fresh
 * future" whose weather, traditions, road cadence, NPC succession contests, city demographic
 * responses and sovereignty-market buyers are bit-for-bit the OLD future — because those
 * draws never touch the pulse `rng`. They compose their own keys from `worldState.rngSeed`
 * DIRECTLY, in three different entropy idioms, across module boundaries, under receiving
 * variables named `rngSeed`, `seed`, `realm`, `realmId`, `intelSeed` and `seedId`.
 *
 * ⛔ THIS IS NOT A `createPRNG` CENSUS, AND THAT IS THE WHOLE POINT. The first charter for
 * this instrument was one, and it was blind to an entire entropy family (`hash01`, eight
 * draws across five modules) plus a display-surface `fnv1a32` picker. A census anchored on
 * the CONSUMER under-reports by construction. This one ANCHORS ON THE READ — every site in
 * `src` that takes `rngSeed` off a world-shaped object, whatever the receiving variable is
 * called — and follows the value to its consumer.
 *
 * TWO SHRINK-ONLY BASELINES, NOT ONE:
 *   A. the COMPOSITIONS — the draw keys built from a world root (§`COMPOSITIONS`);
 *   B. the READ SITES — where the value is taken off state (§`READ_SITES`).
 * They are different numbers and the second is the one that rotted: a revision that froze
 * only A reproduced its count exactly while THREE read sites feeding its own rows went
 * missing. Both are exact-set equalities. A NEW composition or a NEW read landing
 * unclassified REDS, and the fix is a disposition row plus a chair ruling — never a bump.
 *
 * ⛔ THE ROSTERS ARE KEYED BY (file, ordered occurrence), NEVER BY LINE. Line numbers churn
 * under every unrelated edit; the text of a draw key does not. Two identical texts in one
 * file are two list members, which is why the comparison is an ordered array rather than a
 * set.
 *
 * KNOWN EDGES (line-scan heuristic, reviewed):
 *   - Comment and JSDoc lines are skipped by a leading-token test (`//`, `/*`, `*`). A read
 *     spelled inside a trailing comment on a code line therefore still counts; that is the
 *     safe direction (a false positive costs one roster row, a miss costs the census).
 *   - A read split across two physical lines is invisible. None exists at the freeze, and
 *     the composition half would catch the consequence.
 *   - `asObject(x).rngSeed` is unwrapped; other wrappers are not. A new wrapper idiom reds
 *     the roster rather than passing silently, because the site's text changes.
 *
 * CLOSURE RECORD — every figure carries the exact command that reproduces it, because a
 * closure record that reds on re-run defeats its own purpose. Verified below, executed.
 *
 * @enforced-by this test
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, test, expect } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** World-shaped receivers, closed. `a`, `intent`, `home` and every other receiver is NOT one
 *  — that discrimination is what the negative controls exist to prove. */
const WORLD_ROOTS = Object.freeze(['worldState', 'startingWorldState', 'state', 'ws', 'raw', 'base']);

/** A `.rngSeed` / `?.rngSeed` property read, with `asObject(...)` unwrapped and the receiver
 *  captured. The leading class excludes an identifier character so `myRngSeed` cannot match. */
const READ_RE = /(?:^|[^A-Za-z0-9_$])(?:asObject\(\s*)?([A-Za-z_$][A-Za-z0-9_$]*)\s*\)?\s*\??\.\s*rngSeed/g;
/** An object-literal `rngSeed:` KEY. `rngSeed?:` (a type annotation) is excluded by the `?`. */
const WRITE_KEY_RE = /(?:^|[^A-Za-z0-9_$?])rngSeed\s*:/;
const COMMENT_LINE = /^\s*(?:\/\/|\/\*|\*)/;
const TEMPLATE_RE = /`([^`]*)`/g;

/** The THREE entropy consumers this estate has. A key reaching a fourth is a STOP. */
const ENTROPY_CONSUMERS = Object.freeze(['createPRNG', 'hash01', 'fnv1a32']);

/** The closed classification set. A row outside it cannot be dispositioned, so it reds. */
const CLASSES = Object.freeze(['TICK-VARYING', 'YEAR-KEYED', 'TICK-FREE', 'DISPLAY', 'OUT-OF-DENOMINATOR', 'SEAM', 'DERIVED']);

// ── THE DETECTORS ────────────────────────────────────────────────────────────────────────
// Every one takes (relPath, text) so a CONTROL can run the real detector over a fixture.
// A control that re-implements the detector proves nothing about the detector.

/** @returns {Array<{ file: string, text: string, roots: string[] }>} */
function readSitesIn(file, text) {
  const out = [];
  text.split('\n').forEach((line) => {
    if (COMMENT_LINE.test(line)) return;
    const roots = [...new Set([...line.matchAll(READ_RE)].map((m) => m[1]).filter((r) => WORLD_ROOTS.includes(r)))];
    if (roots.length) out.push({ file, text: line.trim(), roots });
  });
  return out;
}

/** An `rngSeed:` key whose VALUE is not a world read — the writer class and its impostors. */
function writeKeySitesIn(file, text) {
  const out = [];
  text.split('\n').forEach((line) => {
    if (COMMENT_LINE.test(line)) return;
    if (WRITE_KEY_RE.test(line) && !readSitesIn(file, line).length) out.push({ file, text: line.trim() });
  });
  return out;
}

/** @returns {Array<{ file: string, body: string, consumer: string }>} */
function compositionsIn(file, text, idents) {
  const out = [];
  text.split('\n').forEach((line) => {
    if (COMMENT_LINE.test(line)) return;
    for (const m of line.matchAll(TEMPLATE_RE)) {
      const slots = [...m[1].matchAll(/\$\{([^}]*)\}/g)].map((s) => s[1]);
      if (!idents.some((id) => slots.some((s) => s.includes(id)))) continue;
      const before = line.slice(0, m.index);
      const call = /([A-Za-z_$][A-Za-z0-9_$]*)\($/.exec(before.trimEnd());
      out.push({ file, body: m[1], consumer: call ? call[1] : 'DEFERRED' });
    }
  });
  return out;
}

/** Every .js/.jsx under src/, repo-relative. */
function sourceFiles(dir = SRC, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) sourceFiles(abs, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(relative(ROOT, abs).replace(/\\/g, '/'));
  }
  return out;
}

/** Fail-closed: an unreadable or empty source must throw, never report a clean scan. */
function read(rel) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  if (!text.trim()) throw new Error(`${rel} is empty — every census below would be vacuous`);
  return text;
}

const ALL_FILES = sourceFiles();

// ── BASELINE B — THE TWENTY-TWO READ SITES ───────────────────────────────────────────────
/** [id, file, coercion-and-absent-behaviour, feeds, disposition]. The `text` column is the
 *  LIVE source line, so a re-spelling reds here rather than rotting silently. */
const READ_SITES = Object.freeze([
  ['RS-17', 'src/components/map/CauseWalkPanel.jsx', '?? rootId', 'row 25', 'DISPLAY'],
  ['RS-16', 'src/domain/townMap/mapDress.js', 'null, AND THE CALL IS SUPPRESSED', 'row 1 at view time', 'DISPLAY'],
  ['RS-7', 'src/domain/traditions/politics.js', "String(x || '') ⇒ ''", 'rows 7 and 9', 'YEAR-KEYED'],
  ['RS-8', 'src/domain/traditions/relations.js', "String(asObject(x).rngSeed || '') ⇒ ''", 'row 8', 'YEAR-KEYED'],
  ['RS-10', 'src/domain/worldPulse/demographicsKernel.js', "typeof-guarded ⇒ 'realm'", 'row 22 upstream', 'TICK-VARYING'],
  ['RS-11', 'src/domain/worldPulse/demographicsPlans.js', "⇒ 'realm', realmId SHADOWING", 'rows 22, 23', 'TICK-VARYING'],
  ['RS-3', 'src/domain/worldPulse/generosityKernel.js', "String(x ?? '') ⇒ ''; 0 ⇒ '0'", 'row 13', 'YEAR-KEYED'],
  ['RS-9', 'src/domain/worldPulse/npcLadderKernel.js', "String(asObject(x).rngSeed || '') ⇒ ''", 'rows 17,18,19,21 AND row 20', 'TICK-VARYING'],
  ['RS-1', 'src/domain/worldPulse/pulseKernel.js', 'none (raw interpolation)', 'THE PULSE ROOT', 'SEAM'],
  ['RS-2', 'src/domain/worldPulse/pulseKernel.js', 'NONE — raw property read ⇒ "undefined"', 'row 1, in-pulse', 'YEAR-KEYED'],
  ['RS-13', 'src/domain/worldPulse/realmVerbExecution.js', "String(x ?? 'realm')", 'row 14', 'TICK-VARYING'],
  ['RS-14', 'src/domain/worldPulse/realmVerbExecution.js', "String(x ?? 'realm')", 'row 15', 'TICK-VARYING'],
  ['RS-15', 'src/domain/worldPulse/realmVerbExecution.js', "String(x ?? 'realm')", 'row 16', 'TICK-FREE'],
  ['RS-5', 'src/domain/worldPulse/roadsKernel.js', "str ⇒ ''", 'rows 2,3,4,5 + 10,11,12 by hand-off', 'TICK-VARYING'],
  ['RS-12', 'src/domain/worldPulse/sovereigntyMarketStage.js', "text(x) || 'realm'", 'row 24', 'TICK-VARYING'],
  ['RS-4', 'src/domain/worldPulse/traditionsKernel.js', "String(x || '') ⇒ ''", 'row 1, second composer', 'YEAR-KEYED'],
  ['RS-6', 'src/domain/worldPulse/traditionsKernel.js', "String(x || '') ⇒ ''", 'row 6', 'YEAR-KEYED'],
  ['RS-18', 'src/domain/worldPulse/worldState.js', 'n/a — THE ONE WRITER', 'the root itself', 'OUT-OF-DENOMINATOR'],
  ['RS-19', 'src/domain/worldPulse/worldState.js', '|| fallback to the fresh default', 'the load normalizer', 'OUT-OF-DENOMINATOR'],
  ['RS-21', 'src/lib/crashForensics.js', 'none', 'a forensics label — NOT A DRAW', 'OUT-OF-DENOMINATOR'],
  ['RS-20', 'src/lib/surveyorAutonomy.js', "String(x ?? '') ⇒ ''", 'a receipt field — NOT A DRAW', 'OUT-OF-DENOMINATOR'],
  ['RS-22', 'src/store/campaignContentBindingSession.js', 'third term of a fallback chain', 'a preview fixture seed', 'OUT-OF-DENOMINATOR'],
]);

/** RS-18 is the WRITER: it mints the root and reads nothing, so the read detector cannot see
 *  it. It is found by the write-key detector instead, together with the impostors and
 *  hand-offs that spell the same KEY off a value that is not a world root. EXACT SET — a
 *  second writer is the single most dangerous thing this file can be asked to notice.
 *  ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE B, AND THE NEW ROW IS A CONSEQUENCE OF A RE-ROOT
 *  RATHER THAN A NEW SITE. Seam edit 8 replaces `rngSeed: startingWorldState.rngSeed,` with
 *  `rngSeed: seasonSeed,` — so that ONE line stops being a READ (the read moved up to seam
 *  edit 7, which is why the read-site census is unmoved at twenty-two) and starts being an
 *  object-literal key fed by an already-classified value. That is the DERIVED class the
 *  composition roster already carries for the realm-verb rows, seen from the write side; it
 *  is neither a writer nor an impostor, and it is listed so the exact-set equality keeps
 *  holding for a reason rather than by a widened detector. */
const WRITE_KEY_SITES = Object.freeze([
  ['NC-2', 'src/domain/ai/personaSlicer.js', 'a settlement `_seed` — WEAK control, zero src importers'],
  ['RS-2h', 'src/domain/worldPulse/pulseKernel.js', 'seam edit 8 — RS-2 HANDED OFF, the year-anchored value reaching row 1'],
  ['RS-18', 'src/domain/worldPulse/worldState.js', 'THE ONE WRITER — createDefaultWorldState mints the root'],
  ['NC-1', 'src/generators/power/economyReconciliation.js', 'a generator STEP-RNG fork seed — the MANDATORY control'],
]);

// ── BASELINE A — THE COMPOSITIONS ────────────────────────────────────────────────────────
/** Per-module seed-bearing identifiers as they appear inside a template slot. BOUND idents
 *  are verified against the read sites below; PARAM and HAND-OFF idents arrive across a call
 *  boundary and are verified by the hand-off anchors. */
const SEED_IDENTS = Object.freeze({
  'src/domain/display/discourseKernel.js': ['seedId'],
  'src/domain/roads/seaRoads.js': ['a.rngSeed'],
  'src/domain/roads/thirdPartyRansom.js': ['a.rngSeed'],
  'src/domain/spatial/intelActs.js': ['rngSeed'],
  'src/domain/traditions/politics.js': ['rngSeed'],
  'src/domain/traditions/relations.js': ['rngSeed'],
  'src/domain/worldPulse/demographicsPlans.js': ['realm'],
  'src/domain/worldPulse/demographicsResponses.js': ['input.realmId'],
  'src/domain/worldPulse/npcLadderChallenge.js': ['seed'],
  // ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE B: `supportSeed` is row 20's own year-anchored
  // receiver and must be DECLARED, because the ident match is a case-sensitive substring
  // test — `supportSeed` does not contain `seed`. A lane that renamed the receiver without
  // declaring it here would delete row 20 from the measured set and red the roster, which
  // is the census working; a lane that had named it `supportseed` would have passed by
  // accident of spelling, which is why the declaration is explicit rather than incidental.
  'src/domain/worldPulse/npcLadderContest.js': ['seed', 'supportSeed'],
  'src/domain/worldPulse/pulseKernel.js': ['startingWorldState.rngSeed'],
  'src/domain/worldPulse/realmVerbExecution.js': ['state.rngSeed', 'seed'],
  // ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE B: `yearSeed` is a NEW RECEIVING NAME, declared
  // rather than smuggled. RS-5 is a SPLIT READ — its tick-anchored `rngSeed` still feeds
  // rows 2/4 (and 10/11/12 by hand-down) while rows 3 and 5 are YEAR-KEYED and take the
  // year anchor — so the module composes off TWO identifiers and the census must know both
  // names or it silently stops seeing two of this file's four compositions.
  'src/domain/worldPulse/roadsKernel.js': ['rngSeed', 'yearSeed'],
  'src/domain/worldPulse/seasons.js': ['rngSeed'],
  'src/domain/worldPulse/sovereigntyMarketStage.js': ['realmId'],
  'src/domain/worldPulse/traditionsKernel.js': ['asObject(worldState).rngSeed'],
});

/** [row, file, template body, consumer, class]. THIRTY entries: the TWENTY-FIVE dispositioned
 *  root compositions, the ONE pulse SEAM (which is not one of the twenty-five — the twenty-five
 *  are the compositions that never touch the pulse `rng`), and FOUR realm-verb DERIVATIONS
 *  built from an already-classified seed rather than from a fresh world read. */
const COMPOSITIONS = Object.freeze([
  ['25', 'src/domain/display/discourseKernel.js', "${String(seedId ?? '')}::${key}", 'fnv1a32', 'DISPLAY'],
  ['12', 'src/domain/roads/seaRoads.js', '${a.rngSeed}::roads-sea:storm:${String(a.m.id)}:${a.now2}', 'createPRNG', 'TICK-VARYING'],
  ['10', 'src/domain/roads/thirdPartyRansom.js', '${a.rngSeed}::roads-ransom3p:refuse:${ransomId}', 'createPRNG', 'TICK-VARYING'],
  ['11', 'src/domain/roads/thirdPartyRansom.js', '${a.rngSeed}::roads-ransom3p:outcome:${ransomId}', 'createPRNG', 'TICK-VARYING'],
  ['13', 'src/domain/spatial/intelActs.js', '${String(rngSeed)}::intel-trade:${x}:${y}:${year}', 'createPRNG', 'YEAR-KEYED'],
  ['7', 'src/domain/traditions/politics.js', '${rngSeed}::tradition:claim:${String(asObject(rec).id)}:${year}', 'createPRNG', 'YEAR-KEYED'],
  ['9', 'src/domain/traditions/politics.js', '${rngSeed}::tradition:reexpress:${String(asObject(rec).id)}:${year}:${mutation.kind}', 'DEFERRED', 'YEAR-KEYED'],
  ['8', 'src/domain/traditions/relations.js', '${rngSeed}::tradition:impose:${sid}:${year}', 'createPRNG', 'YEAR-KEYED'],
  ['22', 'src/domain/worldPulse/demographicsPlans.js', 'demographics.plan.${realm}.${settlementId}.${episode}.site', 'hash01', 'TICK-VARYING'],
  ['23', 'src/domain/worldPulse/demographicsResponses.js', 'demographics.plan.${input.realmId}.${input.settlementId}.${input.episode}.${entry.response}', 'DEFERRED', 'TICK-VARYING'],
  ['21', 'src/domain/worldPulse/npcLadderChallenge.js', '${seed}|${tick}|ladder|${fkey}|${cNid}|${dNid}', 'hash01', 'TICK-VARYING'],
  ['17', 'src/domain/worldPulse/npcLadderContest.js', '${seed}|ladder-contest:aware:${contestId}:${side.nid}:${tick}', 'DEFERRED', 'TICK-VARYING'],
  ['18', 'src/domain/worldPulse/npcLadderContest.js', '${seed}|ladder-contest:bluff:${contestId}:${rival.nid}:${weeks}', 'hash01', 'TICK-VARYING'],
  ['19', 'src/domain/worldPulse/npcLadderContest.js', '${seed}|ladder-contest:resolve:${contest.id}', 'hash01', 'TICK-VARYING'],
  // ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE B — RS-9's SPLIT READ, CLOSED. Row 20 is the
  // ONE year-keyed draw in this module and now reads `supportSeed`, a SECOND value the
  // kernel composes off the year anchor; rows 17/18/19 keep the tick-anchored `seed`. That
  // this row's text moved while its three siblings' did not IS the receipt that the split
  // was honoured rather than papered over with one re-point.
  ['20', 'src/domain/worldPulse/npcLadderContest.js', '${supportSeed}|ladder-support:${sid}:${nid}:${year}', 'hash01', 'YEAR-KEYED'],
  // ⭐ RE-RECORDED 2026-08-16 BY EP-1, AND THIS ROW IS THE ONE THE PROGRAM EXISTS TO MOVE.
  // The composition COUNT did not change — this file still composes exactly ONE root, and
  // the estate's total is unmoved. What changed is this row's TEXT: the seam appends
  // `${epochSuffix(epochTerm)}`, which is the whole advance-epoch mechanism. The census
  // caught it by exact text rather than by count, which is precisely why the baseline is
  // spelled as an ordered roster of expressions and not as a number.
  // ⛔ THE SHRINK-ONLY LAW IS UNTOUCHED: a composition APPEARING or VANISHING is still a
  // build STOP. An EDIT to a dispositioned row is the sanctioned case, and it is lawful
  // only when the member that made it is the member the disposition names — here, SEAM.
  ['SEAM', 'src/domain/worldPulse/pulseKernel.js', '${startingWorldState.rngSeed}::tick:${startingWorldState.tick + 1}::${tickInterval}${epochSuffix(epochTerm)}', 'createPRNG', 'SEAM'],
  // ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE A, AND THESE THREE ARE ROWS THE PROGRAM EXISTS
  // TO MOVE. The composition COUNT did not change and neither did any consumer: what
  // changed is each row's TEXT, because the site's seed expression is now WRAPPED by
  // `tickStreamSeedOf(state, { base: <the same expression, unmoved> })`. That the original
  // coercion is still visible verbatim INSIDE the new body is the point — §3b.3's
  // byte-verbatim rule is satisfied structurally rather than by transcription, and the
  // census still sees `state.rngSeed` in the slot, so the read site is not lost either.
  // ⛔ THE SHRINK-ONLY LAW IS UNTOUCHED: a composition APPEARING or VANISHING is still a
  // build STOP. An EDIT to a dispositioned row is the sanctioned case, and it is lawful
  // only when the member that made it is the member the disposition names — here, the
  // TICK-VARYING and TICK-FREE rows, which are exactly what slice A re-roots.
  ['14', 'src/domain/worldPulse/realmVerbExecution.js', "${tickStreamSeedOf(state, { base: String(state.rngSeed ?? 'realm') })}:realm_verb:${nowTick}", 'DEFERRED', 'TICK-VARYING'],
  ['14d', 'src/domain/worldPulse/realmVerbExecution.js', '${seed}:${k}', 'createPRNG', 'DERIVED'],
  ['14e', 'src/domain/worldPulse/realmVerbExecution.js', '${seed}:exodus', 'createPRNG', 'DERIVED'],
  ['15', 'src/domain/worldPulse/realmVerbExecution.js', "${tickStreamSeedOf(state, { base: String(state.rngSeed ?? 'realm') })}:realm_verb:${nowTick}", 'DEFERRED', 'TICK-VARYING'],
  ['15d', 'src/domain/worldPulse/realmVerbExecution.js', '${seed}:${k}', 'createPRNG', 'DERIVED'],
  ['16', 'src/domain/worldPulse/realmVerbExecution.js', "${tickStreamSeedOf(state, { base: String(state.rngSeed ?? 'realm') })}:realm_verb", 'DEFERRED', 'TICK-FREE'],
  ['16d', 'src/domain/worldPulse/realmVerbExecution.js', '${seed}:${k}', 'createPRNG', 'DERIVED'],
  ['2', 'src/domain/worldPulse/roadsKernel.js', '${rngSeed}::roads-hazard:${mid}:${now2}', 'createPRNG', 'TICK-VARYING'],
  ['3', 'src/domain/worldPulse/roadsKernel.js', '${yearSeed}::roads:cadence:${npcKey}:${year}', 'createPRNG', 'YEAR-KEYED'],
  ['4', 'src/domain/worldPulse/roadsKernel.js', '${rngSeed}::roads-genesis:${sid}:${now2}', 'createPRNG', 'TICK-VARYING'],
  ['5', 'src/domain/worldPulse/roadsKernel.js', '${yearSeed}::roads:stay:${sid}:${c.npcKey}:${year}', 'createPRNG', 'YEAR-KEYED'],
  ['1', 'src/domain/worldPulse/seasons.js', '${rngSeed}::season:${year}:${String(settlementId)}', 'createPRNG', 'YEAR-KEYED'],
  ['24', 'src/domain/worldPulse/sovereigntyMarketStage.js', 'sovereignty.offer.${realmId}.${sellerId}.${buyerId}.${assetId}.${episode}', 'DEFERRED', 'TICK-VARYING'],
  ['6', 'src/domain/worldPulse/traditionsKernel.js', "${yearStreamSeedOf(worldState, year, { base: String(asObject(worldState).rngSeed || ''), yearBase: 1 })}::tradition:${rec.id}:${year}", 'createPRNG', 'YEAR-KEYED'],
]);

/** Where a DEFERRED composition's key actually reaches an entropy idiom. Each anchor is a
 *  source substring, so the hand-off is VERIFIED rather than asserted in prose. */
const DEFERRED_ANCHORS = Object.freeze([
  ['src/domain/traditions/politics.js', 'export function reexpressed(rec, seedKey)'],
  ['src/domain/worldPulse/demographicsResponses.js', 'const u = hash01('],
  ['src/domain/worldPulse/npcLadderContest.js', 'if (hash01(label) >='],
  ['src/domain/worldPulse/realmVerbExecution.js', 'const forkFn = '],
  ['src/domain/worldPulse/sovereigntyMarketStage.js', 'hash01('],
]);

/** The cross-module hand-offs that carry a root seed into a module that never reads state.
 *  [source file, anchor proving the hand-off exists, receiving module]. */
const HAND_OFFS = Object.freeze([
  // ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE B (three anchors in this table moved, all for
  // the same reason): the hand-off now carries the YEAR-ANCHORED value, and each anchor
  // keeps the site's ORIGINAL expression verbatim INSIDE the accessor call, so a retyped
  // coercion still reds here. RS-2's anchor is seam edit 7's line — the read moved there
  // when edit 8 took `seasonSeed`, which is the whole shape of the +0-line seam.
  ['src/domain/worldPulse/pulseKernel.js', 'yearStreamSeedOf(worldState, seasonClock.year, { base: startingWorldState.rngSeed, yearBase: 1 })', 'src/domain/worldPulse/seasons.js'],
  ['src/domain/worldPulse/traditionsKernel.js', "seasonalSeverityFor(yearStreamSeedOf(worldState, year, { base: String(asObject(worldState).rngSeed || ''), yearBase: 1 })", 'src/domain/worldPulse/seasons.js'],
  ['src/domain/townMap/mapDress.js', 'seasonalSeverityFor(yearStreamSeedOf(worldState, year, { base: rngSeed, yearBase: 1 }), year, settlementId)', 'src/domain/worldPulse/seasons.js'],
  ['src/domain/worldPulse/generosityKernel.js', 'intelEligible(intelSeed', 'src/domain/spatial/intelActs.js'],
  ['src/domain/worldPulse/roadsKernel.js', 'rngSeed, now2, idSet', 'src/domain/roads/seaRoads.js'],
  // ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE A: RS-9's read is now wrapped by the family-1
  // accessor. The anchor keeps its ORIGINAL coercion verbatim inside the new call, so this
  // row still proves the same hand-off and would still red if the coercion were retyped.
  ['src/domain/worldPulse/npcLadderKernel.js', "tickStreamSeedOf(worldState, { base: String(asObject(worldState).rngSeed || '') })", 'src/domain/worldPulse/npcLadderContest.js'],
  // ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE A, the same wrap as RS-9's row: the anchor keeps
  // the site's TYPEOF-STRING coercion verbatim inside the accessor call, so a retyped
  // coercion (which would silently change what a NUMERIC seed renders) still reds here.
  ['src/domain/worldPulse/demographicsKernel.js', "base: typeof asObject(worldState).rngSeed === 'string'", 'src/domain/worldPulse/demographicsPlans.js'],
  ['src/components/map/CauseWalkPanel.jsx', 'seedId: worldState?.rngSeed ?? rootId', 'src/domain/display/discourseKernel.js'],
]);

// ── THE MEASUREMENTS ─────────────────────────────────────────────────────────────────────

/** file → ordered read-site source lines, measured. */
function measuredReads() {
  const by = {};
  for (const f of ALL_FILES) {
    const sites = readSitesIn(f, read(f));
    if (sites.length) by[f] = sites.map((s) => s.text);
  }
  return by;
}

/** file → ordered composition bodies, measured over the declared seed identifiers. */
function measuredCompositions() {
  const by = {};
  for (const [f, idents] of Object.entries(SEED_IDENTS)) {
    const found = compositionsIn(f, read(f), idents);
    if (found.length) by[f] = found;
  }
  return by;
}

/** roster → file → ordered column values. */
function rosterBy(rows, col) {
  const by = {};
  for (const row of rows) (by[row[1]] ||= []).push(row[col]);
  return by;
}

describe('EP-0 · baseline B — the read-site census', () => {
  test('the roster is exactly the twenty-two dispositioned sites', () => {
    expect(READ_SITES).toHaveLength(22);
    expect(new Set(READ_SITES.map((r) => r[0])).size).toBe(22);
  });

  test('every measured read site has a disposition row, counted PER MODULE', () => {
    const measured = Object.fromEntries(Object.entries(measuredReads()).map(([f, xs]) => [f, xs.length]));
    // RS-18 is a WRITE — it mints the root and reads nothing — so it is excluded here and
    // asserted by the write-key roster instead. A per-module COUNT rather than a file set:
    // a new read inside an already-censused module is exactly the shape a set comparison
    // cannot see, and it is the shape three missed reads actually took.
    const roster = {};
    for (const [id, file] of READ_SITES) if (id !== 'RS-18') roster[file] = (roster[file] || 0) + 1;
    expect(
      measured,
      'A module gained or lost a world-shaped rngSeed read. A read site with no disposition'
      + ' row is a build STOP: add the row with its coercion and its family, or (if a site'
      + ' went away) bank the shrink by removing it. Never widen the detector to pass.',
    ).toEqual(roster);
  });

  test('the read count is exactly twenty-two, counting the writer once', () => {
    const reads = Object.values(measuredReads()).reduce((n, xs) => n + xs.length, 0);
    // 21 readable sites + RS-18, the writer, which mints the root and reads nothing.
    expect(reads, 'measured read expressions').toBe(21);
    expect(reads + 1).toBe(READ_SITES.length);
  });

  test('every disposition is drawn from the closed class set', () => {
    for (const [id, , , , cls] of READ_SITES) expect(CLASSES, `${id}`).toContain(cls);
  });
});

// ── THE CLASSIFICATION GATE — EP-3 slice A ───────────────────────────────────────────────
/** The family-1 accessor, and the number of times each re-rooted module must call it.
 *  [id(s), file, calls]. The counts are the compositions' READ SITES, not the compositions:
 *  RS-5 feeds five rows through one read and RS-9 feeds four through one, which is why this
 *  roster is shorter than the disposition table it gates. */
const LEDGER_LEAF = 'src/domain/advanceEpochLedger.js';
const FAMILY_1_ACCESSOR = 'tickStreamSeedOf(';
const FAMILY_1_REROOTS = Object.freeze([
  ['RS-5', 'src/domain/worldPulse/roadsKernel.js', 1],
  ['RS-9', 'src/domain/worldPulse/npcLadderKernel.js', 1],
  ['RS-10', 'src/domain/worldPulse/demographicsKernel.js', 1],
  ['RS-11', 'src/domain/worldPulse/demographicsPlans.js', 1],
  ['RS-12', 'src/domain/worldPulse/sovereigntyMarketStage.js', 1],
  ['RS-13/14/15', 'src/domain/worldPulse/realmVerbExecution.js', 3],
]);

/** Non-import, non-comment call sites of a symbol in a file. */
function callSitesIn(text, symbol) {
  return text.split('\n')
    .filter((line) => !COMMENT_LINE.test(line) && !/^\s*import\b/.test(line) && line.includes(symbol))
    .length;
}

describe('EP-3A · the classification gate — every TICK-anchored read is re-rooted', () => {
  // ⛔ THIS IS THE ARM THAT CATCHES A SILENTLY DROPPED RE-ROOT, and nothing else in the
  // estate can: a site that stopped calling the accessor still composes a perfectly valid
  // draw key, still passes every behaviour test, and is simply epoch-blind forever. The
  // gate is the CENSUS's because the census is the only instrument that knows the whole
  // denominator — which is also why the walker is EP-0's and not EP-3's.
  test('the re-root roster IS the TICK-VARYING + TICK-FREE half of the read-site census', () => {
    const anchored = READ_SITES
      .filter(([, , , , cls]) => cls === 'TICK-VARYING' || cls === 'TICK-FREE')
      .map(([, file]) => file);
    // Per-module ROW counts, so a new tick-anchored read inside an already-re-rooted module
    // is caught too — the exact shape a file-set comparison cannot see.
    const byModule = {};
    for (const file of anchored) byModule[file] = (byModule[file] || 0) + 1;
    expect(
      byModule,
      'A TICK-VARYING or TICK-FREE read site appeared, vanished or moved module. Slice A'
      + ' re-roots exactly this set onto tickStreamSeedOf; a row here with no entry in'
      + ' FAMILY_1_REROOTS below draws epoch-blind forever and no behaviour test can see it.',
    ).toEqual(Object.fromEntries(FAMILY_1_REROOTS.map(([, file, calls]) => [file, calls])));
  });

  test('every re-rooted module actually calls the family-1 accessor, the counted number of times', () => {
    for (const [id, file, calls] of FAMILY_1_REROOTS) {
      expect(callSitesIn(read(file), FAMILY_1_ACCESSOR), `${id} — ${file}`).toBe(calls);
    }
    // NON-VACUITY: the counter can return zero, so the greens above are measurements.
    expect(callSitesIn('const s = somethingElse(worldState);', FAMILY_1_ACCESSOR)).toBe(0);
    // …and it does not count the import line or a mention in prose.
    expect(callSitesIn("import { tickStreamSeedOf } from '../advanceEpochLedger.js';", FAMILY_1_ACCESSOR)).toBe(0);
    expect(callSitesIn(' * a comment naming tickStreamSeedOf(worldState)', FAMILY_1_ACCESSOR)).toBe(0);
  });

  test('the TICK anchor reaches ONLY the tick-anchored roster, and the leaf exports both accessors', () => {
    // ⭐ RE-AIMED 2026-08-16 BY EP-3 SLICE B. Until slice B landed, this arm asserted that no
    // year-keyed module called ANY accessor and that the leaf exported no `yearStreamSeedOf`
    // — a statement about a boundary that has now moved, so it is re-aimed DELIBERATELY
    // rather than deleted. What it asserts now is the half that is still a real constraint:
    // no module outside the FAMILY_1 roster carries a TICK-anchored call. A year-keyed site
    // re-rooted onto the tick anchor by mistake would draw a DIFFERENT key on every tick of
    // a lived year — the exact inversion of the feature — and reds here.
    const tickCallers = ALL_FILES
      .filter((f) => f !== LEDGER_LEAF && callSitesIn(read(f), FAMILY_1_ACCESSOR) > 0)
      .sort();
    expect(tickCallers, 'a module outside the tick roster composes off the TICK anchor')
      .toEqual(FAMILY_1_REROOTS.map(([, file]) => file).sort());
    // And the leaf now exports BOTH — slice B's boundary crossed, asserted so the arrival is
    // a recorded event rather than something a reader assumes was always there.
    const leaf = read(LEDGER_LEAF);
    expect(leaf).toContain('export function tickStreamSeedOf');
    expect(leaf).toContain('export function yearStreamSeedOf');
  });
});

// ── THE CLASSIFICATION GATE — EP-3 slice B ───────────────────────────────────────────────
/** The family-2 accessor, and the number of times each re-rooted module must call it.
 *  [id(s), file, calls]. The NINE year-keyed compositions live at EIGHT read sites PLUS
 *  RS-9's second argument, so this roster is shorter than nine and its counts are line
 *  counts, not composition counts. ⚠ TWO MODULES APPEAR IN BOTH ROSTERS AND THAT IS THE
 *  POINT: `roadsKernel.js` and `npcLadderKernel.js` are SPLIT READS whose one read feeds
 *  both families, so each carries a tick-anchored binding AND a separately-named
 *  year-anchored one. A lane that re-pointed either single binding would satisfy one family
 *  by breaking the other, and only a roster that names both catches it. */
const FAMILY_2_ACCESSOR = 'yearStreamSeedOf(';
const FAMILY_2_REROOTS = Object.freeze([
  ['RS-16', 'src/domain/townMap/mapDress.js', 1],
  ['RS-7', 'src/domain/traditions/politics.js', 1],
  ['RS-8', 'src/domain/traditions/relations.js', 1],
  ['RS-3', 'src/domain/worldPulse/generosityKernel.js', 1],
  ['RS-9 (second argument)', 'src/domain/worldPulse/npcLadderKernel.js', 1],
  ['RS-2', 'src/domain/worldPulse/pulseKernel.js', 1],
  ['RS-5 (second binding)', 'src/domain/worldPulse/roadsKernel.js', 1],
  ['RS-4 + RS-6', 'src/domain/worldPulse/traditionsKernel.js', 2],
]);

/** The three directories the DISPLAY-SURFACE RULE governs, and the one line allowed to name
 *  the ledger inside them. A display surface may READ the epoch through the leaf accessor and
 *  may NOT reach into `spatialLedgers.advanceEpoch` or compose an epoch segment of its own. */
const DISPLAY_DIRS = Object.freeze(['src/components/', 'src/domain/display/', 'src/domain/townMap/']);
const SANCTIONED_DISPLAY_LINE = "import { yearStreamSeedOf } from '../advanceEpochLedger.js';";

/** Non-import, non-comment call lines of a symbol that DO NOT spell `yearBase:`. */
function callsMissingYearBase(text, symbol) {
  return text.split('\n')
    .map((line) => line.trim())
    .filter((line) => !COMMENT_LINE.test(line) && !/^import\b/.test(line) && line.includes(symbol))
    .filter((line) => !/\byearBase\s*:/.test(line));
}

describe('EP-3B · the classification gate — every YEAR-anchored read is re-rooted', () => {
  test('every YEAR-KEYED composition is fed by a module in the family-2 roster', () => {
    // ⛔ THE ARM THAT CATCHES A YEAR-KEYED DRAW LEFT EPOCH-BLIND, and no behaviour test can:
    // an epoch-blind draw is a perfectly valid draw. A year-keyed composition lives in one of
    // two places — the module that READ the seed, or a module the seed was HANDED to — so the
    // roster is checked against the union, resolved through the hand-off table rather than
    // asserted in prose. Four of the seven composing modules never read state at all.
    const composing = [...new Set(COMPOSITIONS
      .filter(([, , , , cls]) => cls === 'YEAR-KEYED')
      .map(([, file]) => file))].sort();
    expect(composing.length, 'the year-keyed composition set is non-empty').toBeGreaterThan(0);
    const rostered = new Set(FAMILY_2_REROOTS.map(([, file]) => file));
    const fedByRoster = new Set(HAND_OFFS.filter(([from]) => rostered.has(from)).map(([, , to]) => to));
    expect(
      composing.filter((file) => !rostered.has(file) && !fedByRoster.has(file)),
      'a YEAR-KEYED composition is neither in a re-rooted module nor handed a value from one:'
      + ' it draws the SAME weather for every epoch, forever, and stays green everywhere else.',
    ).toEqual([]);
  });

  test('every re-rooted module calls the family-2 accessor, the counted number of times', () => {
    for (const [id, file, calls] of FAMILY_2_REROOTS) {
      expect(callSitesIn(read(file), FAMILY_2_ACCESSOR), `${id} — ${file}`).toBe(calls);
    }
    // NON-VACUITY: the counter can return zero, so the greens above are measurements.
    expect(callSitesIn('const s = somethingElse(worldState, year);', FAMILY_2_ACCESSOR)).toBe(0);
    // …and it counts neither the import line nor a mention in prose.
    expect(callSitesIn("import { yearStreamSeedOf } from '../advanceEpochLedger.js';", FAMILY_2_ACCESSOR)).toBe(0);
    expect(callSitesIn(' * a comment naming yearStreamSeedOf(worldState, year)', FAMILY_2_ACCESSOR)).toBe(0);
  });

  test('the YEAR anchor reaches ONLY the year roster — the vice-versa arm', () => {
    // The mirror of the tick arm above. A TICK-VARYING site re-rooted onto the YEAR anchor
    // would freeze a per-tick draw for a whole lived year, which is just as wrong and just as
    // invisible. ⚠ The leaf is excluded by NAME: it DEFINES both accessors, so a scan that
    // did not exclude its own home would report its definition as a call site forever.
    const yearCallers = ALL_FILES
      .filter((f) => f !== LEDGER_LEAF && callSitesIn(read(f), FAMILY_2_ACCESSOR) > 0)
      .sort();
    expect(yearCallers, 'a module outside the year roster composes off the YEAR anchor')
      .toEqual(FAMILY_2_REROOTS.map(([, file]) => file).sort());
    // The exclusion is a real one, not a spelling: the leaf DOES carry the symbol.
    expect(read(LEDGER_LEAF)).toContain(FAMILY_2_ACCESSOR);
  });

  test('J-EP-13 — every family-2 call declares its `yearBase`, and the detector can see a missing one', () => {
    // ⛔ THE DEFECT THIS FORECLOSES. Two of the nine sites name a lived year ONE LOWER than
    // the other seven (`floor(weeks / 52)`, no `+1`). A call that omitted `yearBase` would
    // read a key that is NEVER PRESENT: the accessor returns the bare root, the composition
    // still works, every dormancy pin stays green, and two of the nine draws are silently
    // epoch-blind forever. The argument is defaultless in the type system; this is the arm
    // that proves it is actually spelled at every live site.
    const missing = ALL_FILES
      .filter((f) => f !== LEDGER_LEAF)
      .flatMap((f) => callsMissingYearBase(read(f), FAMILY_2_ACCESSOR).map((line) => `${f} :: ${line}`));
    expect(missing, 'a family-2 call site omits `yearBase` — it will read a key that is never'
      + ' present and draw epoch-blind while every other pin stays green').toEqual([]);
    // NON-VACUITY, in both directions: the detector really does flag an omission…
    expect(callsMissingYearBase('const s = yearStreamSeedOf(worldState, year, { base: raw });', FAMILY_2_ACCESSOR))
      .toHaveLength(1);
    // …and really does pass a declaration, including the zero-based one.
    expect(callsMissingYearBase('const s = yearStreamSeedOf(w, y, { base: raw, yearBase: 0 });', FAMILY_2_ACCESSOR))
      .toEqual([]);
  });

  test('THE DISPLAY-SURFACE SOURCE PIN — `advanceEpoch` reaches the view only through the leaf import', () => {
    // ⛔ A display surface that reached into the ledger, or built its own epoch segment, would
    // dress a winter the simulation never ran — and it would do it silently, because a
    // plausible-looking severity is indistinguishable from the right one by eye. RS-16's
    // re-root necessarily puts the leaf's name inside townMap/, so the pin is not "no
    // mention" but "EXACTLY the sanctioned import line and nothing else".
    // ⚠ CODE LINES ONLY, on this file's own stated convention: a comment cannot reach the
    // ledger, and a trailing comment on a CODE line still counts — the safe direction.
    const offenders = ALL_FILES
      .filter((f) => DISPLAY_DIRS.some((dir) => f.startsWith(dir)))
      .flatMap((f) => read(f).split('\n')
        .map((line) => line.trim())
        .filter((line) => !COMMENT_LINE.test(line))
        .filter((line) => line.includes('advanceEpoch') && line !== SANCTIONED_DISPLAY_LINE)
        .map((line) => `${f} :: ${line}`));
    expect(offenders, 'a display surface names the advance-epoch ledger outside the one'
      + ' sanctioned accessor import: direct ledger reads and local composition are forbidden').toEqual([]);
    // NON-VACUITY: the sanctioned line really is present in exactly one display module, so
    // the empty list above is a discrimination and not an empty corpus.
    const sanctioned = ALL_FILES
      .filter((f) => DISPLAY_DIRS.some((dir) => f.startsWith(dir)))
      .filter((f) => read(f).includes(SANCTIONED_DISPLAY_LINE));
    expect(sanctioned).toEqual(['src/domain/townMap/mapDress.js']);
  });
});

describe('EP-0 · the writer roster and the negative controls', () => {
  test('exactly three `rngSeed:` write-keys exist, and only one is the world writer', () => {
    const measured = ALL_FILES.flatMap((f) => writeKeySitesIn(f, read(f))).map((s) => s.file).sort();
    expect(
      measured,
      'The set of object-literal `rngSeed:` keys whose value is NOT a world read changed.'
      + ' One of them is THE WRITER; the other two are entity-addressed impostors that must'
      + ' stay OUT-OF-DENOMINATOR. A NEW one is either a second writer (a STOP) or a new'
      + ' impostor needing a control row.',
    ).toEqual(WRITE_KEY_SITES.map((r) => r[1]).sort());
  });

  test('NC-1 (MANDATORY, LIVE) — a generator step-rng fork seed is not a world root', () => {
    const src = read('src/generators/power/economyReconciliation.js');
    // The exact syntactic shape of RS-2 — `rngSeed: <expr>` with no coercion — on a module
    // with three production importers, whose paired createPRNG also exercises the consumer
    // arm. It must NOT be classified as a read.
    expect(src).toContain('rngSeed: stepRng.fork(POWER_STREAM).seed,');
    expect(src).toContain('createPRNG(intent.rngSeed)');
    expect(readSitesIn('nc1.js', 'rngSeed: stepRng.fork(POWER_STREAM).seed,')).toEqual([]);
    expect(readSitesIn('nc1.js', 'const previousRng = setActiveRng(createPRNG(intent.rngSeed));')).toEqual([]);
  });

  test('NC-2 (WEAK, labelled) — a settlement `_seed` is not a world root', () => {
    // ⚠ WEAK BY MEASUREMENT, NOT BY OPINION: personaSlicer.js has ZERO importers in src, so
    // this control passes by ABSENCE rather than by discrimination. It is retained because
    // deleting a green assertion is a silently weakened pin, and labelled so no later auditor
    // mistakes it for the discriminating one. NC-1 is the control that must red.
    expect(readSitesIn('nc2.js', 'deps.season({ rngSeed: home?._seed, clock: worldState?.clock })')).toEqual([]);
  });
});

describe('EP-0 · the nine positive controls — one per measured read spelling', () => {
  // A detector that matches NOTHING exits zero. Each fixture is the real spelling from the
  // census, run through the REAL detector, and each must produce exactly one site.
  const SPELLINGS = Object.freeze([
    ['str(asObject(x).rngSeed)', 'const rngSeed = str(asObject(worldState).rngSeed);'],
    ["String(asObject(x).rngSeed || '')", "const seed = String(asObject(worldState).rngSeed || '');"],
    ["String(x.rngSeed || '')", "const rngSeed = String(worldState.rngSeed || '');"],
    ["String(x.rngSeed ?? 'realm')", "const seed = `${String(state.rngSeed ?? 'realm')}:realm_verb`;"],
    ["text(x.rngSeed) || 'realm'", "const realmId = text(worldState.rngSeed) || 'realm';"],
    ["String(realmId || asObject(x).rngSeed || 'realm')", "const realm = String(realmId || asObject(worldState).rngSeed || 'realm');"],
    ['typeof-guarded ternary', "realmId: typeof asObject(worldState).rngSeed === 'string' ? String(asObject(worldState).rngSeed) : 'realm',"],
    ['⭐ the ?? spelling (RS-3)', "const intelSeed = String(/** @type {{ rngSeed?: unknown }} */ (worldState)?.rngSeed ?? '');"],
    ['⭐ RAW UNCOERCED, ARGUMENT POSITION (RS-2)', 'rngSeed: startingWorldState.rngSeed,'],
  ]);

  test('all nine spellings are detected, and the ninth is the one that hid twice', () => {
    expect(SPELLINGS).toHaveLength(9);
    for (const [label, fixture] of SPELLINGS) {
      expect(readSitesIn('fixture.js', fixture), label).toHaveLength(1);
    }
  });

  test('the detector is not a `.rngSeed` matcher — the receiver decides', () => {
    // If it were, NC-1 would pass as a read and the whole census would be noise.
    expect(readSitesIn('f.js', 'const s = a.rngSeed;')).toEqual([]);
    expect(readSitesIn('f.js', 'const s = intent.rngSeed;')).toEqual([]);
    expect(readSitesIn('f.js', 'const s = myRngSeed;')).toEqual([]);
    expect(readSitesIn('f.js', ' * a comment naming worldState.rngSeed')).toEqual([]);
  });
});

describe('EP-0 · baseline A — the composition census', () => {
  const measured = measuredCompositions();

  test('every measured composition has a disposition row, in order, per module', () => {
    const measuredBodies = Object.fromEntries(
      Object.entries(measured).map(([f, xs]) => [f, xs.map((x) => x.body)]),
    );
    expect(
      measuredBodies,
      'A composition changed, appeared or vanished. A composition with no disposition row is'
      + ' a build STOP — the epoch program must rule it in or out of the denominator with a'
      + ' written rationale, and the baseline may only shrink.',
    ).toEqual(rosterBy(COMPOSITIONS, 2));
  });

  test('the denominator is TWENTY-FIVE roots across FIFTEEN modules, plus the seam and four derivations', () => {
    const roots = COMPOSITIONS.filter(([row]) => row !== 'SEAM' && !/d|e$/.test(row));
    expect(roots, 'the dispositioned root compositions').toHaveLength(25);
    expect(new Set(roots.map((r) => r[1])).size, 'modules composing a root').toBe(15);
    expect(COMPOSITIONS.filter(([, , , , c]) => c === 'DERIVED')).toHaveLength(4);
    expect(COMPOSITIONS.filter(([row]) => row === 'SEAM')).toHaveLength(1);
    // ⚠ THE VOLUME SAYS SIXTEEN MODULES AND THE MEASURED FIGURE IS FIFTEEN. The count of
    // COMPOSITIONS (25) reproduces exactly; the module figure is a restatement slip — the
    // sixteenth home is the pulse SEAM, which is explicitly NOT one of the twenty-five.
    // Corrected here under the volume's own rule that a summary disagreeing with its table
    // is a defect in the volume.
  });

  test('every composition reaches one of exactly three entropy consumers', () => {
    const measuredConsumers = Object.fromEntries(
      Object.entries(measured).map(([f, xs]) => [f, xs.map((x) => x.consumer)]),
    );
    expect(measuredConsumers, 'a consumer moved').toEqual(rosterBy(COMPOSITIONS, 3));
    for (const [row, , , consumer] of COMPOSITIONS) {
      expect(
        consumer === 'DEFERRED' || ENTROPY_CONSUMERS.includes(consumer),
        `row ${row} reaches \`${consumer}\` — a new entropy idiom joined the family.`
        + ' Classify it, then extend this walker; do not add it to the consumer list alone.',
      ).toBe(true);
    }
  });

  test("every DEFERRED key's real consumer is anchored in its own module", () => {
    const deferredFiles = [...new Set(COMPOSITIONS.filter(([, , , c]) => c === 'DEFERRED').map((r) => r[1]))].sort();
    expect(deferredFiles).toEqual(DEFERRED_ANCHORS.map((a) => a[0]).sort());
    for (const [file, anchor] of DEFERRED_ANCHORS) {
      expect(read(file), `${file} no longer carries its deferred-consumer anchor`).toContain(anchor);
    }
  });

  test('every cross-module hand-off is proven at its source, not asserted', () => {
    for (const [from, anchor, to] of HAND_OFFS) {
      expect(read(from), `${from} → ${to}`).toContain(anchor);
      expect(SEED_IDENTS[to] || READ_SITES.some((r) => r[1] === to), `${to} is a census module`).toBeTruthy();
    }
  });

  test('every composition class is drawn from the closed set', () => {
    for (const [row, , , , cls] of COMPOSITIONS) expect(CLASSES, `row ${row}`).toContain(cls);
  });
});

describe('EP-0 · the three executed mutants', () => {
  test('MUTANT 1 — a planted TWENTY-SIXTH composition REDS', () => {
    const planted = compositionsIn(
      'src/domain/worldPulse/roadsKernel.js',
      'const f = createPRNG(`${rngSeed}::roads:newdraw:${sid}:${now2}`);',
      SEED_IDENTS['src/domain/worldPulse/roadsKernel.js'],
    );
    expect(planted).toHaveLength(1);
    expect(rosterBy(COMPOSITIONS, 2)['src/domain/worldPulse/roadsKernel.js'])
      .not.toContain(planted[0].body); // anchored: the roster for this file is asserted non-empty on the next line
    expect(rosterBy(COMPOSITIONS, 2)['src/domain/worldPulse/roadsKernel.js']).toHaveLength(4);
  });

  test('MUTANT 2 — the plant lands in the `hash01` idiom specifically', () => {
    // A walker that only catches `createPRNG` is the exact failure the first charter shipped.
    const planted = compositionsIn(
      'src/domain/worldPulse/npcLadderContest.js',
      'const u = hash01(`${seed}|ladder-contest:newdraw:${contestId}`);',
      SEED_IDENTS['src/domain/worldPulse/npcLadderContest.js'],
    );
    expect(planted).toHaveLength(1);
    expect(planted[0].consumer).toBe('hash01');
    expect(rosterBy(COMPOSITIONS, 2)['src/domain/worldPulse/npcLadderContest.js'])
      .not.toContain(planted[0].body); // anchored: the same roster is asserted to hold its four live rows below
    expect(rosterBy(COMPOSITIONS, 2)['src/domain/worldPulse/npcLadderContest.js']).toHaveLength(4);
  });

  test('MUTANT 3 — a TWENTY-THIRD read site in the uncoerced argument-position spelling REDS', () => {
    // THE SPELLING THAT HID RS-2 FROM TWO ADVERSARIAL PASSES. A walker that cannot catch its
    // own historical blind spot is ceremony.
    const planted = readSitesIn('src/domain/worldPulse/someKernel.js', '  seasonalContextFor({ rngSeed: someWorld.rngSeed, clock });');
    expect(planted, 'a non-world receiver must not match').toHaveLength(0);
    const real = readSitesIn('src/domain/worldPulse/someKernel.js', '  seasonalContextFor({ rngSeed: worldState.rngSeed, clock });');
    expect(real, 'the world-shaped argument-position read MUST match').toHaveLength(1);
    const live = measuredReads()['src/domain/worldPulse/pulseKernel.js'];
    expect(live, 'pulseKernel still carries exactly its two reads').toHaveLength(2);
  });
});

describe('EP-0 · the closure record, re-run rather than transcribed', () => {
  // Each figure states the command that reproduces it. The volume published 68/37/TEN/31/"8";
  // the corrected, executable set is below and every one is asserted here.
  test('`rngSeed` LINES in src = 70 across 31 files', () => {
    // grep -rn "rngSeed" src --include="*.js" --include="*.jsx" | wc -l
    // ⚠ LINES, not occurrences. The per-OCCURRENCE count (grep -o) is higher, and quoting
    // one number under the other's label is how this figure was reported as "grown by 12"
    // when the tree had not moved at all.
    // ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE A: 68/30 → 70/31, and the delta decomposes
    // exactly with nothing left over. The 31st FILE is the new single-writer leaf
    // src/domain/advanceEpochLedger.js, and the +2 LINES are its own two prose mentions of
    // `worldState.rngSeed` — it names the thing it re-roots. NO RE-ROOTED SITE MOVED THIS
    // FIGURE: each of the eight wraps its existing expression on the SAME line, so the
    // seven read-bearing modules contribute exactly what they did before. That is why the
    // read-site census above is UNMOVED at twenty-two while this one grew by a leaf.
    // ⭐ RE-RECORDED 2026-08-16 BY EP-3 SLICE B: 70/31 → 73/31, and the delta decomposes
    // exactly with nothing left over. The FILE count is UNMOVED — slice B creates no module.
    // The +3 LINES, measured per file rather than inferred:
    //   pulseKernel.js      6 → 7   +1 — seam edit 7's line gains the read while edit 8's
    //                                    line keeps the KEY, so one line became two
    //   townMap/mapDress.js 6 → 8   +2 — two prose lines naming the `rngSeed &&` guard the
    //                                    display-surface re-root must leave standing
    //   traditions/politics 6 → 7   +1 — one prose line naming the identifier it re-roots
    //   roadsKernel.js      8 → 7   −1 — rows 3 and 5 stopped interpolating `rngSeed` and
    //                                    now read `yearSeed`; one prose line names it back
    // NOT ONE RE-ROOTED SITE MOVED THIS FIGURE BY ITSELF: each wraps its existing expression
    // on the SAME line, which is also why the read-site census above is unmoved at twenty-two.
    const hits = ALL_FILES.filter((f) => /rngSeed/.test(read(f)));
    const lines = ALL_FILES.reduce((n, f) => n + read(f).split('\n').filter((l) => l.includes('rngSeed')).length, 0);
    expect({ lines, files: hits.length }).toEqual({ lines: 73, files: 31 });
  });

  test('`createPRNG(` sites: 38 in src/domain, 48 whole-src; `generateSeed()` 9 hits / 6 call sites', () => {
    const count = (pred, re) => ALL_FILES.filter(pred)
      .reduce((n, f) => n + read(f).split('\n').filter((l) => re.test(l)).length, 0);
    expect(count((f) => f.startsWith('src/domain/'), /createPRNG\(/)).toBe(38);
    expect(count(() => true, /createPRNG\(/)).toBe(48);
    // ⚠ THE INSTRUCTIVE ONE: a bare hit count over a symbol that also appears in prose and in
    // its own definition over-reports by 60%. HITS and CALL SITES are recorded separately.
    const hits = ALL_FILES.reduce((n, f) => n + read(f).split('\n').filter((l) => l.includes('generateSeed()')).length, 0);
    const calls = ALL_FILES.reduce((n, f) => n + read(f).split('\n')
      .filter((l) => l.includes('generateSeed()') && !COMMENT_LINE.test(l) && !l.includes('export function')).length, 0);
    // ⭐ RE-RECORDED 2026-08-16 BY EP-1: 8/5 → 9/6, and the +1 is the ADVANCE-EPOCH MINT
    // in src/store/campaignAdvanceSession.js. This is a DECLARED growth, not a discovered
    // one — the compile priced the mint at that exact file, and §3a rules the store layer
    // the only lint-legal home for it (eslint bans the entropy primitives across
    // src/domain, src/kernel except prng.js, src/workers and src/generators). The
    // certification row's INVERTED purity arm asserts the confinement from the other side:
    // exactly one entropy call site in this member's family, and it is in src/store.
    expect({ hits, calls }).toEqual({ hits: 9, calls: 6 });
  });

  test('`hash01` CALLER modules = 15, and the figure is a caller count not a mention count', () => {
    // grep -rn "hash01(" src | grep -v "function hash01(" | cut -d: -f1 | sort -u | wc -l
    // ⚠ THE VOLUME FROZE TEN. Measured at the EP base it was FOURTEEN — the four arrivals were
    // the espionage trio and informationNews, landed by families EP never touches. That is why
    // the baseline is DERIVED at each compile and never inherited.
    // ⭐ RE-RECORDED 2026-08-22 BY WF-8A: 14 → 15, and the +1 is a DECLARED arrival rather than a
    // discovered one. `src/domain/worldPulse/faithNews.js` is the estate's SIXTH phrased-kind
    // registry and its picker copies the CURED `hash01` spelling verbatim from informationNews,
    // which is caller fourteen — the same avalanche-before-multiply cure, taken for the same
    // recorded reason (a raw `fnv % poolLength` aliases onto a parity class). ⛔ THE GROWTH IS
    // THE POINT, NOT A COST: every new caller of the cured root is one fewer site that could
    // have copied the uncured one, and the nine sites still carrying it are docketed as
    // CR-IN1C-DRIFT. Authorized at ODQ §350 with the registry mint.
    const callers = ALL_FILES.filter((f) => read(f).split('\n')
      .some((l) => l.includes('hash01(') && !/function hash01\(/.test(l)));
    expect(callers).toHaveLength(15);
    const mentions = ALL_FILES.filter((f) => read(f).includes('hash01'));
    expect(mentions.length, 'MENTIONS is a different, larger population').toBeGreaterThan(callers.length);
  });

  test('hash-helper DEFINITIONS in src = 34', () => {
    // grep -rnE "function (fnv1a32|hash01|hashUnit|hash32|fnv1a)" src | wc -l
    // ⭐ RE-RECORDED 2026-08-22 BY MF-T2H: 32 → 34, a DECLARED arrival rather than a discovered
    // one. The +2 are `hash32` and `hashUnit` in `src/domain/townMap/fabric/fabricRng.js`, the
    // seeding law ported from the sealed W3 sandbox tip with the D3a port tranche.
    // ⛔ THE DISPOSITION, AND IT IS WHY THIS IS THE ONLY ARM THAT MOVED. This census anchors on
    // the READ — a value taken off a world-shaped object — and on the COMPOSITIONS built from a
    // world root. The fabric's seeding law does NEITHER: it takes `settlementSeed` as an ARGUMENT
    // and never reaches for `worldState.rngSeed`, which is the whole architectural point of the
    // key-anchored fork (a fabric that read ambient state could not promise byte-unchanged output
    // for unchanged facts). Measured, not asserted: with the member applied this file reds on
    // exactly ONE of its 31 arms — this counter — while both exact-set rosters, COMPOSITIONS and
    // READ_SITES, stay green. Two new DEFINITIONS, zero new roots.
    // ⚠ AND THE TWO NAMES COULD NOT BE CHOSEN AWAY. They are the sealed source's own API, pinned
    // by the port's sealed-equivalence proof (64 of 64 stream rows byte-for-byte); renaming them
    // to dodge this regex would break the equivalence this instrument has no view of.
    // `censusAuthorization`: ODQ §276 (the build sheet), §304.4 (the D3a port charter) and §390
    // (the chartered additions), under §299.4's binding-forward rule. ⭐ THE RE-RECORD ITSELF IS
    // RATIFIED AT ODQ §403, which ruled the escalation clause above reserved for a new COMPOSITION
    // or a new READ — neither of which this creates — with WF-8A's 14 → 15 (§350) the governing
    // shape.
    const re = /function (fnv1a32|hash01|hashUnit|hash32|fnv1a)/;
    expect(ALL_FILES.reduce((n, f) => n + read(f).split('\n').filter((l) => re.test(l)).length, 0)).toBe(34);
  });

  test('the corpus the whole census walks is real', () => {
    // The fail-closed floor: every assertion above is over ALL_FILES, so an empty or
    // mis-rooted collection would green them all at once.
    expect(ALL_FILES.length).toBeGreaterThan(500);
    expect(() => read('src/kernel/prng.js')).not.toThrow();
  });
});

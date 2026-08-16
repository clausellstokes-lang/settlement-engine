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
 *  it. It is found by the write-key detector instead, together with the two impostors that
 *  spell the same KEY off a value that is not a world root. EXACT SET — a second writer is
 *  the single most dangerous thing this file can be asked to notice. */
const WRITE_KEY_SITES = Object.freeze([
  ['NC-2', 'src/domain/ai/personaSlicer.js', 'a settlement `_seed` — WEAK control, zero src importers'],
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
  'src/domain/worldPulse/npcLadderContest.js': ['seed'],
  'src/domain/worldPulse/pulseKernel.js': ['startingWorldState.rngSeed'],
  'src/domain/worldPulse/realmVerbExecution.js': ['state.rngSeed', 'seed'],
  'src/domain/worldPulse/roadsKernel.js': ['rngSeed'],
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
  ['20', 'src/domain/worldPulse/npcLadderContest.js', '${seed}|ladder-support:${sid}:${nid}:${year}', 'hash01', 'YEAR-KEYED'],
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
  ['14', 'src/domain/worldPulse/realmVerbExecution.js', "${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}", 'DEFERRED', 'TICK-VARYING'],
  ['14d', 'src/domain/worldPulse/realmVerbExecution.js', '${seed}:${k}', 'createPRNG', 'DERIVED'],
  ['14e', 'src/domain/worldPulse/realmVerbExecution.js', '${seed}:exodus', 'createPRNG', 'DERIVED'],
  ['15', 'src/domain/worldPulse/realmVerbExecution.js', "${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}", 'DEFERRED', 'TICK-VARYING'],
  ['15d', 'src/domain/worldPulse/realmVerbExecution.js', '${seed}:${k}', 'createPRNG', 'DERIVED'],
  ['16', 'src/domain/worldPulse/realmVerbExecution.js', "${String(state.rngSeed ?? 'realm')}:realm_verb", 'DEFERRED', 'TICK-FREE'],
  ['16d', 'src/domain/worldPulse/realmVerbExecution.js', '${seed}:${k}', 'createPRNG', 'DERIVED'],
  ['2', 'src/domain/worldPulse/roadsKernel.js', '${rngSeed}::roads-hazard:${mid}:${now2}', 'createPRNG', 'TICK-VARYING'],
  ['3', 'src/domain/worldPulse/roadsKernel.js', '${rngSeed}::roads:cadence:${npcKey}:${year}', 'createPRNG', 'YEAR-KEYED'],
  ['4', 'src/domain/worldPulse/roadsKernel.js', '${rngSeed}::roads-genesis:${sid}:${now2}', 'createPRNG', 'TICK-VARYING'],
  ['5', 'src/domain/worldPulse/roadsKernel.js', '${rngSeed}::roads:stay:${sid}:${c.npcKey}:${year}', 'createPRNG', 'YEAR-KEYED'],
  ['1', 'src/domain/worldPulse/seasons.js', '${rngSeed}::season:${year}:${String(settlementId)}', 'createPRNG', 'YEAR-KEYED'],
  ['24', 'src/domain/worldPulse/sovereigntyMarketStage.js', 'sovereignty.offer.${realmId}.${sellerId}.${buyerId}.${assetId}.${episode}', 'DEFERRED', 'TICK-VARYING'],
  ['6', 'src/domain/worldPulse/traditionsKernel.js', "${String(asObject(worldState).rngSeed || '')}::tradition:${rec.id}:${year}", 'createPRNG', 'YEAR-KEYED'],
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
  ['src/domain/worldPulse/pulseKernel.js', 'rngSeed: startingWorldState.rngSeed,', 'src/domain/worldPulse/seasons.js'],
  ['src/domain/worldPulse/traditionsKernel.js', 'seasonalSeverityFor(String(asObject(worldState).rngSeed', 'src/domain/worldPulse/seasons.js'],
  ['src/domain/townMap/mapDress.js', 'seasonalSeverityFor(rngSeed, year, settlementId)', 'src/domain/worldPulse/seasons.js'],
  ['src/domain/worldPulse/generosityKernel.js', 'intelEligible(intelSeed', 'src/domain/spatial/intelActs.js'],
  ['src/domain/worldPulse/roadsKernel.js', 'rngSeed, now2, idSet', 'src/domain/roads/seaRoads.js'],
  ['src/domain/worldPulse/npcLadderKernel.js', "const seed = String(asObject(worldState).rngSeed || '');", 'src/domain/worldPulse/npcLadderContest.js'],
  ['src/domain/worldPulse/demographicsKernel.js', 'realmId: typeof asObject(worldState).rngSeed', 'src/domain/worldPulse/demographicsPlans.js'],
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
  test('`rngSeed` LINES in src = 68 across 30 files', () => {
    // grep -rn "rngSeed" src --include="*.js" --include="*.jsx" | wc -l
    // ⚠ LINES, not occurrences. The per-OCCURRENCE count (grep -o) is 80, and quoting one
    // number under the other's label is how this figure was reported as "grown by 12" when
    // the tree had not moved at all.
    const hits = ALL_FILES.filter((f) => /rngSeed/.test(read(f)));
    const lines = ALL_FILES.reduce((n, f) => n + read(f).split('\n').filter((l) => l.includes('rngSeed')).length, 0);
    expect({ lines, files: hits.length }).toEqual({ lines: 68, files: 30 });
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

  test('`hash01` CALLER modules = 14, and the figure is a caller count not a mention count', () => {
    // grep -rn "hash01(" src | grep -v "function hash01(" | cut -d: -f1 | sort -u | wc -l
    // ⚠ THE VOLUME FROZE TEN. Measured at this base it is FOURTEEN — the four arrivals are the
    // espionage trio and informationNews, landed by families EP never touches. That is why the
    // baseline is DERIVED at each compile and never inherited.
    const callers = ALL_FILES.filter((f) => read(f).split('\n')
      .some((l) => l.includes('hash01(') && !/function hash01\(/.test(l)));
    expect(callers).toHaveLength(14);
    const mentions = ALL_FILES.filter((f) => read(f).includes('hash01'));
    expect(mentions.length, 'MENTIONS is a different, larger population').toBeGreaterThan(callers.length);
  });

  test('hash-helper DEFINITIONS in src = 32', () => {
    const re = /function (fnv1a32|hash01|hashUnit|hash32|fnv1a)/;
    expect(ALL_FILES.reduce((n, f) => n + read(f).split('\n').filter((l) => re.test(l)).length, 0)).toBe(32);
  });

  test('the corpus the whole census walks is real', () => {
    // The fail-closed floor: every assertion above is over ALL_FILES, so an empty or
    // mis-rooted collection would green them all at once.
    expect(ALL_FILES.length).toBeGreaterThan(500);
    expect(() => read('src/kernel/prng.js')).not.toThrow();
  });
});
